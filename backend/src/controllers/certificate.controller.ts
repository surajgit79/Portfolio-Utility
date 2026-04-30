import { FastifyReply, FastifyRequest } from "fastify";
import { certificateService } from "../services/certificate.service";

export const viewCertificate = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { certificateNumber } = request.params as { certificateNumber: string};
    const certificate = await certificateService.getByNumber(certificateNumber);

    return reply.send({
        success: true,
        message: "Certificate fetched successfully",
        data: certificate,
    });
};

export const downloadCertificate = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { certificateNumber } = request.params as { certificateNumber: string};
    const pdf = await certificateService.generatePDF(certificateNumber);

    reply.header("content-type", "application/pdf");
    reply.header("Content-Disposition", `attachment; filename="${certificateNumber}.pdf`);

    return reply.send(pdf);
}

export const downloadCertificateByRecord = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { recordId } = request.params as { recordId: string};
    const pdf = await certificateService.generatePDFFromRecord(recordId);

    reply.header("content-type", "application/pdf");
    reply.header("Content-Disposition", `attachment; filename="certificate-${recordId}.pdf`);

    return reply.send(pdf);
}

export const bulkDownloadCertificates = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { eventId } = request.params as { eventId: string };

  const pdf = await certificateService.bulkGeneratePDF(eventId);

  reply.header("Content-Type", "application/pdf");
  reply.header(
    "Content-Disposition",
    `attachment; filename="certificates-${eventId}.pdf"`
  );

  return reply.send(pdf);
};