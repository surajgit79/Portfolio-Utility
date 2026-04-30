import { certificateRepository } from "../repositories/certificate.repositry"
import { generateCertificatePDF, mergePDFs } from "../utils/certificateGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";

const getSignatories = (program: string): { name: string; title: string } => {
  switch (program) {
    case "Activity-based Mathematics":
      return { name: "Nikita Bhattarai", title: "ABM Co-ordinator" };
    case "Reading & Language":
      return { name: "Sita Thing", title: "R&L Co-ordinator" };
    case "Pre-School Transformation":
      return { name: "Hari Acharya", title: "PST Co-ordinator" };
    default:
      return { name: "Co-ordinator", title: "Program Co-ordinator" };
  }
};

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
        const coordinator = getSignatories(event.program);

        return generateCertificatePDF({
            teacherName: teacher.name,
            teacherId: teacher.id,
            programTitle: `for completing ${event.program} Program`,
            topics: [event.module, ...(event.unit ? [event.unit] : [])],
            certificateNumber: record.certificateNumber,
            issuedAt: record.createdAt,
            signatories: {
                leftName: "Abyekta Khanal",
                leftDesignation: "Chief Executive Officer",
                leftSignature: "https://camo.githubusercontent.com/735a0a4e23fbae48c85c13cf7a76075358dc77cf95d6a2cf1b2c051b85056339/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f393837332f3236383034362f39636564333435342d386566632d313165322d383136652d6139623137306135313030342e706e67",
                rightName: coordinator.name,
                rightDesignation: coordinator.title,
                rightSignature: "https://onlinepngtools.com/images/examples-onlinepngtools/george-walker-bush-signature.png",
            },
        });
    },

    generatePDFFromRecord: async(recordId: string) =>{
        const record = await certificateRepository.findByRecordId(recordId);
        if(!record){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Training record not found");
        }

        const event = await certificateRepository.findTrainingEvent(record.trainingEventId);
        const teacher = await certificateRepository.findTeacher(record.teacherId);
        const coordinator = getSignatories(event.program);

        return generateCertificatePDF({
            teacherName: teacher.name,
            teacherId: teacher.id,
            programTitle: `for completing ${event.program} Program`,
            topics: [event.module, ...(event.unit ? [event.unit] : [])],
            certificateNumber: record.certificateNumber,
            issuedAt: record.createdAt,
            signatories: {
                leftName: "Abyekta Khanal",
                leftDesignation: "Chief Executive Officer",
                leftSignature: "https://camo.githubusercontent.com/735a0a4e23fbae48c85c13cf7a76075358dc77cf95d6a2cf1b2c051b85056339/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f393837332f3236383034362f39636564333435342d386566632d313165322d383136652d6139623137306135313030342e706e67",
                rightName: coordinator.name,
                rightDesignation: coordinator.title,
                rightSignature: "https://onlinepngtools.com/images/examples-onlinepngtools/george-walker-bush-signature.png",
            },
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

      const coordinator = getSignatories(event.program);

      // Generate individual PDFs
      const pdfs = await Promise.all(
        records.map(({ teacherName, teacherId, certificateNumber, createdAt }) =>
          generateCertificatePDF({
            teacherName,
            teacherId,
            programTitle: `for completing ${event.program} Program`,
            topics: [event.module, ...(event.unit ? [event.unit] : [])],
            certificateNumber,
            issuedAt: createdAt,
            signatories: {
                leftName: "Abyekta Khanal",
                leftDesignation: "Chief Executive Officer",
                leftSignature: "https://camo.githubusercontent.com/735a0a4e23fbae48c85c13cf7a76075358dc77cf95d6a2cf1b2c051b85056339/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f393837332f3236383034362f39636564333435342d386566632d313165322d383136652d6139623137306135313030342e706e67",
                rightName: coordinator.name,
                rightDesignation: coordinator.title,
                rightSignature: "https://onlinepngtools.com/images/examples-onlinepngtools/george-walker-bush-signature.png",
            },
          })
        )
      );

     return mergePDFs(pdfs);
    }, 
}