import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { careerRecords } from "../db/schema"

type Career = typeof careerRecords.$inferInsert;
type NewCareer = typeof careerRecords.$inferInsert;

export const careerRecordRepository = {
    create: async (data: NewCareer): Promise<Career>=>{
        const [record] = await db.insert(careerRecords).values(data).returning();
        return record;
    },

    findById: async(id: string): Promise<Career | undefined>=>{
        const [record] = await db.select().from(careerRecords).where(eq(careerRecords.id,id));
        return record;
    },

    findByTeacherId: async (tecaherId: string): Promise<Career[]>=>{
        const record = await db.select().from(careerRecords).where(eq(careerRecords.teacherId, tecaherId));
        return record;
    },

    update: async(id:string, data:Partial<Career>): Promise<Career | undefined>=>{
        const [record] = await db.update(careerRecords).set(data).where(eq(careerRecords.id, id)).returning();
        return record;
    },

    delete: async(id:string):Promise<void>=>{
        await db.delete(careerRecords).where(eq(careerRecords.id, id));
    },
};