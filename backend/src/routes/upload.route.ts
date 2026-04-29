import { FastifyInstance } from "fastify";
import { uploadTeacherCSV, uploadCareerRecordsCSV, uploadEventRecordsCSV, uploadTrainingRecordsCSV, uploadSkillsCSV } from "../controllers/upload.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function uploadRoutes(app: FastifyInstance) {
    app.post("/teachers", {
        preHandler: [requireAuth, requireRole("admin")],
        handler:    uploadTeacherCSV,
    });

    app.post("/career-records", {
        preHandler: [requireAuth, requireRole("admin")],
        handler:    uploadCareerRecordsCSV,
    });

    app.post("/event-records", {
        preHandler: [requireAuth, requireRole("admin")],
        handler:    uploadEventRecordsCSV,
    });

app.post("/training-records", {
        preHandler: [requireAuth, requireRole("admin")],
        handler:    uploadTrainingRecordsCSV,
    });

    app.post("/skills", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: uploadSkillsCSV,
    });
}