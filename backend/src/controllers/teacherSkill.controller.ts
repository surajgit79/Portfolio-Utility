import { FastifyRequest, FastifyReply } from "fastify";
import { teacherSkillService }          from "../services/teacherSkill.service";
import { createTeacherSkillSchema }     from "../utils/schemaValidator";

export const getTeacherSkills = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { teacherId } = request.params as { teacherId: string };
  const data = await teacherSkillService.getByTeacher(teacherId);

  return reply.send({
    success: true,
    message: data.length === 0 ? "No skills found" : "Skills fetched successfully",
    data,
  });
};

export const getTeacherSkillPercentage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { teacherId } = request.params as { teacherId: string };
  const data = await teacherSkillService.getPercentage(teacherId);

  return reply.send({
    success: true,
    message: "Skill percentage fetched successfully",
    data,
  });
};

export const assignSkills = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = createTeacherSkillSchema.safeParse(request.body);

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const result = await teacherSkillService.assign(body.data);

  return reply.status(201).send({
    success: true,
    message: `${result.created.length} skills assigned, ${result.skipped.length} skipped`,
    data: result,
  });
};

export const removeSkill = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { teacherId, skillId } = request.params as {
    teacherId: string;
    skillId: string;
  };

  await teacherSkillService.remove(teacherId, skillId);

  return reply.send({
    success: true,
    message: "Skill removed successfully",
  });
};