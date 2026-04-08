import { FastifyInstance } from "fastify";
import { getTeachers, getTeacherById, updateTeacher, deleteTeacher, registerTeacher,} from "../controllers/teacher.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function teacherRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/", { handler: getTeachers });
  app.get("/:id", { handler: getTeacherById });

  // Admin only
  app.post("/register", {
    preHandler: [requireAuth, requireRole("admin")],
    handler: registerTeacher,
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