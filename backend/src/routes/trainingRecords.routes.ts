import { FastifyInstance } from "fastify";
import { createTrainingRecords, getTrainingRecordByEvent, getTrainingRecordByTeacher, bulkCreateTrainingRecords } from "../controllers/trainingRecords.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function trainingRecordsRoute(app: FastifyInstance){

    app.get("/teacher/:teacherId",{
        preHandler: [requireAuth],
        handler: getTrainingRecordByTeacher,
    });

    app.get("/event/:trainingEventId", {
        preHandler: [requireAuth],
        handler: getTrainingRecordByEvent,
    });

    app.post("/",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: createTrainingRecords,
    });

    app.post("/bulk",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: bulkCreateTrainingRecords,
    });
};