import { teacherRepository } from "../repositories/teacher.repository";
import { userRepository } from "../repositories/user.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { uploadSingleImage } from "../utils/upload";
import { FastifyRequest } from "fastify";
import { hashedPassword } from "../utils/password";

const calculateTenure = (teachingSince: number | null): number | null => {
  if (!teachingSince) return null;
  return new Date().getFullYear() - teachingSince;
};

export const teacherService = {
  register: async (
    data: {
      email:    string;
      password: string;
      name:     string;
      address:  string;
      contact:  string;
      gender:   "Male" | "Female" | "Others";
      dob:      string;
    },
    request: FastifyRequest
  ) => {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, ErrorCode.CONFLICT, "Email already exists");
    }

    const hashed = await hashedPassword(data.password);
    const userId = await generateId("users");

    const user = await userRepository.create({
      id:       userId,
      email:    data.email,
      password: hashed,
      role:     "teacher",
    });

    let imageUrl: string | undefined;
    if (request.isMultipart()) {
      const url = await uploadSingleImage(request, "portfolio-utility/teachers");
      if (url) imageUrl = url;
    }

    const teacherId = await generateId("teachers");

    const teacher = await teacherRepository.create({
      id:       teacherId,
      userId:   user.id,
      name:     data.name,
      address:  data.address,
      contact:  data.contact,
      email:    data.email,
      gender:   data.gender,
      dob:      data.dob,
      imageUrl,
    });

    return teacher;
  },

  getAll: async (search?: string) => {
    const result = await teacherRepository.findAll(search);
    return result.map((teacher) => ({
      ...teacher,
      tenure: calculateTenure(teacher.teachingSince),
    }));
  },

  getById: async (id: string) => {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    return {
      ...teacher,
      tenure: calculateTenure(teacher.teachingSince),
    };
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
      ...(dob && { dob: dob }),
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