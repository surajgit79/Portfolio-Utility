import { FastifyRequest, FastifyReply } from "fastify";
import { teacherService } from "../services/teacher.service";
import { registerTeacherSchema, updateTeacherSchema } from "../utils/validation";
import { calculatePagination, getPaginationParams } from "../utils/pagination";

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