import { certificateRepository } from "../repositories/certificate.repositry";
import { generateCertificatePDF, mergePDFs } from "../utils/certificateGenerator";
import { generateId, generateCertificateNumber } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadBuffer, deleteImageByUrl, getSignedUrlFromUrl } from "../utils/s3ImageHandler";

const sanitizePublicId = (id: string): string => id.replace(/[^a-zA-Z0-9_-]/g, "_");

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
    await certificateRepository.updateStatus(certificate.id, "pending", undefined, "");
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

  downloadByNumber: async (certificateNumber: string): Promise<{ pdfUrl: string; pdfBuffer?: Buffer }> => {
    const certificate = await certificateRepository.findByNumber(certificateNumber);

    if (!certificate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
    }

    if (certificate.status === "pending" || certificate.status === "generating") {
      throw new AppError(202, ErrorCode.VALIDATION_ERROR, "Certificate is being generated, please try again later");
    }

    if (certificate.status === "failed") {
      const reason = (certificate as any).errorReason ?? "Unknown error during generation";
      throw new AppError(202, ErrorCode.VALIDATION_ERROR, `Certificate generation failed: ${reason}. Retry scheduled on next cron cycle.`);
    }

    if (!certificate.pdfUrl || certificate.pdfUrl.includes("/raw/")) {
      const data = await certificateRepository.findWithModules(certificate.id);
      if (!data) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate data not found for regeneration");
      }
      try {
        await certificateRepository.updateStatus(certificate.id, "generating");
        const pdf = await generateCertificatePDF({
          teacherName:       data.teacher.name,
          teacherId:         data.teacher.id,
          program:           data.program,
          certificateNumber: data.certificateNumber,
          issuedAt:          data.issuedAt,
          modules:           data.modules,
        });
        const newUrl = await uploadBuffer(
          pdf, "portfolio-utility/certificates",
          sanitizePublicId(data.certificateNumber)
        );
        await certificateRepository.updateStatus(certificate.id, "ready", newUrl);
        return { pdfUrl: newUrl, pdfBuffer: pdf };
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
        await certificateRepository.updateStatus(certificate.id, "failed", undefined, errMsg);
        throw new AppError(502, ErrorCode.VALIDATION_ERROR, `Inline regeneration failed: ${errMsg}. Please retry.`);
      }
    }

    return { pdfUrl: certificate.pdfUrl };
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

  downloadOrGenerateBulk: async (eventId: string): Promise<{ pdfUrl?: string; pending?: boolean }> => {
    const existing = await certificateRepository.findCompletedBulkJobByEvent(eventId);
    if (existing?.pdfUrl) return { pdfUrl: existing.pdfUrl };

    const inFlight = await certificateRepository.findPendingBulkJobByEvent(eventId);
    if (inFlight) return { pending: true };

    const records = await certificateRepository.findByEventIdWithTeachers(eventId);
    if (records.length === 0) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "No training records found for this event");
    }

    const allReady: { cert: any; teacherName: string }[] = [];

    for (const record of records) {
      let cert = await certificateRepository.findByTeacherAndProgram(record.teacherId, record.program);

      if (!cert) {
        const id = await generateId("certificates");
        const certificateNumber = await generateCertificateNumber(record.program);
        cert = await certificateRepository.create({ id, teacherId: record.teacherId, program: record.program, certificateNumber });
      }

      const moduleExists = await certificateRepository.findModuleDuplicate(cert.id, record.module, record.unit);
      if (!moduleExists) {
        const moduleId = await generateId("certificate_modules");
        await certificateRepository.addModule({
          id: moduleId, certificateId: cert.id, trainingRecordId: record.trainingRecordId,
          module: record.module, unit: record.unit,
        });
        if (cert.pdfUrl) { try { await deleteImageByUrl(cert.pdfUrl); } catch { /* ignore */ } }
        await certificateRepository.updateTimestamp(cert.id);
        cert.status = "pending";
        cert.pdfUrl = null;
      }

      if (cert.status === "ready" && cert.pdfUrl) {
        allReady.push({ cert, teacherName: record.teacherName });
      }
    }

    if (allReady.length < records.length) {
      const jobId = await generateId("bulk_jobs");
      await certificateRepository.createBulkJob({ id: jobId, eventId, totalCount: records.length });
      return { pending: true };
    }

    const pdfs: Buffer[] = [];
    for (const { cert } of allReady) {
      try {
        const signedUrl = await getSignedUrlFromUrl(cert.pdfUrl!);
        const response  = await fetch(signedUrl);
        if (response.ok) {
          pdfs.push(Buffer.from(await response.arrayBuffer()));
        }
      } catch { /* skip un-fetchable */ }
    }

    if (pdfs.length === 0) {
      throw new AppError(502, ErrorCode.VALIDATION_ERROR, "No certificate PDFs could be fetched for bulk merge");
    }

    const merged   = await mergePDFs(pdfs);
    const pdfUrl   = await uploadBuffer(merged, "portfolio-utility/bulk-certificates", sanitizePublicId(`bulk-${eventId}-${Date.now()}`));

    const jobId = await generateId("bulk_jobs");
    await certificateRepository.createBulkJob({
      id: jobId, eventId, totalCount: records.length,
    });
    await certificateRepository.updateBulkJob(jobId, "completed", { pdfUrl, doneCount: pdfs.length });

    return { pdfUrl };
  },

  getBulkJobStatus: async (jobId: string) => {
    const job = await certificateRepository.findBulkJob(jobId);

    if (!job) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Bulk job not found");
    }

    return job;
  },

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
          sanitizePublicId(data.certificateNumber)
        );

        await certificateRepository.updateStatus(certificate.id, "ready", pdfUrl);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error ?? "Unknown error");
        console.error(`Certificate ${certificate.id} generation failed:`, errorMessage, error);
        await certificateRepository.updateStatus(certificate.id, "failed", undefined, errorMessage);
      }
    }
  },

  processPendingBulkJobs: async () => {
    const pendingJobs = await certificateRepository.findPendingBulkJobs();

    for (const job of pendingJobs) {
      try {
        await certificateRepository.updateBulkJob(job.id, "processing");

        const records = await certificateRepository.findByEventIdWithTeachers(job.eventId);
        const pdfs:   Buffer[] = [];
        let   doneCount = 0;

        for (const record of records) {
          let cert = await certificateRepository.findByTeacherAndProgram(
            record.teacherId,
            record.program
          );

          if (!cert) {
            const id                = await generateId("certificates");
            const certificateNumber = await generateCertificateNumber(record.program);
            
            cert = await certificateRepository.create({
              id,
              teacherId: record.teacherId,
              program:   record.program,
              certificateNumber,
            });
          }

          const moduleExists = await certificateRepository.findModuleDuplicate(
            cert.id,
            record.module,
            record.unit
          );
          if (!moduleExists) {
            const moduleId = await generateId("certificate_modules");
            await certificateRepository.addModule({
              id: moduleId,
              certificateId:    cert.id,
              trainingRecordId: record.trainingRecordId,
              module:           record.module,
              unit:             record.unit,
            });

            if (cert.pdfUrl) {
              try { await deleteImageByUrl(cert.pdfUrl); } catch { /* ignore */ }
            }
            await certificateRepository.updateTimestamp(cert.id);
            cert.status = "pending";
            cert.pdfUrl = null;
          }

          if (!cert.pdfUrl || cert.status !== "ready") {
            try {
              await certificateRepository.updateStatus(cert.id, "generating");

              const certificateData = await certificateRepository.findWithModules(cert.id);
              if (!certificateData) continue;

              const pdf = await generateCertificatePDF({
                teacherName:       record.teacherName,
                teacherId:         record.teacherId,
                program:           record.program,
                certificateNumber: cert.certificateNumber,
                issuedAt:          cert.issuedAt,
                modules:           certificateData.modules,
              });

              const pdfUrl = await uploadBuffer(
                pdf,
                "portfolio-utility/certificates",
                sanitizePublicId(cert.certificateNumber)
              );

              await certificateRepository.updateStatus(cert.id, "ready", pdfUrl);
              cert.pdfUrl = pdfUrl;
              cert.status = "ready";
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : JSON.stringify(error ?? "Unknown error");
              console.error(`❌ Certificate ${cert.certificateNumber} generation failed:`, errorMessage, error);
              await certificateRepository.updateStatus(cert.id, "failed", undefined, errorMessage);
              continue;
            }
          }

          try {
            const signedUrl = await getSignedUrlFromUrl(cert.pdfUrl!);
            const response  = await fetch(signedUrl);
            if (!response.ok) {
              const text = await response.text().catch(() => "");
              console.error(`Bulk fetch failed for ${cert.certificateNumber}: HTTP ${response.status} ${text.slice(0, 100)}`);
              continue;
            }
            const buffer   = Buffer.from(await response.arrayBuffer());
            pdfs.push(buffer);
            doneCount++;

            await certificateRepository.updateBulkJob(
              job.id,
              "processing",
              { doneCount }
            );
          } catch (err) {
            console.error(`Bulk fetch error for ${cert.certificateNumber}:`, err instanceof Error ? err.message : JSON.stringify(err ?? "Unknown error"));
            continue;
          }
        }

        if (pdfs.length === 0) {
          await certificateRepository.updateBulkJob(job.id, "failed");
          continue;
        }

        const merged  = await mergePDFs(pdfs);
        const pdfUrl  = await uploadBuffer(
          merged,
          "portfolio-utility/bulk-certificates",
          sanitizePublicId(`bulk-${job.eventId}-${Date.now()}`)
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