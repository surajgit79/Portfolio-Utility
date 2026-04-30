import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "../db/client";
import { skills } from "../db/schema";

type Skill = typeof skills.$inferSelect;
type NewSkill = typeof skills.$inferInsert;

export const skillRepository = {
    findAll: async ( program?: string, module?: string, unit?: string, page = 1, limit = 10)=>{
        const offset = (page - 1)*limit;
        let query = db.select().from(skills).orderBy(desc(skills.createdAt)).limit(limit).offset(offset);

        const conditions = [];
        if(program) conditions.push(eq(skills.program, program as any));
        if(module) conditions.push(eq(skills.module, module));
        if(unit) conditions.push(eq(skills.unit, unit));

        if(conditions.length>0){
            return query.where(and(...conditions));
        }

        return query;
    },

    countAll: async(program?: string, module?: string, unit?: string): Promise<number>=>{
        const query = db.select({count: sql<number>`count(*)`}).from(skills);

        const conditions = [];
        if(program) conditions.push(eq(skills.program, program as any));
        if(module) conditions.push(eq(skills.module, module));
        if(unit) conditions.push(eq(skills.unit, unit));

        if(conditions.length > 0){
            const [result] = await query.where(and(...conditions));
            return Number(result.count);
        }

        const [result] = await query;
        return Number(result.count);
    },

    findById: async (id: string): Promise<Skill | undefined> => {
        const [skill] = await db.select().from(skills).where(eq(skills.id, id));
        return skill;
    },

    findDuplicate: async(name: string, program: string, module: string, unit?: string ): Promise<Skill | undefined> =>{
        const conditions = [
            eq(skills.name, name),
            eq(skills.program, program as any),
            eq(skills.module, module),
        ];

        if(unit) conditions.push(eq(skills.unit, unit));

        const [skill] = await db.select().from(skills).where(and(...conditions));
        return skill;
    },

    create: async(data: NewSkill): Promise<Skill> => {
        const [skill] = await db.insert(skills).values(data).returning();
        return skill;
    },

    bulkCreate: async (data: NewSkill[]): Promise<Skill[]> => {
        return db.insert(skills).values(data).returning();
    },

    delete: async (id: string): Promise<void> => {
        await db.delete(skills).where(eq(skills.id, id));
    },
};