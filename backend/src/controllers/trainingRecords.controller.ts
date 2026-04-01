import { FastifyRequest, FastifyReply } from "fastify";
import { trainingEvents, trainingRecords } from "../db/schema";
import { db } from "../db/client";
import { eq } from "drizzle-orm";
import { generateCertificateNumber, generateId } from "../utils/idGenerator";
import { success } from "zod";
import { request } from "node:http";

export const createTrainingRecords = async (
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { teacherId, trainingEventId, rating, refPhotos} = request.body as {
        teacherId: string;
        trainingEventId: string;
        rating: number;
        refPhotos: string;
    };

    // check if the training event exists or not
    const [event] = await db.select().from(trainingEvents).where(eq(trainingEvents.id, trainingEventId));
    if(!event){
        return reply.status(404).send({success:false, message: "Training Event not found"});
    };

    // check if the training records are already recorded
    const [exists] = await db.select().from(trainingRecords).where(eq(trainingRecords.teacherId, teacherId));
    if(exists){
        return reply.status(409).send({success:false, message: "Training record already exists for the teacher and event"});
    };

    const id = await generateId("training_records");
    const certificateNumber = await generateCertificateNumber(event.category, event.sector, event.phase ?? null);
    
    const [record] = await db.insert(trainingRecords).values({
        id,
        teacherId,
        trainingEventId,
        rating,
        certificateNumber,
        refPhotos,
    }).returning();

    return reply.send({
        success: true,
        message: "Training record created successfully",
        data: record,
    });
};


export const bulkCreateTrainingRecords = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { trainingEventId, teacherIds, rating } = request.body as {
        trainingEventId: string;
        teacherIds: string[];
        rating: number;
    }

    const [event] = await db.select().from(trainingEvents).where(eq(trainingEvents.id, trainingEventId));
    if(!event){
        return reply.status(400).send({success:false, message: "Training Event not found"});
    }

    const created = [];
    const skipped = [];

    for(const teacherId of teacherIds){
        const [existing] = await db.select().from(trainingRecords).where(eq(trainingRecords.teacherId, teacherId));
        if(existing){
            skipped.push(existing);
            continue;
        }

        const id = await generateId("training_records");
        const certificateNumber = await generateCertificateNumber(event.category, event.sector, event.phase?? null);
        const [record] = await db.insert(trainingRecords).values({
            id, teacherId, trainingEventId, rating, certificateNumber
        }).returning();

        created.push(record);
    }

    return reply.send({
        success: true,
        message: `${created.length} records created, ${skipped.length} records skipped (found duplicate)`,
        data: created,
    });
};

export const getTrainingRecordByTeacher = async(
    request:FastifyRequest,
    reply: FastifyReply
)=>{
    const { teacherId } = request.params as { teacherId: string};
    
    const records = await db.select().from(trainingRecords).where(eq(trainingRecords.teacherId, teacherId));
    if(!records){
        return reply.status(404).send({success: false, message:"No records found"});
    }

    return reply.send({
        success: true,
        message: "Training records fetched successfully",
        data: records,
    });
};

export const getTrainingRecordByEvent = async(
    request:FastifyRequest,
    reply: FastifyReply
)=>{
    const { trainingEventId } = request.params as { trainingEventId: string};

    const records = await db.select().from(trainingRecords).where(eq(trainingRecords.trainingEventId, trainingEventId));
    if(!records){
        return reply.status(404).send({
            success: false,
            message: "Records not found"
        });
    }

    return reply.send({
        success: true,
        message: "Trainnig Records fetched successfully",
        data: records,
    });
};


