import { FastifyRequest } from "fastify";
import { trainingEventRepository } from "../repositories/trainingEvent.repository";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { teacherRepository } from "../repositories/teacher.repository";
import { trainingRecordRepository } from "../repositories/trainingRecord.repository";
import { uploadMultipleImages } from "../utils/imageUploader";
import { generateCertificateNumber, generateId } from "../utils/idGenerator";

export const trainingRecordService = {
    create: async(
        data:{
            teacherId: string,
            trainingEventId: string,
            rating: number,
        },
        request:FastifyRequest,
    )=>{
        const event = await trainingEventRepository.findById(data.trainingEventId);
        if(!event){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        const teacher = await teacherRepository.findById(data.teacherId);
        if(!teacher){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
        }

        const record = await trainingRecordRepository.findByTeacherAndEvent(data.teacherId, data.trainingEventId);
        if(record){
            throw new AppError(409, ErrorCode.CONFLICT, "Training records already exists for the teacher");
        }

        let refPhotos: string | undefined;
        if(request.isMultipart()){
            const urls = await uploadMultipleImages(request, "portfolio-utility/training-records");
            if(urls.length>0){
                urls.join(",");
            }
        }

        const id = await generateId("training_records");
        const certificateNumber = await generateCertificateNumber(event.category, event.sector, event.phase?? null);

        return trainingRecordRepository.create({
            id, ...data, certificateNumber, refPhotos
        });
    },

    bulkCreate: async(
        data:{
            trainingEventId:string,
            teacherIds: string[],
            rating: number,
        }
    )=>{
        const event = await trainingEventRepository.findById(data.trainingEventId);
        if(!event){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        const skipped = [];
        const created = [];

        for(const teacherId of data.teacherIds){
            const teacher = await teacherRepository.findById(teacherId);
            if(!teacher){
                skipped.push(teacherId);
                continue;
            }

            const existing = await trainingRecordRepository.findByTeacherAndEvent(teacherId, data.trainingEventId);
            if(existing){
                skipped.push(teacherId);
                continue;
            }

            const id = await generateId("training_records");
            const certificateNumber = await generateCertificateNumber(event.category, event.sector, event.phase?? null);

            const record = await trainingRecordRepository.create({
                id,
                teacherId,
                trainingEventId: data.trainingEventId,
                rating: data.rating,
                certificateNumber,
            });

            created.push(teacherId);
        }
        return { created, skipped};
    },

    getByTeacher: async(teacherId: string)=>{
        const teacher = await teacherRepository.findById(teacherId);
        if(!teacher){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
        }

       return trainingRecordRepository.findByTeacherIdWithEvent(teacherId);
    },

    getByEvent: async(eventId: string)=>{
        const event = await trainingEventRepository.findById(eventId);
        if(!event){
            throw new AppError(404, ErrorCode.NOT_FOUND, "Training event not found");
        }

        return trainingRecordRepository.findByEventId(eventId);
    },

    update: async (id: string, data: {
        rating?:    number;
        refPhotos?: string;
    }) => {
        const existing = await trainingRecordRepository.findById(id);
        if (!existing) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Training record not found");
        }

        return trainingRecordRepository.update(id, {
        ...data,
        updatedAt: new Date(),
        });
    },

    delete: async (id: string) => {
        const existing = await trainingRecordRepository.findById(id);
        if (!existing) {
        throw new AppError(404, ErrorCode.NOT_FOUND, "Training record not found");
        }

        await trainingRecordRepository.delete(id);
    },
}