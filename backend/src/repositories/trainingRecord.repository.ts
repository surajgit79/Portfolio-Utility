import { db } from "../db/client";
import { trainingRecords, trainingEvents } from "../db/schema";
import { eq, and } from "drizzle-orm";

type TrainingRecord = typeof trainingRecords.$inferInsert;
type NewTrainingRecord = typeof trainingRecords.$inferInsert;

export const trainingRecordRepository = {
    create: async(data:NewTrainingRecord): Promise<TrainingRecord>=>{
        const [record] = await db.insert(trainingRecords).values(data).returning();
        return record;
    },

    findById: async(id: string): Promise<TrainingRecord | undefined>=>{
        const [record] = await db.select().from(trainingRecords).where(eq(trainingRecords.id, id));
        return record;
    },

    findByTeacherId: async(teacherId: string): Promise<TrainingRecord[]>=>{
        const record = await db.select().from(trainingRecords).where(eq(trainingRecords.teacherId, teacherId));
        return record;
    },

    findByTeacherIdWithEvent: async(teacherId: string) =>{
        return db.select({
            id:                trainingRecords.id,
            teacherId:         trainingRecords.teacherId,
            trainingEventId:   trainingRecords.trainingEventId,
            rating:            trainingRecords.rating,
            certificateNumber: trainingRecords.certificateNumber,
            refPhotos:         trainingRecords.refPhotos,
            createdAt:         trainingRecords.createdAt,
            updatedAt:         trainingRecords.updatedAt,
            // Training event details
            trainingName:      trainingEvents.name,
            category:          trainingEvents.category,
            sector:            trainingEvents.sector,
            phase:             trainingEvents.phase,
            description:       trainingEvents.description,
            mentorsName:       trainingEvents.mentorsName,
            venue:             trainingEvents.venue,
            startDate:         trainingEvents.startDate,
            duration:          trainingEvents.duration,
        }).from(trainingRecords)
        .innerJoin(
            trainingEvents,
            eq(trainingRecords.trainingEventId, trainingEvents.id)
        )
        .where(eq(trainingRecords.teacherId, teacherId));
    },

    findByEventId: async(eventId: string): Promise<TrainingRecord[]>=>{
        const record = await db.select().from(trainingRecords).where(eq(trainingRecords.trainingEventId, eventId));
        return record;
    },

    findByTeacherAndEvent: async(teacherId: string, trainingEventId: string): Promise<TrainingRecord | undefined>=>{
        const [record] = await db.select().from(trainingRecords).where(and(
            eq(trainingRecords.teacherId, teacherId),
            eq(trainingRecords.trainingEventId, trainingEventId)
        ));
        return record;
    },

    update: async(id:string, data: Partial<NewTrainingRecord>): Promise<TrainingRecord>=>{
        const [record] = await db.update(trainingRecords).set(data).where(eq(trainingRecords.id, id)).returning();
        return record;
    },

    delete: async(id:string): Promise<void>=>{
        await db.delete(trainingRecords).where(eq(trainingRecords.id, id));
    },

}