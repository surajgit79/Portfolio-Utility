import { FastifyInstance } from "fastify";
import {
  createEventRecord,
  getEventRecordsByTeacher,
  getEventRecordById,
  updateEventRecord,
  deleteEventRecord,
} from "../controllers/eventRecord.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";

export async function eventRecordRoutes(app: FastifyInstance) {
  // Protected — both roles
  app.get("/teacher/:teacherId", {
    preHandler: [requireAuth],
    handler:    getEventRecordsByTeacher,
  });

  app.get("/:id", {
    preHandler: [requireAuth],
    handler:    getEventRecordById,
  });

  // Admin only
  app.post("/", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    createEventRecord,
  });

  app.patch("/:id", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    updateEventRecord,
  });

  app.delete("/:id", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    deleteEventRecord,
  });
}