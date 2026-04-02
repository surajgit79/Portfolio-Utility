import { FastifyInstance } from "fastify";

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
    app.setErrorHandler((error, _request, reply)=>{
        app.log.error(error);

        if(error instanceof AppError){
            return reply.status(error.statusCode).send({
                success:false,
                message: error.message,
                code: error.statusCode,
                errors: error.errors,
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