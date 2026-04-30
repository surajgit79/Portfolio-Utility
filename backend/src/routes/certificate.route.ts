import { FastifyInstance } from "fastify";
import { requireAuth } from "../middlewares/requireAuth";
import { requireRole } from "../middlewares/requireRole";
import { bulkDownloadCertificates, downloadCertificate, downloadCertificateByRecord, viewCertificate } from "../controllers/certificate.controller";

export async function certificateRoutes(app: FastifyInstance){
    app.get("/:certificateNumber",{
        preHandler: [requireAuth],
        handler: viewCertificate,
    });

    app.get("/:certificateNumber/download",{
        preHandler: [requireAuth],
        handler: downloadCertificate,
    });

    app.get("/record/:recordId/download",{
        preHandler: [requireAuth],
        handler: downloadCertificateByRecord,
    });

    app.get("/bulk/:eventId/download", {
    preHandler: [requireAuth, requireRole("admin")],
    handler:    bulkDownloadCertificates,
  });
}