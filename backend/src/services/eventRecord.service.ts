import { eventRecordRepository } from "../repositories/eventRecord.repository";
import { teacherRepository } from "../repositories/teacher.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadSingleImage } from "../utils/upload";
import { FastifyRequest } from "fastify";

export const eventRecordService = {
  create: async (
    data: {
      teacherId:   string;
      eventType: "Seminar" | "Conference" | "Panel Discussion" | "Podcast";
      name:        string;
      role:        string;
      organizer:   string;
      venue?:       string;
      date:        string;
      description?: string;
    },
    request: FastifyRequest
  ) => {
    const teacher = await teacherRepository.findById(data.teacherId);

    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    let referenceImage: string | undefined;

    if (request.isMultipart()) {
      const url = await uploadSingleImage(
        request,
        "portfolio-utility/event-records"
      );
      if (url) referenceImage = url;
    }

    const id = await generateId("event_records");

    const { date, ...rest } = data;

    return eventRecordRepository.create({
      id,
      ...rest,
      date: new Date(date),
      referenceImage,
    });
  },

  getByTeacher: async (teacherId: string) => {
    const teacher = await teacherRepository.findById(teacherId);

    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    return eventRecordRepository.findByTeacherId(teacherId);
  },

  getById: async (id: string) => {
    const record = await eventRecordRepository.findById(id);

    if (!record) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Event record not found");
    }

    return record;
  },

  update: async (
    id: string,
    data: Partial<{
      eventType?: "Seminar" | "Conference" | "Panel Discussion" | "Podcast";
      name:        string;
      role:        string;
      organizer:   string;
      venue:       string;
      date:        string;
      description: string;
    }>,
    request: FastifyRequest
  ) => {
    const existing = await eventRecordRepository.findById(id);

    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Event record not found");
    }

    let referenceImage: string | undefined;

    if (request.isMultipart()) {
      const url = await uploadSingleImage(
        request,
        "portfolio-utility/event-records"
      );
      if (url) referenceImage = url;
    }

    const { date, ...rest } = data;

    return eventRecordRepository.update(id, {
      ...rest,
      ...(date && { date: new Date(date) }),
      ...(referenceImage && { referenceImage }),
      updatedAt: new Date(),
    });
  },

  delete: async (id: string) => {
    const existing = await eventRecordRepository.findById(id);

    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Event record not found");
    }

    await eventRecordRepository.delete(id);
  },
};