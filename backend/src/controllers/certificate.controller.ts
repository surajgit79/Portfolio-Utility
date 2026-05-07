import { FastifyRequest, FastifyReply } from "fastify";
import { certificateService }           from "../services/certificate.service";

export const viewCertificate = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { certificateNumber } = request.params as { certificateNumber: string };
  const certificate = await certificateService.getByNumber(certificateNumber);

  return reply.send({
    success: true,
    message: "Certificate fetched successfully",
    data:    certificate,
  });
};

export const downloadCertificate = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { certificateNumber } = request.params as { certificateNumber: string };
  const pdfUrl = await certificateService.downloadByNumber(certificateNumber);

  return reply.redirect(pdfUrl);
};

export const triggerBulkGeneration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { eventId } = request.params as { eventId: string };
  const job = await certificateService.triggerBulkGeneration(eventId);

  return reply.status(202).send({
    success: true,
    message: "Bulk certificate generation queued. Certificates will be ready at 2:00 PM.",
    data:    {
      jobId: job.id,
      status: job.status,
      totalCount: job.totalCount,
    },
  });
};

export const getBulkJobStatus = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { jobId } = request.params as { jobId: string };
  const job = await certificateService.getBulkJobStatus(jobId);

  return reply.send({
    success: true,
    message: "Bulk job status fetched",
    data: job,
  });
};