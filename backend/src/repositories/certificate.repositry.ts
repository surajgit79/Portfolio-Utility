import { db } from "../db/client"
import { teachers, trainingEvents, trainingRecords } from "../db/schema"
import { eq } from "drizzle-orm";


export const certificateRepository = {
    findByCertificateNumber: async (certificateNumber: string)=>{
        const [record] = await db.select().from(trainingRecords).where(eq(trainingRecords.certificateNumber, certificateNumber));
        return record;
    },

    findByRecordId: async (recordId: string)=>{
        const [record] = await db.select().from(trainingRecords).where(eq(trainingRecords.id, recordId));
        return record;
    },

    findTrainingEvent: async (trainingEventId: string)=>{
        const [training] = await db.select().from(trainingEvents).where(eq(trainingEvents.id, trainingEventId));
        return training;
    },

    findTeacher: async(teacherId: string)=>{
        const [teacher] = await db.select().from(teachers).where(eq(teachers.id, teacherId));
        return teacher;
    },

    findByEventId: async (eventId: string) => {
        return db.select().from(trainingRecords).where(eq(trainingRecords.trainingEventId, eventId));
    },

    findByEventIdWithTeachers: async(eventId: string)=>{
        return db.select({
            id: trainingRecords.id,
            teacherId: trainingRecords.teacherId,
            trainingEventId: trainingRecords.trainingEventId,
            rating: trainingRecords.rating,
            certificateNumber: trainingRecords.certificateNumber,
            refPhotos: trainingRecords.refPhotos,
            createdAt: trainingRecords.createdAt,
            teacherName: teachers.name,
        })
        .from(trainingRecords)
        .innerJoin(teachers, eq(trainingRecords.teacherId, teachers.id))
        .where(eq(trainingRecords.trainingEventId, eventId))
        .orderBy(teachers.name);
    }
}