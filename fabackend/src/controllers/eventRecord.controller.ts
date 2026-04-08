import { FastifyRequest, FastifyReply } from "fastify";
import { eventRecordService } from "../services/eventRecord.service";
import {
  createEventRecordSchema,
  updateEventRecordSchema,
} from "../utils/validation";

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
  const { teacherId } = request.params as { teacherId: string };
  const records       = await eventRecordService.getByTeacher(teacherId);

  return reply.send({
    success: true,
    message: "Event records fetched successfully",
    data:    records,
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