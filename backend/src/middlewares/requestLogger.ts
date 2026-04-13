import { FastifyReply, FastifyRequest } from "fastify";

const SENSITIVE_FIELDS = ["password", "token", "secret", "authorization"];

const sanitizeBody = (body: unknown): unknown =>{
    if(!body || typeof body!= "object") return body;

    return Object.fromEntries(
        Object.entries(body as Record<string, unknown>).map(([key, value])=>[
            key, SENSITIVE_FIELDS.includes(key.toLowerCase())? "***": value,
        ])
    );
};

export const requestLogger = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    request.log.info({
        method: request.method,
        url: request.url,
        userId: request.user?.userId ?? "unauthenticated",
        role: request.user?.role ?? "none",
        body: sanitizeBody(request.body),
        ip: request.ip,
    }, "incoming request");
};

export const responseLogger = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const responseTime = reply.elapsedTime;
    
    request.log.info({
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        userId: request.user?.userId ?? "unauthenticated",
        responseTime: `${responseTime.toFixed(2)}ms`,
    }, "requst completed");

    if (responseTime > 1000 ) {
        request.log.warn({
            url: request.url,
            responseTime: `${responseTime.toFixed(2)}ms`,
        }, "slow request detected");
    }
};