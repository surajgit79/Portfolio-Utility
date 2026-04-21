import { FastifyReply, FastifyRequest } from "fastify";
import { createTrainingEventSchema, updateTrainingEventSchema } from "../utils/schemaValidator";
import { trainingEventService } from "../services/trainingEvent.service";
import { calculatePagination, getPaginationParams } from "../utils/paginationHandler";

export const createTrainingEvent = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const body = createTrainingEventSchema.safeParse(request.body);
    if(!body.success){
        return reply.status(400).send({
            success: false,
            message: "Validation Failed",
            error: body.error.flatten().fieldErrors,
        });
    }

    const event = await trainingEventService.create(body.data);
    return reply.send({
        success: true,
        message: "Training event created successfully",
        data: event,
    });
};

export const getTrainingEvents = async(
    request: FastifyRequest,
    reply: FastifyReply
) =>{
    const { category, sector, phase } = request.query as {
        category?: string,
        sector?: string,
        phase?: string
    };

    const { page, limit } = getPaginationParams(request.query as Record<string, unknown>);
    const {data, total } = await trainingEventService.getAll(category, sector, phase, page, limit);

    return reply.send({
        success: true,
        message: data.length === 0? "No training events found":"Training events fetched successfully",
        data,
        pagination: calculatePagination(total, page, limit),
    });
};


export const getTrainingEventById = async(
    request: FastifyRequest,
    reply: FastifyReply
) =>{
    const { id } = request.params as {id: string};
    const event = await trainingEventService.getById(id);

    return reply.send({
        success: true,
        message: "Training event fetched successfully",
        data: event,
    });
};

export const updateTrainingEvent = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as { id: string};

    const body = updateTrainingEventSchema.safeParse(request.body);
    if(!body.success){
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            error: body.error.flatten().fieldErrors,
        });
    }

    const event = await trainingEventService.update(id, body.data);
    return reply.send({
        success: true,
        message: "Training event updated successfully",
        data: event,
    });
};

export const deleteTrainingEvent = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as { id: string};
    await trainingEventService.delete(id);
    
    return reply.send({
        success: true,
        message: "Training event deleted successfully"
    });
};

