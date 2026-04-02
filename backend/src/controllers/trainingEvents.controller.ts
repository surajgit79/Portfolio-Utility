import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../db/client";
import { trainingEvents } from "../db/schema";
import { generateId } from "../utils/idGenerator";
import { eq } from "drizzle-orm";

export const createTrainingEvent = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { category, sector, phase, name, mentorsName, venue, description, startDate, duration,} = request.body as {
        category: "Activity-based Mathematics" | "Reading" | "Pre-School",
        sector: string;
        phase?: string;
        name: string;
        mentorsName?: string;
        venue?: string;
        description?: string;
        startDate: string;
        duration: string;
    };

    const id = await generateId("training_events");

    const [event] = await db.insert(trainingEvents).values({
        id,
        category,
        sector,
        phase,
        name,
        mentorsName,
        venue,
        description,
        startDate: new Date(startDate),
        duration,
    }).returning();

    return reply.status(201).send({
        success: true,
        message: "Training event created successfully",
        data: event,
    });
};

export const getTrainingEvents = async(
    request: FastifyRequest,
    reply: FastifyReply
) =>{
    const { category, sector } = request.params as{
        category?: string,
        sector?: string,
    };

    const result = await db.select().from(trainingEvents);

    const filtered = result.filter((event)=>{
        if(category && event.category !== category) return false;
        if(sector && event.sector !== sector) return false;
    });

    return reply.send({
        success: true,
        message: "Training events fetched successfully",
        data: filtered,
    });
};


export const getTrainingEventById = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.params as { id: string};

    const [event] = await db.select().from(trainingEvents).where(eq(trainingEvents.id, id));

    if(!event){
        return reply.status(404).send({success:false, message: "Training Event not found"});
    }

    return reply.send({
        success:true,
        message: "Training Event found",
        data: event,
    });
};

export const updateTrainigEvent = async(
    request: FastifyRequest,
    reply: FastifyReply
)=>{
    const { id } = request.body as {id: string};

    const [event] = await db.select().from(trainingEvents).where(eq(trainingEvents.id, id));
    if(!event){
        return reply.status(404).send({success:false, message: "Training Event not found"});
    }

    const { category, sector, phase, name, mentorsName, venue, description, startDate, duration,} = request.body as {
        category?: "Activity-based Mathematics" | "Reading" | "Pre-School",
        sector?: string;
        phase?: string;
        name?: string;
        mentorsName?: string;
        venue?: string;
        description?: string;
        startDate?: string;
        duration?: string;
    };

    const [updated] = await db.update(trainingEvents).set({
        ...(category && { category }),
        ...(sector && {sector}),
        ...(phase && { phase }),
        ...(name && { name }),
        ...(mentorsName && { mentorsName }),
        ...(venue && { venue }),
        ...(description && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(duration && { duration }),
        updatedAt: new Date(),
    }).where(eq(trainingEvents.id, id)).returning();

    return reply.send({
        success:true,
        message: "Training Event updated successfully",
        data: updated,
    });
};
