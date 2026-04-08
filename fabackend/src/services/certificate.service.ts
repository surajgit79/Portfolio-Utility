import { certificateRepository } from "../repositories/certificate.repositry"
import { generateCertificatePDF } from "../utils/certificate";
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
}