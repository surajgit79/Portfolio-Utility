import { FastifyRequest, FastifyReply } from "fastify";
import { certificateService }           from "../services/certificate.service";
import { AppError, ErrorCode }          from "../utils/errorHandler";

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
  const { pdfUrl, pdfBuffer } = await certificateService.downloadByNumber(certificateNumber);

  let buffer: Buffer;
  if (pdfBuffer) {
    buffer = pdfBuffer;
  } else {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new AppError(502, ErrorCode.VALIDATION_ERROR, `Failed to fetch certificate PDF (HTTP ${response.status}): ${text.slice(0, 200)}`);
    }
    buffer = Buffer.from(await response.arrayBuffer());
  }

  reply.header("Content-Type", "application/pdf");
  reply.header("Content-Disposition", `inline; filename="${certificateNumber}.pdf"`);
  reply.header("Cache-Control", "public, max-age=3600");

  return reply.send(buffer);
};

export const downloadBulkCertificate = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { jobId } = request.params as { jobId: string };
  const job = await certificateService.getBulkJobStatus(jobId);

  if (!job) {
    throw new AppError(404, ErrorCode.NOT_FOUND, "Bulk job not found");
  }

  if (job.status === "pending" || job.status === "processing") {
    throw new AppError(202, ErrorCode.VALIDATION_ERROR, "Bulk certificates are being generated, please try again later");
  }

  if (job.status === "failed") {
    throw new AppError(202, ErrorCode.VALIDATION_ERROR, "Bulk certificate generation failed. Please contact admin.");
  }

  if (!job.pdfUrl) {
    throw new AppError(404, ErrorCode.NOT_FOUND, "Bulk certificate PDF not found");
  }

  // Fetch PDF from S3
  const response = await fetch(job.pdfUrl);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new AppError(502, ErrorCode.VALIDATION_ERROR, `Failed to fetch bulk certificate PDF (HTTP ${response.status}): ${text.slice(0, 200)}`);
  }

  const pdfBuffer = Buffer.from(await response.arrayBuffer());

  // Set proper headers for PDF rendering
  reply.header("Content-Type", "application/pdf");
  reply.header("Content-Disposition", `inline; filename="bulk-certificates-${jobId}.pdf"`);
  reply.header("Cache-Control", "public, max-age=3600");

  return reply.send(pdfBuffer);
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

export const downloadBulkByEvent = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { eventId } = request.params as { eventId: string };
  const result = await certificateService.downloadOrGenerateBulk(eventId);

  if (result.pending) {
    return reply.status(202).send({
      success: false,
      message: "Bulk certificates are being generated. Please try again shortly.",
    });
  }

  if (!result.pdfUrl) {
    throw new AppError(404, ErrorCode.NOT_FOUND, "Bulk certificate not found");
  }

  const response = await fetch(result.pdfUrl);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new AppError(502, ErrorCode.VALIDATION_ERROR, `Failed to fetch bulk PDF (HTTP ${response.status}): ${text.slice(0, 200)}`);
  }

  const pdfBuffer = Buffer.from(await response.arrayBuffer());
  reply.header("Content-Type", "application/pdf");
  reply.header("Content-Disposition", `inline; filename="bulk-certificates-${eventId}.pdf"`);
  reply.header("Cache-Control", "public, max-age=3600");
  return reply.send(pdfBuffer);
};

export const retryCertificate = async (
  request: FastifyRequest,
  reply:   FastifyReply
) => {
  const { certificateNumber } = request.params as { certificateNumber: string };
  await certificateService["resetStatus"](certificateNumber);
  return reply.status(200).send({
    success: true,
    message: `Certificate ${certificateNumber} queued for retry`,
  });
};