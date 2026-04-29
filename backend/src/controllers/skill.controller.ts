import { FastifyRequest, FastifyReply } from "fastify";
import { skillService } from "../services/skill.service";
import { createSkillSchema } from "../utils/schemaValidator";
import { getPaginationParams, calculatePagination } from "../utils/paginationHandler";

export const getSkills = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { program, module, unit } = request.query as {
    program?: string;
    module?:  string;
    unit?:    string;
  };

  const { page, limit } = getPaginationParams(request.query as Record<string, unknown>);
  const { data, total } = await skillService.getAll(program, module, unit, page, limit);

  return reply.send({
    success: true,
    message:    data.length === 0 ? "No skills found" : "Skills fetched successfully",
    data,
    pagination: calculatePagination(total, page, limit),
  });
};

export const getSkillById = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { id } = request.params as { id: string };
  const skill  = await skillService.getById(id);

  return reply.send({
    success: true,
    message: "Skill fetched successfully",
    data:    skill,
  });
};

export const createSkill = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const body = createSkillSchema.safeParse(request.body);

  if (!body.success) {
    return reply.status(400).send({
      success: false,
      message: "Validation failed",
      errors:  body.error.flatten().fieldErrors,
    });
  }

  const skill = await skillService.create(body.data);

  return reply.status(201).send({
    success: true,
    message: "Skill created successfully",
    data:    skill,
  });
};

export const deleteSkill = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { id } = request.params as { id: string };
  await skillService.delete(id);

  return reply.send({
    success: true,
    message: "Skill deleted successfully",
  });
};