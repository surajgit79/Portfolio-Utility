import { FastifyInstance, FastifyError } from "fastify";

export enum ErrorCode{
    VALIDATION_ERROR = "VALIDATION_ERROR",
    AUTHENTICATION_ERROR = "AUTHENTICATION_HEADER",
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
};

export class AppError extends Error{
    constructor(
        public statusCode: number,
        public code: ErrorCode,
        public message: string,
        public errors   : Array<{field: string; message: string}> = []
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (app:FastifyInstance)=>{
    app.setErrorHandler((error: FastifyError, _request, reply)=>{
        app.log.error(error);

        if(error instanceof AppError){
            return reply.status(error.statusCode).send({
                success:false,
                message: error.message,
                code: error.code,
                errors: error.errors,
            });
        }

        if (error.message?.includes("duplicate key")) {
            return reply.status(409).send({
                success: false,
                message: "Record already exists",
                code:    ErrorCode.CONFLICT,
                errors:  [],
            });
        }

        if (error.message?.includes("foreign key")) {
            return reply.status(400).send({
                success: false,
                message: "Referenced record does not exist",
                code:    ErrorCode.VALIDATION_ERROR,
                errors:  [],
            });
        }

        // Fastify validation error
        if (error.statusCode === 400) {
            return reply.status(400).send({
                success: false,
                message: error.message,
                code:    ErrorCode.VALIDATION_ERROR,
                errors:  [],
            });
        }

        return reply.status(500).send({
            success:false,
            message: "internal Server Error",
            code: ErrorCode.INTERNAL_SERVER_ERROR,
            errors: []
        });
    });
};