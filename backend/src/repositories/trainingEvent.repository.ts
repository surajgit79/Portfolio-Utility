import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { trainingEvents } from "../db/schema";

type TrainingEvent = typeof trainingEvents.$inferSelect;
type NewTrainingEvent = typeof trainingEvents.$inferInsert;

export const trainingEventRepository = {
    findAll: async (program?: string, module?: string, unit?: string, page = 1, limit = 10) =>{
        const offset = (page -1)*limit;
        const query = db.select().from(trainingEvents).limit(limit).offset(offset);

        const conditions = [];
        if(program) conditions.push(eq(trainingEvents.program, program as any));
        if(module) conditions.push(eq(trainingEvents.module, module));
        if(unit) conditions.push(eq(trainingEvents.unit, unit));

        if(conditions.length > 0){
            return query.where(and(...conditions));
        }

        return query;
    },

    countAll: async(program?: string, module?: string, unit?: string): Promise<number> =>{
        const query = db.select({ count: sql<number>`count(*)`}).from(trainingEvents);
        
        const conditions = [];
        if (program) conditions.push(eq(trainingEvents.program, program as any));
        if (module)   conditions.push(eq(trainingEvents.module, module));
        if (unit)    conditions.push(eq(trainingEvents.unit, unit));

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
        program: string,
        module: string,
        unit: string | null | undefined,
        startDate: Date
    ): Promise<TrainingEvent | undefined> =>{
        const conditions = [
        eq(trainingEvents.program, program as any),
        eq(trainingEvents.module, module),
        eq(trainingEvents.startDate, startDate),
        ];

        if (unit) conditions.push(eq(trainingEvents.unit, unit));

        const [result] = await db.select().from(trainingEvents).where(and(...conditions));
        return result;
    }
};