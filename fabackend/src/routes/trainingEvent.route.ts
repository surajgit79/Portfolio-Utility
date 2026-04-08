import { FastifyInstance } from "fastify";
import { createTrainingEvent, getTrainingEvents, getTrainingEventById, updateTrainingEvent, deleteTrainingEvent } from "../controllers/trainingEvents.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function trainingEventRoutes(app: FastifyInstance){

    app.get("/", {
        preHandler: [requireAuth],
        handler: getTrainingEvents,
    });

    app.get("/:id",{
        preHandler: [requireAuth],
        handler: getTrainingEventById,
    });

    app.post("/", {
        preHandler: [requireAuth, requireRole("admin")],
        handler: createTrainingEvent,
    });

    app.patch("/:id",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: updateTrainingEvent,
    });

    app.delete("/:id",{
        preHandler: [requireAuth, requireRole("admin")],
        handler: deleteTrainingEvent,
    })
};