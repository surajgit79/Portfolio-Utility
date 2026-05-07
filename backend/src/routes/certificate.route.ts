import { FastifyInstance } from "fastify";
import {
  viewCertificate,
  downloadCertificate,
  triggerBulkGeneration,
  getBulkJobStatus,
} from "../controllers/certificate.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";
import { certificateService } from "../services/certificate.service";

export async function certificateRoutes(app: FastifyInstance) {
  // Protected — both roles
  app.get("/:certificateNumber", {
    preHandler: [requireAuth],
    handler:    viewCertificate,
  });

  app.get("/:certificateNumber/download", {
    preHandler: [requireAuth],
    handler:    downloadCertificate,
  });

  // Admin only
  app.post("/bulk/:eventId", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    triggerBulkGeneration,
  });

  app.get("/bulk/status/:jobId", {
    preHandler: [requireAuth],
    handler:    getBulkJobStatus,
  });

  //temporairly trigger cron
  app.post("/trigger-cron", {
    preHandler: [requireAuth, requireRole("admin")], 
    handler:    async (_request, reply) => {
        await certificateService.processPendingCertificates();
        await certificateService.processPendingBulkJobs();
        return reply.send({ success: true, message: "Cron triggered manually" });
    },
 });

  //temporarily reset certificate status
  app.post("/reset-certificate/:certificateNumber", {
    preHandler: [requireAuth, requireRole("admin")],
    handler: async (request, reply) => {
        const { certificateNumber } = request.params as { certificateNumber: string };
        const cert = await certificateService.getByNumber(certificateNumber);
        if (!cert) {
            return reply.status(404).send({ success: false, message: "Certificate not found" });
        }
        await certificateService["resetStatus"](certificateNumber);
        return reply.send({ success: true, message: `Certificate ${certificateNumber} reset to pending` });
    },
 });
}