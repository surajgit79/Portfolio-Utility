import { teacherRepository } from "../repositories/teacher.repository";
import { userRepository } from "../repositories/user.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadSingleImage } from "../utils/upload";
import { FastifyRequest } from "fastify";

export const teacherService = {
  create: async (
    data: {
      userId:  string;
      name:    string;
      address: string;
      contact: string;
      email:   string;
      gender:  "Male" | "Female" | "Others";
      dob:     string;
    },
    request: FastifyRequest
  ) => {
    const user = await userRepository.findById(data.userId);

    if (!user) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "User not found");
    }

    if (user.role !== "teacher") {
      throw new AppError(400, ErrorCode.VALIDATION_ERROR, "Only users with role 'teacher' can have a teacher profile");
    }

    const existingTeacher = await teacherRepository.findByUserId(data.userId);

    if (existingTeacher) {
      throw new AppError(409, ErrorCode.CONFLICT, "Teacher profile already exists for this user");
    }

    let imageUrl: string | undefined;

    if (request.isMultipart()) {
      const url = await uploadSingleImage(request, "portfolio-utility/teachers");
      if (url) imageUrl = url;
    }

    const id = await generateId("teachers");

    return teacherRepository.create({
      id,
      ...data,
      imageUrl,
      dob: new Date(data.dob),
    });
  },

  getAll: async (search?: string) => {
    return teacherRepository.findAll(search);
  },

  getById: async (id: string) => {
    const teacher = await teacherRepository.findById(id);

    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    return teacher;
  },

  update: async (
    id: string,
    data: Partial<{
      name:     string;
      address:  string;
      contact:  string;
      email:    string;
      gender:   "Male" | "Female" | "Others";
      dob:      string;
    }>,
    request: FastifyRequest
  ) => {
    const existing = await teacherRepository.findById(id);

    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    let imageUrl: string | undefined;

    if (request.isMultipart()) {
      const url = await uploadSingleImage(request, "portfolio-utility/teachers");
      if (url) imageUrl = url;
    }

    const { dob, ...rest } = data;

    return teacherRepository.update(id, {
      ...rest,
      ...(imageUrl && { imageUrl }),
      ...(dob && { dob: new Date(dob) }),
      updatedAt: new Date(),
    });
  },

  delete: async (id: string) => {
    const existing = await teacherRepository.findById(id);

    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    await teacherRepository.delete(id);
  },
};