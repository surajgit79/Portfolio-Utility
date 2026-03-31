import { FastifyInstance } from "fastify";
import { createTeacher, updateTeacher, getTeacher, getTeacherById } from "../controllers/teacher.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function teacherRoutes(app: FastifyInstance) {
    // Admin + Teacher
    app.get("/", getTeacher);
    app.get("/:id", getTeacherById);

    //Admin only
    app.post("/", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: createTeacher
    });

    app.patch("/:id", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: updateTeacher
    });
};

