import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/client";
import { users, teachers } from "../db/schema";
import { eq } from "drizzle-orm";
import { string, success } from "zod";
import { id } from "zod/v4/locales";


export const createTeacher = async (
    request: FastifyRequest,
    reply: FastifyReply
) =>{

    const {userId, name, address, contact, email, gender, imageUrl, dob} = request.body as{
        userId: string,
        name: string,
        address: string,
        contact: string,
        email: string,
        gender: "Male" | "Female" | "Others",
        imageUrl?: string,
        dob: string
    }

    const existing = await db.select().from(teachers).where(eq(teachers.userId, userId));
    if(existing.length>0){
        return reply.status(409).send({success: false, message: "Teacher profile already exists for this user"});
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if(!user){
        return reply.status(404).send({success:false, message: "User not found"});
    }

    if(user.role !== "teacher"){
        return reply.status(400).send({
            success: false,
            message: "Users only with role 'teacher' can have a profile",
        })
    }

    const [teacher] = await db.insert(teachers).values({
        userId, 
        name, 
        address, 
        contact, 
        email, 
        gender, 
        imageUrl, 
        dob: new Date(dob)
    }).returning();

    return reply.status(201).send({success: true, message: "Tecaher profile created successfully", data: teacher});
}

export const getTeacher = async(
    request: FastifyRequest,
    reply: FastifyReply
) =>{
    const { search } = request.query as { search?: string};

    const result = await db.select().from(teachers);

    const filtered = search ? result.filter((t)=> 
        t.name.toLowerCase().includes(search.toLowerCase()))
    : result;

    return reply.send({
        success: true,
        message: "Teachers fetched successfully",
        data: filtered,
    });
};

export const getTeacherById = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as { id: string};

    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));

    if(!teacher){
        reply.status(404).send({success:false, message: "Teacher not found"});
    }

    return reply.send({
        success: true,
        message: "Teacher records found",
        data: teacher,
    });
};


export const updateTeacher = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as {id:string};

    const { name, address, contact, email, gender, imageUrl, dob } = request.params as{
        name?: string,
        address?: string,
        contact?: string,
        email?: string,
        gender?: "Male" | "Female" | "Others",
        imageUrl?: string,
        dob?: string
    }

    const [existing] = await db.select().from(teachers).where(eq(teachers.id, id));
    if(!existing){
        reply.status(404).send({ success:false, message: "Teacher records not found"});
    }

    const [ updated ] = await db.update(teachers).set({
        ...(name && {name}),
        ...(address && {address}),
        ...(contact && {contact}),
        ...(email && {email}),
        ...(gender && {gender}),
        ...(imageUrl && {imageUrl}),
        ...(dob && {dob: new Date(dob)}),
        updatedAt: new Date(),
    }).where(eq(teachers.id, id)).returning();

    return reply.send({
        success: true, 
        message: "Teachers' record Updated successfully", 
        data: updated
    });
}