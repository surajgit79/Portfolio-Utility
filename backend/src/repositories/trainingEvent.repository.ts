import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { trainingEvents } from "../db/schema";

type TrainingEvent = typeof trainingEvents.$inferSelect;
type NewTrainingEvent = typeof trainingEvents.$inferInsert;

export const trainingEventRepository = {
    findAll: async (category?: string, sector?: string, phase?: string, page = 1, limit = 10) =>{
        const offset = (page -1)*limit;
        const query = db.select().from(trainingEvents).limit(limit).offset(offset);

        const conditions = [];
        if(category) conditions.push(eq(trainingEvents.category, category as any));
        if(sector) conditions.push(eq(trainingEvents.sector, sector));
        if(phase) conditions.push(eq(trainingEvents.phase, phase));

        if(conditions.length > 0){
            return query.where(and(...conditions));
        }

        return query;
    },

    countAll: async(category?: string, sector?: string, phase?: string): Promise<number> =>{
        const query = db.select({ count: sql<number>`count(*)`}).from(trainingEvents);
        
        const conditions = [];
        if (category) conditions.push(eq(trainingEvents.category, category as any));
        if (sector)   conditions.push(eq(trainingEvents.sector, sector));
        if (phase)    conditions.push(eq(trainingEvents.phase, phase));

        if (conditions.length > 0) {
        const [result] = await query.where(and(...conditions));
        return Number(result.count);
        }

        const [result] = await query;
        return Number(result.count);
    },

    findById: async(id: string): Promise<TrainingEvent | undefined> =>{
        const [event] = await db.select().from(trainingEvents).where(eq(trainingEvents.id, id));
        return event;
    },

    create: async (data: NewTrainingEvent): Promise<TrainingEvent>=>{
        const [event] = await db.insert(trainingEvents).values(data).returning();
        return event;
    },

    update: async (id:string, data:Partial<NewTrainingEvent>): Promise<TrainingEvent>=>{
        const [event] = await db.update(trainingEvents).set(data).where(eq(trainingEvents.id, id)).returning();
        return event;
    },

    delete: async (id: string):Promise<void>=>{
        await db.delete(trainingEvents).where(eq(trainingEvents.id, id));
    },

    findDuplicate: async(
        category: string,
        sector: string,
        phase: string | null | undefined,
        startDate: Date
    ): Promise<TrainingEvent | undefined> =>{
        const [duplicate] = await db.select().from(trainingEvents).where(
            and(
                eq(trainingEvents.category, category as any),
                eq(trainingEvents.sector, sector),
                eq(trainingEvents.startDate, startDate)
            )
        );
        return duplicate;
    }
}