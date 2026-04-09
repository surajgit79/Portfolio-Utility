import { certificateRepository } from "../repositories/certificate.repositry"
import { generateCertificatePDF, mergePDFs } from "../utils/certificate";
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
            category: event.category,
            sector: event.sector,
            phase: event.phase,
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
            trainingName: event.name,
            category: event.category,
            sector: event.sector,
            phase: event.phase ?? null,
            venue: event.venue ?? null,
            startDate: event.startDate,
            duration: event.duration,
            description: event.description,
            mentorName: event.mentorsName,
            certificateNumber: record.certificateNumber,
        });
    },

    bulkGeneratePDF: async (eventId: string) => {
    const records = await certificateRepository.findByEventId(eventId);

    if (records.length === 0) {
      throw new AppError(
        404,
        ErrorCode.NOT_FOUND,
        "No training records found for this event"
      );
    }

    const event = await certificateRepository.findTrainingEvent(eventId);

    if (!event) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
    }

    // Sort alphabetically by teacher name
    const teacherDetails = await Promise.all(
      records.map(async (record) => {
        const teacher = await certificateRepository.findTeacher(record.teacherId);
        return { record, teacher };
      })
    );

    teacherDetails.sort((a, b) =>
      a.teacher.name.localeCompare(b.teacher.name)
    );

    // Generate individual PDFs
    const pdfs = await Promise.all(
      teacherDetails.map(({ record, teacher }) =>
        generateCertificatePDF({
          teacherName:       teacher.name,
          trainingName:      event.name,
          category:          event.category,
          sector:            event.sector,
          phase:             event.phase     ?? null,
          venue:             event.venue     ?? null,
          startDate:         event.startDate,
          duration:          event.duration,
          description:       event.description ?? null,
          mentorName:        event.mentorsName  ?? null,
          certificateNumber: record.certificateNumber,
        })
      )
    );

    return mergePDFs(pdfs);
  }, 
}