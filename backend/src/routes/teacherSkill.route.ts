import { FastifyInstance } from "fastify";
import { getTeacherSkills, getTeacherSkillPercentage, assignSkills, removeSkill } from "../controllers/teacherSkill.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function teacherSkillRoutes(app: FastifyInstance) {
  app.get("/:teacherId", {
    preHandler: [requireAuth],
    handler:    getTeacherSkills,
  });

  app.get("/:teacherId/percentage", {
    preHandler: [requireAuth],
    handler:    getTeacherSkillPercentage,
  });

  app.post("/", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    assignSkills,
  });

  app.delete("/:teacherId/:skillId", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    removeSkill,
  });
}