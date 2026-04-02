import { FastifyInstance } from "fastify";
import { createTeacher, getTeachers, getTeacherById, updateTeacher, deleteTeacher,} from "../controllers/teacher.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function teacherRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/", { handler: getTeachers });
  app.get("/:id", { handler: getTeacherById });

  // Admin only
  app.post("/", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    createTeacher,
  });

  app.patch("/:id", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    updateTeacher,
  });

  app.delete("/:id", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    deleteTeacher,
  });
}