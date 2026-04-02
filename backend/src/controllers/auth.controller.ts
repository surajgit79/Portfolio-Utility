import { FastifyRequest, FastifyReply} from "fastify";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashedPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { generateId } from "../utils/idGenerator";
import { registerSchema } from "../utils/validation";

export const register = async (
    request : FastifyRequest,
    reply: FastifyReply
) =>{

    const body = registerSchema.safeParse(request.body);
    if(!body.success){
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: body.error.flatten().fieldErrors,
        }); 
    }

    const {email, password, role} = body.data;

    const existing = await db.select().from(users).where(eq(users.email, email));
    if(existing.length > 0){
        return reply.status(409).send({success: false, message: "Email alreasdy exits"});
    }

    const hashed = await hashedPassword(password);
    const id = await generateId("users");

    const [user] = await db.insert(users).values({
        id,
        email,
        password: hashed,
        role,
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
    const body = registerSchema.safeParse(request.body);
    if(!body.success){
        return reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: body.error.flatten().fieldErrors,
        }); 
    }

    const {email, password} = body.data;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if(!user){
        return reply.status(401).send({success: false, message: "Invalid Credentials"});
    }

    const valid = await comparePassword(password, user.password);
    if(!valid){
        return reply.status(401).send({success: false, message: "Invalid Credentials"});
    }

    const token = signToken({userId: user.id, role: user.role as "admin" | "teacher"});

    return reply.status(200).send({success: true, message: "Logged In Successfully", data: {token}});
};
