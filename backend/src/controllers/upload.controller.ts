import { FastifyReply, FastifyRequest } from "fastify";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { parseCSV, validateCSVHeaders } from "../utils/csvParser";
import { uploadService } from "../services/upload.service";

const getCSVBuffer = async (request: FastifyRequest): Promise<Buffer>=>{
    const data = await request.file();
    if(!data){
        throw new AppError(400, ErrorCode.VALIDATION_ERROR, "No file uploaded");
    }

    if(!data.mimetype.includes("csv") && !data.mimetype.includes("text")){
        throw new AppError(400, ErrorCode.VALIDATION_ERROR, "File must be a csv");
    }

    return data.toBuffer();
}

export const uploadTeacherCSV = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const buffer = await getCSVBuffer(request);
    const result = await uploadService.processTeacherCSV(buffer);

    return reply.status(201).send({
        success: true,
        message: `${result.created.length} teachers created, ${result.skipped.length} skipped, ${result.errors.length} errors`,
        data: result,
    });    
};

export const uploadCareerRecordsCSV = async (
    request: FastifyRequest,
    reply:   FastifyReply
) => {
    const buffer = await getCSVBuffer(request);
    const result = await uploadService.processCareerRecordsCSV(buffer);

    return reply.status(201).send({
        success: true,
        message: `${result.created.length} career records created, ${result.skipped.length} skipped, ${result.errors.length} errors`,
        data:    result,
    });
};

export const uploadEventRecordsCSV = async (
    request: FastifyRequest,
    reply:   FastifyReply
) => {
    const buffer = await getCSVBuffer(request);
    const result = await uploadService.processEventRecordsCSV(buffer);

    return reply.status(201).send({
        success: true,
        message: `${result.created.length} event records created, ${result.skipped.length} skipped, ${result.errors.length} errors`,
        data:    result,
    });
};

export const uploadTrainingRecordsCSV = async (
    request: FastifyRequest,
    reply:   FastifyReply
) => {
    const buffer = await getCSVBuffer(request);
    const result = await uploadService.processTrainingRecordsCSV(buffer);

    return reply.status(201).send({
        success: true,
        message: `${result.created.length} training records created, ${result.skipped.length} skipped, ${result.errors.length} errors`,
        data:    result,
    });
};

export const uploadSkillsCSV = async(
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const buffer = await getCSVBuffer(request);
    const result = await uploadService.processSkillsCSV(buffer);

    return reply.status(201).send({
        success: true,
        message: `${result.created.length} skills created, ${result.skipped.length} skipped, ${result.errors.length} errors`,
        data: result,
    });
};