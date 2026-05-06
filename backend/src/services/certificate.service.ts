import { db }                                   from "../db/client";
import { certificateRepository }             from "../repositories/certificate.repositry";
import { generateCertificatePDF, mergePDFs, generateHTML } from "../utils/certificateGenerator";
import { generateId, generateCertificateNumber } from "../utils/idGenerator";
import { AppError, ErrorCode }               from "../utils/errorHandler";
import puppeteer from "puppeteer";

export const certificateService = {
  // Called when a training record is created
  createOrUpdate: async (
    teacherId:        string,
    program:          string,
    module:           string,
    unit:             string | null,
    trainingRecordId: string
  ) => {
    let certificate = await certificateRepository.findByTeacherAndProgram(
      teacherId,
      program
    );

    if (!certificate) {
      const id = await generateId("certificates");
      const certificateNumber = await generateCertificateNumber(program);

      certificate = await certificateRepository.create({
        id,
        teacherId,
        program,
        certificateNumber,
      });
    }

    const duplicate = await certificateRepository.findModuleDuplicate(
      certificate.id,
      module,
      unit
    );

    if (!duplicate) {
      const moduleId = await generateId("certificate_modules");
      await certificateRepository.addModule({
        id: moduleId,
        certificateId: certificate.id,
        trainingRecordId,
        module,
        unit,
      });

      await certificateRepository.updateTimestamp(certificate.id);
    }

    return certificate;
  },

  getByNumber: async (certificateNumber: string) => {
    const certificate = await certificateRepository.findByNumber(certificateNumber);

    if (!certificate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
    }

    return certificateRepository.findWithModules(certificate.id);
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

  bulkGeneratePDF: async (eventId: string) => {
    const records = await certificateRepository.findByEventIdWithTeachers(eventId);

    if (records.length === 0) {
      throw new AppError(
        404,
        ErrorCode.NOT_FOUND,
        "No training records found for this event"
      );
    }

    // Get program from the training event
    const { trainingEvents } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");
    const [event] = await db
      .select({ program: trainingEvents.program })
      .from(trainingEvents)
      .where(eq(trainingEvents.id, eventId));

    if (!event) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
    }

    const program = event.program;

    // Use single browser instance for all PDFs
    const browser = await puppeteer.launch({
      headless: true,
      args:     ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const pdfs: Buffer[] = [];

    try {
      // Process in batches of 5
      const batchSize = 5;

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        const batchPDFs = await Promise.all(
          batch.map(async ({ teacherId, teacherName }) => {
            // Get their program certificate
            const cert = await certificateRepository.findByTeacherAndProgram(
              teacherId,
              program
            );

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
};