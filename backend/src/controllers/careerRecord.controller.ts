import { FastifyReply, FastifyRequest } from "fastify";
import { createCareerRecordSchema, updateCareerRecordSchema } from "../utils/validation";
import { careerRecordService } from "../services/careerRecord.service";
import { calculatePagination, getPaginationParams } from "../utils/pagination";

export const createCareerRecord = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const body = createCareerRecordSchema.safeParse(request.body);
    if(!body.success){
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            error: body.error.flatten().fieldErrors,
        });
    }

    const record = await careerRecordService.create(body.data);
    return reply.send({
        success: true,
        message: "Career record created successfully",
        data: record,
    });
}

export const getCareerRecordsByTeacher = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { teacherId } = request.params as { teacherId: string};
    const { page, limit } = getPaginationParams( request.query as Record<string, unknown>);

    const all = await careerRecordService.getByTeacher(teacherId);
    const total = all.length;
    const paginated = all.slice((page - 1) * limit, page * limit);
    
    return reply.send({
        success: true,
        message: paginated.length === 0? "No records found": "Career record fetched successfully",
        data: paginated,
        pagination: calculatePagination(total, page, limit),
    });
};

export const getCareerRecordsById = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as { id:string };
    const records = await careerRecordService.getById(id);

    return reply.send({
        success: true,
        message: "Career record fetched successfully",
        data: records,
    });    
};

export const updateCareerRecord = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as { id: string};
    const body = updateCareerRecordSchema.safeParse(request.body);
    if(!body.success){
        return reply.send({
            success: false,
            message: "Validation failed",
            error: body.error.flatten().fieldErrors,
        });
    }

    const record = await careerRecordService.update(id, body.data);
    return reply.send({
        success:true,
        message: "Career record updated successfully",
        data: record,
    });
};

export const deleteCareerRecord = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as {id:string};
    await careerRecordService.delete(id);

    return reply.send({
        success: true,
        message: "Career record deleted successfully",
    });
};