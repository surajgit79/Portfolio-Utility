import { FastifyRequest, FastifyReply} from "fastify";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashedPassword, comaprePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { success } from "zod";
import { tr } from "zod/v4/locales";

export const register = async (
    request : FastifyRequest,
    reply: FastifyReply
) =>{
    const {email, password, role} = request.body as {
        email: string;
        password: string;
        role: "admin" | "teacher";
    };

    const existing = await db.select().from(users).where(eq(users.email, email));

    if(existing.length > 0){
        return reply.status(409).send({success: false, message: "Email alreasdy exits"});
    }

    const hashed = await hashedPassword(password);

    const [user] = await db.insert(users).values({
        email,
        password: hashed,
        role
    }).returning();

    const token = signToken({userId: user.id, role: user.role as "admin" | "teacher"});
    
    return reply.status(201).send({
        success: true,
        message: "User registered successfully",
        data: {token}
    });
};

export const login = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const {email, password} = request.body as {
        email: string;
        password: string;
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if(!user){
        return reply.status(401).send({success: false, message: "Invalid Credentials"});
    }

    const valid = await comaprePassword(password, user.password);

    if(!valid){
        return reply.status(401).send({success: false, message: "Invalid Credentials"});
    }

    const token = signToken({userId: user.id, role: user.role as "admin" | "teacher"});

    return reply.status(200).send({success: true, message: "Logged In Successfully", data: {token}});
};
