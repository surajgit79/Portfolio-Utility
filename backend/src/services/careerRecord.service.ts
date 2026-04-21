import { careerRecordRepository } from "../repositories/careerRecord.repository";
import { teacherRepository } from "../repositories/teacher.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";

export const careerRecordService = {
  create: async (data: {
    teacherId: string;
    role: string;
    organization: string;
    grade?: "Nursery" | "LKG" | "UKG" | "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6" | "Grade 7" | "Grade 8" | "Grade 9" | "Grade 10";
    startDate: string;
    endDate?: string;
    stillWorking: number;
    achievements?: string;
    refContactDetail?: string;
  }) => {
    const teacher = await teacherRepository.findById(data.teacherId);
    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    const duplicate = await careerRecordRepository.findDuplicate(data.teacherId, data.role, data.organization);
    if(duplicate){
      throw new AppError(409, ErrorCode.CONFLICT, "Career record already exists for the teacher at the same role and same organization");
    }

    const id = await generateId("career_records");
    const { startDate, endDate, ...rest } = data;
    return careerRecordRepository.create({
      id,
      ...rest,
      startDate: new Date(startDate),
      ...(endDate && { endDate: new Date(endDate) }),
    });
  },

  getByTeacher: async (teacherId: string, page = 1, limit = 10) => {
    const teacher = await teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }
    const [data, total]= await Promise.all([
      careerRecordRepository.findByTeacherId(teacherId, page, limit),
      careerRecordRepository.countByTeacherId(teacherId),
    ]);

    return { data, total};
  },

  getById: async (id: string) => {
    const record = await careerRecordRepository.findById(id);

    if (!record) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Career record not found");
    }

    return record;
  },

  update: async (id: string, data: Partial<{
    role: string;
    organization: string;
    grade?: "Nursery" | "LKG" | "UKG" | "Grade 1" | "Grade 2" | "Grade 3" | "Grade 4" | "Grade 5" | "Grade 6" | "Grade 7" | "Grade 8" | "Grade 9" | "Grade 10";
    startDate: string;
    endDate: string;
    stillWorking: number;
    achievements: string;
    refContactDetail: string;
  }>) => {
    const existing = await careerRecordRepository.findById(id);
    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Career record not found");
    }

    const { startDate, endDate, ...rest } = data;

    return careerRecordRepository.update(id, {
      ...rest,
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    });
  },

  delete: async (id: string) => {
    const existing = await careerRecordRepository.findById(id);

    if (!existing) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Career record not found");
    }

    await careerRecordRepository.delete(id);
  },
};