import { userRepository } from "../repositories/user.repository"
import { AppError, ErrorCode } from "../utils/errorHandler";
import { generateId } from "../utils/idGenerator";
import { signToken } from "../utils/jwt";
import { comparePassword, hashedPassword } from "../utils/password";

export const authService = {
    register: async (email: string, password: string, role: "admin" | "teacher")=>{
        const existing = await userRepository.findByEmail(email);
        if(existing){
            throw new AppError(409, ErrorCode.CONFLICT, "Email already exists");
        }

        const hashed = await hashedPassword(password);
        const id = await generateId("teachers");

        const user = await userRepository.create({id, email, password: hashed, role});
        const token = signToken({ userId: user.id, role: user.role as "admin" | "teacher"});
        return {token}; 
    },

    login: async (email: string, password:string)=>{
        const user = await userRepository.findByEmail(email);
        if(!user){
            throw new AppError(404, ErrorCode.AUTHENTICATION_ERROR, "Invalid Credentials");
        }

        const valid = await comparePassword(user.password, password);
        if(!valid){
            throw new AppError(401, ErrorCode.AUTHENTICATION_ERROR, "Invalid Credentials");
        }

        const token = signToken({userId: user.id, role: user.role as "admin" | "teacher"});

        return {token};
    }
}