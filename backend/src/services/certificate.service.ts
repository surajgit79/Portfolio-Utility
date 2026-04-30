import { certificateRepository } from "../repositories/certificate.repositry"
import { generateCertificatePDF, mergePDFs } from "../utils/certificateGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";

export const certificateService = {
    getByNumber: async(certificateNumber: string)=>{
        const record = await certificateRepository.findByCertificateNumber(certificateNumber);
        if(!record){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
        }

        const event = await certificateRepository.findTrainingEvent(record.trainingEventId);
        const teacher = await certificateRepository.findTeacher(record.teacherId);

        return {
            certificateNumber: record.certificateNumber,
            teacherName: teacher.name,
            trainingName: event.name,
            program: event.program,
            module: event.module,
            unit: event.unit,
            venue: event.venue,
            startDate: event.startDate,
            duration: event.duration,
            description: event.description,
            mentorName: event.mentorsName,
            issuedAt: record.createdAt,
        };
    },

    generatePDF: async(certificateNumber: string) =>{
        const record = await certificateRepository.findByCertificateNumber(certificateNumber);
        if(!record){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Certificate not found");
        }

        const event = await certificateRepository.findTrainingEvent(record.trainingEventId);
        const teacher = await certificateRepository.findTeacher(record.teacherId);

        return generateCertificatePDF({
            teacherName: teacher.name,
            teacherId: teacher.id,
            trainingName: event.name,
            program: event.program,
            module: event.module,
            unit: event.unit ?? null,
            venue: event.venue ?? null,
            startDate: event.startDate,
            duration: event.duration,
            description: event.description,
            mentorName: event.mentorsName,
            certificateNumber: record.certificateNumber,
            issuedAt: record.createdAt,
        });
    },

    bulkGeneratePDF: async (eventId: string) => {
      const event = await certificateRepository.findTrainingEvent(eventId);
      if (!event) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
      }

      const records = await certificateRepository.findByEventIdWithTeachers(eventId);
      if (records.length === 0) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Training records not found for this event");
      }

      // Generate individual PDFs
      const pdfs = await Promise.all(
        records.map(({ teacherName, teacherId, certificateNumber, createdAt }) =>
          generateCertificatePDF({
            teacherName,
            teacherId,
            trainingName: event.name,
            program: event.program,
            module: event.module,
            unit: event.unit ?? null,
            venue: event.venue     ?? null,
            startDate: event.startDate,
            duration: event.duration,
            description: event.description ?? null,
            mentorName: event.mentorsName  ?? null,
            certificateNumber,
            issuedAt: createdAt,
          })
        )
      );

      return mergePDFs(pdfs);
    }, 
}