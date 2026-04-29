import { FastifyInstance } from "fastify";
import { getSkills, getSkillById, createSkill, deleteSkill } from "../controllers/skill.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function skillRoutes(app: FastifyInstance) {
  app.get("/", {
    preHandler: [requireAuth],
    handler:    getSkills,
  });

  app.get("/:id", {
    preHandler: [requireAuth],
    handler:    getSkillById,
  });

  app.post("/", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    createSkill,
  });

  app.delete("/:id", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    deleteSkill,
  });
}