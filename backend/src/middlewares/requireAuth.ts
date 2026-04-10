import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "../utils/jwtAuthenticator";

export const requireAuth = async (
    request: FastifyRequest,
    reply: FastifyReply
) =>{
    const authHeader = request.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
            return reply.status(401).send({success:false, message:"Authentication required"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyToken(token);
        request.user = payload;
    } catch (error) {
        return reply.status(401).send({success: false, message: "Invalid or expired token"});
    }
}