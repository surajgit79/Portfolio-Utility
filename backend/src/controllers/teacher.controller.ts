import { FastifyRequest, FastifyReply } from "fastify";
import { teacherService } from "../services/teacher.service";
import { createTeacherSchema, updateTeacherSchema } from "../utils/validation";

export const createTeacher = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = createTeacherSchema.safeParse(request.body);

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const teacher = await teacherService.create(body.data, request);

  return reply.status(201).send({
    success: true,
    message: "Teacher profile created successfully",
    data:    teacher,
  });
};

export const getTeachers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { search } = request.query as { search?: string };
  const teachers   = await teacherService.getAll(search);

  return reply.send({
    success: true,
    message: "Teachers fetched successfully",
    data:    teachers,
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