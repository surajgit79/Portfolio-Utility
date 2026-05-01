import { db } from "../db/client";
import { trainingRecords, trainingEvents, teachers, skills, teacherSkills } from "../db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

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

    findByTeacherId: async(teacherId: string, page = 1, limit = 10) => {
        const offset = (page -1 )*limit;
        return db.select().from(trainingRecords).where(eq(trainingRecords.teacherId, teacherId)).orderBy(desc(trainingRecords.updatedAt)).limit(limit).offset(offset);
    },

    countByTeacherId: async(teacherId: string): Promise<number> =>{
        const [result] = await db.select({ count: sql<number>`count(*)`}).from(trainingRecords).where(eq(trainingRecords.teacherId, teacherId));
        return Number(result.count);
    },


    findByTeacherIdWithEvent: async(teacherId: string, page = 1, limit = 10) =>{
        const offset = ( page -1)*limit;
        return db.select({
            id: trainingRecords.id,
            teacherId: trainingRecords.teacherId,
            trainingEventId: trainingRecords.trainingEventId,
            rating: trainingRecords.rating,
            certificateNumber: trainingRecords.certificateNumber,
            refPhotos: trainingRecords.refPhotos,
            feedback: trainingRecords.feedback,
            trainingDate: trainingRecords.trainingDate,
            createdAt: trainingRecords.createdAt,
            updatedAt: trainingRecords.updatedAt,
            trainingName: trainingEvents.name,
            program: trainingEvents.program,
            module: trainingEvents.module,
            unit: trainingEvents.unit,
            description: trainingEvents.description,
            mentorsName: trainingEvents.mentorsName,
            venue: trainingEvents.venue,
            startDate: trainingEvents.startDate,
            duration: trainingEvents.duration,
        }).from(trainingRecords)
        .innerJoin(
            trainingEvents,
            eq(trainingRecords.trainingEventId, trainingEvents.id)
        )
        .where(eq(trainingRecords.teacherId, teacherId)).orderBy(desc(trainingRecords.updatedAt)).limit(limit).offset(offset);
    },

    findByEventIdWithTeacher: async(eventId: string, page = 1, limit = 10)=>{
        const offset = ( page -1 ) * limit;
        return db.select({
            id: trainingRecords.id, 
            teacherId: trainingRecords.teacherId,
            trainingEventId: trainingRecords.trainingEventId,
            rating: trainingRecords.rating,
            certificateNumber: trainingRecords.certificateNumber,
            refPhotos: trainingRecords.refPhotos,
            feedback: trainingRecords.feedback,
            trainingDate: trainingRecords.trainingDate,
            createdAt: trainingRecords.createdAt,
            updatedAt: trainingRecords.updatedAt,
            teacherName: teachers.name,
            teacherEmail: teachers.email,
            teacherImage: teachers.imageUrl,
        }).from(trainingRecords)
        .innerJoin(
            teachers,
            eq(trainingRecords.teacherId, teachers.id)
        ).where(eq(trainingRecords.trainingEventId, eventId))
        .orderBy(desc(trainingRecords.updatedAt)).limit(limit).offset(offset);
    },

    findByIdWithDetails: async (id:string)=>{
        const [record] = await db.select({
            id: trainingRecords.id,
            rating: trainingRecords.rating,
            feedback: trainingRecords.feedback,
            trainingDate: trainingRecords.trainingDate,
            refPhotos: trainingRecords.refPhotos,
            certificateNumber: trainingRecords.certificateNumber,
            createdAt: trainingRecords.createdAt,
            updatedAt: trainingRecords.updatedAt,

            trainingName: trainingEvents.name,
            program: trainingEvents.program,
            module: trainingEvents.module,
            unit: trainingEvents.unit,
            venue: trainingEvents.venue,
            description: trainingEvents.description,
            startDate: trainingEvents.startDate,
            mentorsName: trainingEvents.mentorsName,

            teacherId: teachers.id,
            teacherName: teachers.name,
            teacherEmail: teachers.email,
        }).from(trainingRecords)
        .innerJoin(trainingEvents, eq(trainingRecords.trainingEventId, trainingEvents.id))
        .innerJoin(teachers, eq(trainingRecords.teacherId, teachers.id))
        .where(eq(trainingRecords.id, id));

        if(!record) return undefined;

        const acquiredSkills = await db.select({
            id: skills.id,
            name: skills.name,
            program: skills.program,
            module: skills.module,
            unit: skills.unit
        }).from(teacherSkills)
        .innerJoin(skills, eq(teacherSkills.skillId, skills.id))
        .where(
            and(
                eq(teacherSkills.teacherId, record.teacherId),
                eq(teacherSkills.trainingRecordId, id)
            )
        );

        return {
            id: record.id,
            rating: record.rating,
            feedback: record.feedback,
            trainingDate: record.trainingDate,
            refPhotos: record.refPhotos,
            certificateNumber: record.certificateNumber,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            training: {
                name: record.trainingName,
                program: record.program,
                module: record.module,
                unit: record.unit,
                venue: record.venue,
                description: record.description,
                startDate: record.startDate,
                mentorsName: record.mentorsName,
            },
            teacher: {
                id: record.teacherId,
                name: record.teacherName,
                email: record.teacherEmail,
            },
            skills: acquiredSkills,
        };
    },

    findByEventId: async(eventId: string, page = 1, limit = 10) =>{
        const offset = (page -1)*limit;
        return db.select().from(trainingRecords).where(eq(trainingRecords.trainingEventId, eventId)).orderBy(desc(trainingRecords.updatedAt)).limit(limit).offset(offset);
    },

    countByEventId: async(eventId: string): Promise<number> =>{
        const [result] = await db.select({ count: sql<number>`count(*)`}).from(trainingRecords).where(eq(trainingRecords.trainingEventId, eventId));
        return Number(result.count);
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