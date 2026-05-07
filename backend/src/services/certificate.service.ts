import { certificateRepository } from "../repositories/certificate.repositry";
import { generateCertificatePDF, generateHTML, mergePDFs } from "../utils/certificateGenerator";
import { generateId, generateCertificateNumber } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadBuffer, deleteImageByUrl } from "../utils/cloudinaryImageHandler";

export const certificateService = {
  createOrUpdate: async (
    teacherId:        string,
    program:          string,
    module:           string,
    unit:             string | null,
    trainingRecordId: string
  ) => {
    let certificate = await certificateRepository.findByTeacherAndProgram(teacherId,program);

    if (!certificate) {
      const id                = await generateId("certificates");
      const certificateNumber = await generateCertificateNumber(program);

      certificate = await certificateRepository.create({
        id,
        teacherId,
        program,
        certificateNumber,
      });
    }

    const duplicate = await certificateRepository.findModuleDuplicate(certificate.id,module,unit);

    if (!duplicate) {
      const moduleId = await generateId("certificate_modules");
      await certificateRepository.addModule({
        id: moduleId,
        certificateId:    certificate.id,
        trainingRecordId,
        module,
        unit,
      });

      if (certificate.pdfUrl) {
        try {
          await deleteImageByUrl(certificate.pdfUrl);
        } catch {
          // ignore deletion errors
        }
      }

      await certificateRepository.updateTimestamp(certificate.id);
    }

    return certificate;
  },

  resetStatus: async (certificateNumber: string) => {
    const certificate = await certificateRepository.findByNumber(certificateNumber);
    if (!certificate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
    }
    await certificateRepository.updateStatus(certificate.id, "pending");
    if (certificate.pdfUrl) {
      try { await deleteImageByUrl(certificate.pdfUrl); } catch { /* ignore */ }
    }
  },

  getByNumber: async (certificateNumber: string) => {
    const certificate = await certificateRepository.findByNumber(certificateNumber);

    if (!certificate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
    }

    return certificateRepository.findWithModules(certificate.id);
  },

  downloadByNumber: async (certificateNumber: string) => {
    const certificate = await certificateRepository.findByNumber(certificateNumber);

    if (!certificate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
    }

    if (certificate.status === "pending" || certificate.status === "generating") {
      throw new AppError(202, ErrorCode.VALIDATION_ERROR, "Certificate is being generated, please try again later");
    }

    if (certificate.status === "failed") {
      throw new AppError(500, ErrorCode.INTERNAL_SERVER_ERROR, "Certificate generation failed");
    }

    if (!certificate.pdfUrl) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate PDF not found");
    }

    return certificate.pdfUrl;
  },

  triggerBulkGeneration: async (eventId: string) => {
    const records = await certificateRepository.findByEventIdWithTeachers(eventId);

    if (records.length === 0) {
      throw new AppError(
        404,
        ErrorCode.NOT_FOUND,
        "No training records found for this event"
      );
    }

    const jobId = await generateId("bulk_jobs");
    const job   = await certificateRepository.createBulkJob({
      id:         jobId,
      eventId,
      totalCount: records.length,
    });

    return job;
  },

  getBulkJobStatus: async (jobId: string) => {
    const job = await certificateRepository.findBulkJob(jobId);

    if (!job) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Bulk job not found");
    }

    return job;
  },

  // Called by cron — process pending individual certificates
  processPendingCertificates: async () => {
    const pending = await certificateRepository.findPending();

    for (const certificate of pending) {
      try {
        await certificateRepository.updateStatus(certificate.id, "generating");

        const data = await certificateRepository.findWithModules(certificate.id);
        if (!data) continue;

        const pdf = await generateCertificatePDF({
          teacherName:       data.teacher.name,
          teacherId:         data.teacher.id,
          program:           data.program,
          certificateNumber: data.certificateNumber,
          issuedAt:          data.issuedAt,
          modules:           data.modules,
        });

        const pdfUrl = await uploadBuffer(
          pdf,
          "portfolio-utility/certificates",
          `${data.certificateNumber}`
        );

        await certificateRepository.updateStatus(certificate.id, "ready", pdfUrl);
      } catch (error) {
        console.error(`❌ Certificate ${certificate.id} generation failed:`, error);
        await certificateRepository.updateStatus(certificate.id, "failed");
      }
    }
  },

  // Called by cron — process pending bulk jobs
  processPendingBulkJobs: async () => {
    const pendingJobs = await certificateRepository.findPendingBulkJobs();

    for (const job of pendingJobs) {
      try {
        await certificateRepository.updateBulkJob(job.id, "processing");

        const records = await certificateRepository.findByEventIdWithTeachers(job.eventId);
        const pdfs:   Buffer[] = [];
        let   doneCount = 0;

        for (const record of records) {
          const cert = await certificateRepository.findByTeacherAndProgram(
            record.teacherId,
            record.program
          );

          if (!cert || !cert.pdfUrl || cert.status !== "ready") {
            continue;
          }

          // Fetch PDF from Cloudinary
          const response = await fetch(cert.pdfUrl);
          const buffer   = Buffer.from(await response.arrayBuffer());
          pdfs.push(buffer);
          doneCount++;

          await certificateRepository.updateBulkJob(
            job.id,
            "processing",
            { doneCount }
          );
        }

        if (pdfs.length === 0) {
          await certificateRepository.updateBulkJob(job.id, "failed");
          continue;
        }

        const merged  = await mergePDFs(pdfs);
        const pdfUrl  = await uploadBuffer(
          merged,
          "portfolio-utility/bulk-certificates",
          `bulk-${job.eventId}-${Date.now()}`
        );

        await certificateRepository.updateBulkJob(
          job.id,
          "completed",
          { pdfUrl, doneCount }
        );
      } catch (error) {
        await certificateRepository.updateBulkJob(job.id, "failed");
      }
    }
  },
};