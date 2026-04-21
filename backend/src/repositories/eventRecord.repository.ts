import { db } from "../db/client";
import { eventRecords } from "../db/schema";
import { and, eq, sql } from "drizzle-orm";

type EventRecord    = typeof eventRecords.$inferSelect;
type NewEventRecord = typeof eventRecords.$inferInsert;

export const eventRecordRepository = {
  findById: async (id: string): Promise<EventRecord | undefined> => {
    const [record] = await db
      .select()
      .from(eventRecords)
      .where(eq(eventRecords.id, id));
    return record;
  },

  findByTeacherId: async (teacherId: string, page = 1, limit = 10) => {
    const offset = (page - 1)* limit;
    return db
      .select()
      .from(eventRecords)
      .where(eq(eventRecords.teacherId, teacherId)).limit(limit).offset(offset);
  },

  countByTeacherId: async(teacherId: string): Promise<number>=>{
    const [result] = await db.select({ count: sql<number>`count(*)`}).from(eventRecords).where(eq(eventRecords.teacherId, teacherId));
    return Number(result.count);
  },

  create: async (data: NewEventRecord): Promise<EventRecord> => {
    const [record] = await db
      .insert(eventRecords)
      .values(data)
      .returning();
    return record;
  },

  update: async (id: string, data: Partial<NewEventRecord>): Promise<EventRecord> => {
    const [record] = await db
      .update(eventRecords)
      .set(data)
      .where(eq(eventRecords.id, id))
      .returning();
    return record;
  },

  delete: async (id: string): Promise<void> => {
    await db.delete(eventRecords).where(eq(eventRecords.id, id));
  },

  findDuplicate: async(teacherId: string, name: string, date: Date): Promise<EventRecord| undefined>=>{
    const [record] = await db.select().from(eventRecords).where(
      and(
        eq(eventRecords.teacherId, teacherId),
        eq(eventRecords.name, name),
        eq(eventRecords.date, date)
      )
    );
    return record;
  },
};