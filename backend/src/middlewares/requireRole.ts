import { FastifyRequest, FastifyReply } from "fastify";
import { success } from "zod";

export const requireRole = (...roles: ("admin" | "teacher")[]) =>{
    return async (request: FastifyRequest , reply: FastifyReply) =>{
        if(!roles.includes(request.user.role)){
            if(!roles.includes(request.user.role)){
                return reply.status(403).send({
                    success: false,
                    message: "You do not have permission to perform this action"
                });
            }
        }
    };
};