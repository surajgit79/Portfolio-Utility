import { FastifyReply, FastifyRequest } from "fastify";
import { loginSchema, registerSchema } from "../utils/schemaValidator";
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

export const refresh = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { refreshToken } = request.body as { refreshToken: string};
    if(!refreshToken){
        return reply.status(400).send({
            success: false,
            message: "Refresh token is required",
        });
    }

    const tokens = await authService.refresh(refreshToken);
    return reply.send({
        success: true,
        message: "Token refreshed successfully",
        data: tokens
    });
};

export const logout = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { refreshToken } = request.body as { refreshToken: string };
    if(!refreshToken){
        return reply.status(400).send({
            success: false,
            message: "Refresh token is required",
        });
    }

    await authService.logout(refreshToken);
    return reply.status(200).send({
        success: true,
        message: "Logged out successfully",
    });
}