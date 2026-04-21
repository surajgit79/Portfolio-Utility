import { FastifyRequest, FastifyReply } from "fastify";
import { eventRecordService } from "../services/eventRecord.service";
import {
  createEventRecordSchema,
  updateEventRecordSchema,
} from "../utils/schemaValidator";
import { calculatePagination, getPaginationParams } from "../utils/paginationHandler";

export const createEventRecord = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = createEventRecordSchema.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const record = await eventRecordService.create(body.data, request);

  return reply.status(201).send({
    success: true,
    message: "Event record created successfully",
    data:    record,
  });
};

export const getEventRecordsByTeacher = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { teacherId }   = request.params as { teacherId: string };
  const { page, limit } = getPaginationParams(request.query as Record<string, unknown>);
  const { data, total } = await eventRecordService.getByTeacher(teacherId, page, limit);

  return reply.send({
    success: true,
    message: data.length === 0 ? "No event records found" : "Event records fetched successfully",
    data,
    pagination: calculatePagination(total, page, limit),
  });
};

export const getEventRecordById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const record = await eventRecordService.getById(id);

  return reply.send({
    success: true,
    message: "Event record fetched successfully",
    data:    record,
  });
};

export const updateEventRecord = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };

  const body = updateEventRecordSchema.safeParse(request.body);

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const record = await eventRecordService.update(id, body.data, request);

  return reply.send({
    success: true,
    message: "Event record updated successfully",
    data:    record,
  });
};

export const deleteEventRecord = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  await eventRecordService.delete(id);

  return reply.send({
    success: true,
    message: "Event record deleted successfully",
  });
};