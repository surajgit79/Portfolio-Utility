import { db } from "../db/client";
import { trainingRecords } from "../db/schema";
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