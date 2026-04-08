import { FastifyRequest, FastifyReply } from "fastify";
import { trainingRecordService } from "../services/trainingRecord.service";
import { createTrainingRecordSchema, bulkCreateTrainingRecordSchema, updateTrainingRecordSchema } from "../utils/validation";
import { calculatePagination, getPaginationParams } from "../utils/pagination";

export const createTrainingRecord = async (
    request: FastifyRequest,
    reply: FastifyReply
    ) => {
    const body = createTrainingRecordSchema.safeParse(request.body);
    if (!body.success) {
        return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors:  body.error.flatten().fieldErrors,
        });
    }

    const record = await trainingRecordService.create(body.data, request);

    return reply.status(201).send({
        success: true,
        message: "Training record created successfully",
        data:    record,
    });
};

export const bulkCreateTrainingRecords = async (
    request: FastifyRequest,
    reply: FastifyReply
    ) => {
    const body = bulkCreateTrainingRecordSchema.safeParse(request.body);

    if (!body.success) {
        return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors:  body.error.flatten().fieldErrors,
        });
    }

    const result = await trainingRecordService.bulkCreate(body.data);

    return reply.status(201).send({
        success: true,
        message: `${result.created.length} records created, ${result.skipped.length} skipped`,
        data:    result,
    });
};

export const getTrainingRecordsByTeacher = async (
    request: FastifyRequest,
    reply: FastifyReply
    ) => {
    const { teacherId } = request.params as { teacherId: string };
    const { page, limit } = getPaginationParams(request.query as Record<string, unknown>)

    const all = await trainingRecordService.getByTeacher(teacherId);
    const total = all.length;
    const paginated = all.slice((page - 1) * limit, page * limit);

    return reply.send({
        success: true,
        message: paginated.length === 0? "No records found": "Training records fetched successfully",
        data: paginated,
        pagination: calculatePagination(total, page, limit),
    });
};

export const getTrainingRecordsByEvent = async (
    request: FastifyRequest,
    reply: FastifyReply
    ) => {
    const { eventId } = request.params as { eventId: string };
    const { page, limit } = getPaginationParams( request.query as Record<string, unknown>);

    const all     = await trainingRecordService.getByEvent(eventId);
    const total = all.length;
    const paginated = all.slice((page - 1) * limit, page * limit);

    return reply.send({
        success: true,
        message: paginated.length === 0? "No records found": "Training records fetched successfully",
        data: paginated,
        pagination: calculatePagination(total, page, limit),
    });
};

export const updateTrainingRecord = async (
    request: FastifyRequest,
    reply: FastifyReply
    ) => {
    const { id } = request.params as { id: string };
    const body = updateTrainingRecordSchema.safeParse(request.body);

    if (!body.success) {
        return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors:  body.error.flatten().fieldErrors,
        });
    }

    const record = await trainingRecordService.update(id, body.data);

    return reply.send({
        success: true,
        message: "Training record updated successfully",
        data:    record,
    });
};

export const deleteTrainingRecord = async (
    request: FastifyRequest,
    reply: FastifyReply
    ) => {
    const { id } = request.params as { id: string };
    await trainingRecordService.delete(id);

    return reply.send({
        success: true,
        message: "Training record deleted successfully",
    });
};