import { FastifyInstance } from "fastify";
import {
  viewCertificate,
  downloadCertificate,
  downloadBulkCertificate,
  downloadBulkByEvent,
  triggerBulkGeneration,
  getBulkJobStatus,
  retryCertificate,
} from "../controllers/certificate.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";   
import { certificateService } from "../services/certificate.service";

export async function certificateRoutes(app: FastifyInstance) {
  app.get("/:certificateNumber/download", {
    preHandler: [requireAuth],
    handler:    downloadCertificate,
  });

  app.get("/:certificateNumber", {
    preHandler: [requireAuth],
    handler:    viewCertificate,
  });

  app.post("/bulk/:eventId", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    triggerBulkGeneration,
  });

  app.get("/bulk/status/:jobId", {
    preHandler: [requireAuth],
    handler:    getBulkJobStatus,
  });

  app.get("/bulk/download/:jobId", {
    preHandler: [requireAuth],
    handler:    downloadBulkCertificate,
  });

  app.get("/bulk/event/:eventId/download", {
    preHandler: [requireAuth],
    handler:    downloadBulkByEvent,
  });

  app.post("/trigger-cron", {
    preHandler: [requireAuth, requireRole("admin")], 
    handler:    async (_request, reply) => {
        await certificateService.processPendingCertificates();
        await certificateService.processPendingBulkJobs();
        return reply.send({ success: true, message: "Cron triggered manually" });
    },
 });

  app.post("/reset-certificate/:certificateNumber", {
    preHandler: [requireAuth, requireRole("admin")],
    handler: async (request, reply) => {
        const { certificateNumber } = request.params as { certificateNumber: string };
        await certificateService["resetStatus"](certificateNumber);
        return reply.send({ success: true, message: `Certificate ${certificateNumber} reset to pending` });
    },
  });

  app.post("/retry/:certificateNumber", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    retryCertificate,
  });
}