import { certificateRepository } from "../repositories/certificate.repositry";
import { generateCertificatePDF, generateHTML, mergePDFs } from "../utils/certificateGenerator";
import { generateId, generateCertificateNumber } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadBuffer, deleteImageByUrl } from "../utils/s3ImageHandler";
import puppeteer from "puppeteer";
import { db } from "../db/client";
import { trainingEvents } from "../db/schema";
import { eq } from "drizzle-orm";

export const certificateService = {
  createOrUpdate: async (
    teacherId:        string,
    program:          string,
    module:           string,
    unit:             string | null,
    trainingRecordId: string
  ) => {
    let certificate = await certificateRepository.findByTeacherAndProgram(teacherId, program);

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

    const duplicate = await certificateRepository.findModuleDuplicate(certificate.id, module, unit);

    if (!duplicate) {
      const moduleId = await generateId("certificate_modules");
      await certificateRepository.addModule({
        id:               moduleId,
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

  generatePDF: async (certificateNumber: string) => {
    const certificate = await certificateRepository.findByNumber(certificateNumber);

    if (!certificate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
    }

    const data = await certificateRepository.findWithModules(certificate.id);

    if (!data) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate data not found");
    }

    return generateCertificatePDF({
      teacherName:       data.teacher.name,
      teacherId:         data.teacher.id,
      program:           data.program,
      certificateNumber: data.certificateNumber,
      issuedAt:          data.issuedAt,
      modules:           data.modules,
    });
  },

  triggerBulkGeneration: async (eventId: string) => {
    const records = await certificateRepository.findByEventIdWithTeachers(eventId);

    if (records.length === 0) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "No training records found for this event");
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

  bulkGeneratePDF: async (eventId: string) => {
    const records = await certificateRepository.findByEventIdWithTeachers(eventId);

    if (records.length === 0) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "No training records found for this event");
    }

    const [event] = await db
      .select({ program: trainingEvents.program })
      .from(trainingEvents)
      .where(eq(trainingEvents.id, eventId));

    if (!event) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
    }

    const program = event.program;
    const browser = await puppeteer.launch({
      headless: true,
      args:     ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const pdfs: Buffer[] = [];

    try {
      const batchSize = 5;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        const batchPDFs = await Promise.all(
          batch.map(async ({ teacherId, teacherName }) => {
            const cert = await certificateRepository.findByTeacherAndProgram(teacherId, program);
            if (!cert) return null;

            const data = await certificateRepository.findWithModules(cert.id);
            if (!data) return null;

            const page = await browser.newPage();
            await page.setContent(
              await generateHTML({
                teacherName:       data.teacher.name,
                teacherId:         data.teacher.id,
                program:           data.program,
                certificateNumber: data.certificateNumber,
                issuedAt:          data.issuedAt,
                modules:           data.modules,
              }),
              { waitUntil: "domcontentloaded", timeout: 60000 }
            );

            const pdf = await page.pdf({
              width:           "991px",
              height:          "700px",
              printBackground: true,
            });

            await page.close();
            return Buffer.from(pdf);
          })
        );

        pdfs.push(...batchPDFs.filter(Boolean) as Buffer[]);
      }
    } finally {
      await browser.close();
    }

    return mergePDFs(pdfs);
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
        console.error(`Certificate ${certificate.id} generation failed:`, error);
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

          const response = await fetch(cert.pdfUrl);
          const buffer   = Buffer.from(await response.arrayBuffer());
          pdfs.push(buffer);
          doneCount++;

          await certificateRepository.updateBulkJob(job.id, "processing", { doneCount });
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

        await certificateRepository.updateBulkJob(job.id, "completed", { pdfUrl, doneCount });
      } catch (error) {
        await certificateRepository.updateBulkJob(job.id, "failed");
      }
    }
  },
};