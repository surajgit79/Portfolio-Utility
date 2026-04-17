import { FastifyRequest, FastifyReply } from "fastify";
import { teacherService } from "../services/teacher.service";
import { registerTeacherSchema, updateTeacherSchema } from "../utils/schemaValidator";
import { calculatePagination, getPaginationParams } from "../utils/paginationHandler";
import { AppError, ErrorCode } from "../utils/errorHandler";

export const registerTeacher = async(
  request: FastifyRequest,
  reply: FastifyReply
)=>{
  const body = registerTeacherSchema.safeParse(request.body);
  if(!body.success){
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      error: body.error.flatten().fieldErrors,
    });
  }

  const teacher = await teacherService.register(body.data,request);
  return reply.send({
    success: true,
    message: "Teacher registered successfully",
    data: teacher,
  });
};

export const bulkUploadTeachers = async (
  request: FastifyRequest,
  reply:FastifyReply
)=>{
  if(!request.isMultipart()){
    throw new AppError(400, ErrorCode.VALIDATION_ERROR, 'Request must be multipart/form-data');
  }
  const fileData = await request.file();
  if(!fileData || !fileData.filename.endsWith('.csv')){
    throw new AppError(400, ErrorCode.VALIDATION_ERROR, 'Please upload a valid .csv file');
  }

  const result = await teacherService.processBulkCSV(fileData.file);
  return reply.status(200).send({
    success: true,
    message: "Bulk CSV processing completed",
    data: result
  });
}

export const getTeachers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { search } = request.query as { search?: string };
  const { page, limit } = getPaginationParams(request.query as Record<string, unknown>);

  const all = await teacherService.getAll(search);
  const total = all.length;
  const paginated = all.slice((page-1)*limit, page*limit );

  return reply.send({
    success: true,
    message: paginated.length === 0? "No teachers found" : "Teachers fetched successfully",
    data: paginated,
    pagination: calculatePagination(total, page, limit),
  });
};

export const getTeacherById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id }    = request.params as { id: string };
  const teacher   = await teacherService.getById(id);

  return reply.send({
    success: true,
    message: "Teacher fetched successfully",
    data:    teacher,
  });
};

export const updateTeacher = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  const body = updateTeacherSchema.safeParse(request.body);

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const teacher = await teacherService.update(id, body.data, request);

  return reply.send({
    success: true,
    message: "Teacher updated successfully",
    data:    teacher,
  });
};

export const deleteTeacher = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  await teacherService.delete(id);

  return reply.send({
    success: true,
    message: "Teacher deleted successfully",
  });
};