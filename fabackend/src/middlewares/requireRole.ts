import { FastifyRequest, FastifyReply } from "fastify";

export const requireRole = (...roles: ("admin" | "teacher")[]) =>{
    return async (request: FastifyRequest , reply: FastifyReply) =>{
        if(!roles.includes(request.user.role)){
            return reply.status(403).send({
                    success: false,
                    message: "You do not have permission to perform this action"
            });
        }
    };
};