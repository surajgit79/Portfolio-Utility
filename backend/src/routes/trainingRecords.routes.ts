import { FastifyInstance } from "fastify";
import { createTrainingRecord, bulkCreateTrainingRecords, getTrainingRecordsByTeacher, getTrainingRecordsByEvent, updateTrainingRecord, deleteTrainingRecord } from "../controllers/trainingRecords.controller";
import { downloadCertificateByRecord } from "../controllers/certificate.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function trainingRecordRoutes(app: FastifyInstance) {
    // Protected — both roles
    app.get("/teacher/:teacherId", {
        // preHandler: [requireAuth],
        handler: getTrainingRecordsByTeacher,
    });

    app.get("/event/:eventId", {
        preHandler: [requireAuth],
        handler: getTrainingRecordsByEvent,
    });

    // Certificate endpoint
    app.get("/:id/certificate", {
        preHandler: [requireAuth],
        handler: downloadCertificateByRecord,
    });

    // Admin only
    app.post("/", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: createTrainingRecord,
    });

    app.post("/bulk", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: bulkCreateTrainingRecords,
    });

    app.patch("/:id", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: updateTrainingRecord,
    });

    app.delete("/:id", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: deleteTrainingRecord,
    });
}