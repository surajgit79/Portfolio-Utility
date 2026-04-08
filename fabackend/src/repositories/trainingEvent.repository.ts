import { and, eq } from "drizzle-orm";
import { db } from "../db/client";
import { trainingEvents } from "../db/schema";

type TrainingEvent = typeof trainingEvents.$inferInsert;
type NewTrainingEvent = typeof trainingEvents.$inferInsert;

export const trainingEventRepository = {
    findAll: async (category?: string, sector?: string, phase?: string): Promise<TrainingEvent[]> =>{
        const result = await db.select().from(trainingEvents);

        return result.filter((event)=>{
            if( category && event.category !== category) return false;
            if(sector && event.sector !== sector) return false;
            if(phase && event.phase !== phase) return false;
            return true;
        });
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
        const duplicate = await db.select().from(trainingEvents).where(
            and(
                eq(trainingEvents.category, category as any),
                eq(trainingEvents.sector, sector),
                eq(trainingEvents.startDate, startDate)
            )
        );
        return duplicate[0];
    }
}