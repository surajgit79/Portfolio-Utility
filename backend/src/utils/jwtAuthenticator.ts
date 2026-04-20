import jwt from "jsonwebtoken";
import crypto from "crypto";
import {env} from "../config/env";

export interface JwtPayload {
    userId: string,
    role: "admin" | "teacher",
};


export const signAccessToken = (payload: JwtPayload): string =>{
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    });
};

export const signRefreshToken = (): string =>{
    return crypto.randomBytes(64).toString("hex");
};

export const verifyToken = (token:string): JwtPayload =>{
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
};

export const signToken = signAccessToken;