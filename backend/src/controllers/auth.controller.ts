import { FastifyReply, FastifyRequest } from "fastify";
import { loginSchema, registerSchema } from "../utils/validation";
import { authService } from "../services/auth.service";

export const register = async(
    request: FastifyRequest,
    reply: FastifyReply
 )=>{
     const body = registerSchema.safeParse(request.body);
     console.log("Validation result:", body);
    if (!body.success) {
        return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors:  body.error.flatten().fieldErrors,
        });
    }

    const data = await authService.register(
        body.data.email,
        body.data.password,
    );

    return reply.status(201).send({
        success: true,
        message: "User registered successfully",
        data,
    });
};

export const login = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const body = loginSchema.safeParse(request.body);
    if (!body.success) {
        return reply.status(400).send({
        success: false,
        message: "Validation failed",
        errors:  body.error.flatten().fieldErrors,
        });
    }

    const data = await authService.login(
        body.data.email,
        body.data.password,
    );

    return reply.status(200).send({
        success: true,
        message: "Login successful",
        data,
    });
};