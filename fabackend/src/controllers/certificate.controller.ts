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