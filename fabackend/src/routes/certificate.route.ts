import { FastifyInstance } from "fastify";
import { requireAuth } from "../middlewares/requireAuth";
import { downloadCertificate, viewCertificate } from "../controllers/certificate.controller";

export async function certificateRoutes(app: FastifyInstance){
    app.get("/:certificateNumber",{
        preHandler: [requireAuth],
        handler: viewCertificate,
    });

    app.get("/:certificateNumber/download",{
        preHandler: [requireAuth],
        handler: downloadCertificate,
    });
}