import { refreshTokenRepository } from "../repositories/refreshToken.repository";
import { userRepository } from "../repositories/user.repository";
import { AppError, ErrorCode } from "../utils/errorHandler";
import { generateId } from "../utils/idGenerator";
import { signAccessToken, signRefreshToken, signToken } from "../utils/jwtAuthenticator";
import { comparePassword, hashedPassword } from "../utils/passwordHasherVerifier";

export const authService = {
    register: async (email: string, password: string)=>{
        const existing = await userRepository.findByEmail(email);
        if(existing){
            throw new AppError(409, ErrorCode.CONFLICT, "Email already exists");
        }

        const hashed = await hashedPassword(password);
        const id = await generateId("users");

        const user = await userRepository.create({id, email, password: hashed, role: "admin"});
        const accessToken  = signAccessToken({
            userId: user.id,
            role:   user.role as "admin" | "teacher",
        });

        const refreshToken = signRefreshToken();

        await refreshTokenRepository.create({
        userId:    user.id,
        token:     refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return { accessToken, refreshToken }; 
    },

    login: async (email: string, password:string)=>{
        const user = await userRepository.findByEmail(email);
        if(!user){
            throw new AppError(404, ErrorCode.AUTHENTICATION_ERROR, "Invalid Credentials");
        }

        const valid = await comparePassword(password, user.password);
        if(!valid){
            throw new AppError(401, ErrorCode.AUTHENTICATION_ERROR, "Invalid Credentials");
        }

        const accessToken = signAccessToken({
            userId: user.id,
            role: user.role as "admin" | "teacher",
        });

        const refreshToken = signRefreshToken();
        await refreshTokenRepository.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000), // 7days
        });
        
        return { accessToken, refreshToken };
    },

    refresh: async(token: string) =>{
        const existing = await refreshTokenRepository.findByToken(token);
        if(!existing){
            throw new AppError(401, ErrorCode.AUTHENTICATION_ERROR, "Invalid refresh token");
        }

        if(new Date() > existing.expiresAt){
            await refreshTokenRepository.deleteByToken(token);
            throw new AppError(401, ErrorCode.AUTHENTICATION_ERROR, "Refresh token expired");
        }

        const user = await userRepository.findById(existing.userId);
        if(!user){
            throw new AppError(401, ErrorCode.AUTHENTICATION_ERROR, "User not found");
        }

        await refreshTokenRepository.deleteByToken(token);

        const accessToken = signAccessToken({
            userId: user.id,
            role: user.role as "admin" | "teacher",
        });

        const refreshToken = signRefreshToken();

        await refreshTokenRepository.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000),
        });

        return { accessToken, refreshToken };
    },

    logout: async(token: string) =>{
        const existing = await refreshTokenRepository.findByToken(token);
        if(!existing){
            throw new AppError(401, ErrorCode.AUTHENTICATION_ERROR, "Invalid refresh token");
        }
        await refreshTokenRepository.deleteByToken(token);
    },
};