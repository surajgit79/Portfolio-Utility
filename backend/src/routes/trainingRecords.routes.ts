import { FastifyInstance } from "fastify";
import { createTrainingRecord, bulkCreateTrainingRecords, getTrainingRecordsByTeacher, getTrainingRecordsByEvent, updateTrainingRecord, deleteTrainingRecord, getTrainingRecordsById, } from "../controllers/trainingRecords.controller";
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

    app.get("/:id",{
       preHandler: [requireAuth],
       handler: getTrainingRecordsById, 
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