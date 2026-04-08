import { FastifyReply, FastifyRequest } from "fastify";
import { createTrainingEventSchema, updateTrainingEventSchema } from "../utils/validation";
import { trainingEventService } from "../services/trainingEvent.service";
import { calculatePagination, getPaginationParams } from "../utils/pagination";

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

    const all = await trainingEventService.getAll(category, sector, phase);
    const total = all.length;
    const paginated = all.slice((page -1) * limit, page * limit);

    return reply.send({
        success: true,
        message: "Training events fetched successfully",
        data: paginated,
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

