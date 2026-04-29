import { teacherSkillRepository } from "../repositories/teacherSkill.repository";
import { skillRepository } from "../repositories/skill.repository";
import { teacherRepository } from "../repositories/teacher.repository";
import { generateId } from "../utils/idGenerator";
import { AppError, ErrorCode } from "../utils/errorHandler";

export const teacherSkillService = {
  getByTeacher: async (teacherId: string) => {
    const teacher = await teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    return teacherSkillRepository.findByTeacherIdWithSkill(teacherId);
  },

  getPercentage: async (teacherId: string) => {
    const teacher = await teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    const result = await teacherSkillRepository.getPercentageByTeacher(teacherId);
    return result.rows;
  },

  assign: async (data: {
    teacherId:        string;
    skillIds:         string[];
    trainingRecordId?: string;
  }) => {
    const teacher = await teacherRepository.findById(data.teacherId);

    if (!teacher) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher not found");
    }

    const created = [];
    const skipped = [];

    for (const skillId of data.skillIds) {
      const skill = await skillRepository.findById(skillId);

      if (!skill) {
        skipped.push({ skillId, reason: "Skill not found" });
        continue;
      }

      const duplicate = await teacherSkillRepository.findDuplicate(data.teacherId,skillId);
      if (duplicate) {
        skipped.push({ skillId, reason: "Already assigned" });
        continue;
      }

      const id     = await generateId("teacher_skills");
      const record = await teacherSkillRepository.create({
        id,
        teacherId: data.teacherId,
        skillId,
        trainingRecordId: data.trainingRecordId ?? null,
      });

      created.push(record);
    }

    return { created, skipped };
  },

  remove: async (teacherId: string, skillId: string) => {
    const duplicate = await teacherSkillRepository.findDuplicate(
      teacherId,
      skillId
    );

    if (!duplicate) {
      throw new AppError(404, ErrorCode.NOT_FOUND, "Teacher skill not found");
    }

    await teacherSkillRepository.delete(teacherId, skillId);
  },
};