import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "../db/client";
import { careerRecords } from "../db/schema"

type Career = typeof careerRecords.$inferSelect;
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

    findByTeacherId: async (teacherId: string, page = 1, limit = 10)=>{
        const offset = (page -1)*limit;
        return db.select().from(careerRecords).where(eq(careerRecords.teacherId, teacherId)).orderBy(desc(careerRecords.createdAt)).limit(limit).offset(offset);
    },

    countByTeacherId: async(teacherId: string): Promise<number>=>{
        const [result] = await db.select({ count: sql<number>`count(*)`}).from(careerRecords).where(eq(careerRecords.teacherId, teacherId));
        return Number(result.count); 
    },

    update: async(id:string, data:Partial<Career>): Promise<Career | undefined>=>{
        const [record] = await db.update(careerRecords).set(data).where(eq(careerRecords.id, id)).returning();
        return record;
    },

    delete: async(id:string):Promise<void>=>{
        await db.delete(careerRecords).where(eq(careerRecords.id, id));
    },

    findDuplicate: async(teacherId: string, role: string, organization: string): Promise<Career | undefined>=>{
        const [record] = await db.select().from(careerRecords).where(
            and(
                eq(careerRecords.teacherId, teacherId),
                eq(careerRecords.role, role),
                eq(careerRecords.organization, organization)
            )
        );
        return record;
    },
};