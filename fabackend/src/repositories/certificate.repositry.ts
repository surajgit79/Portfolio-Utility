import { db } from "../db/client"
import { teachers, trainingEvents, trainingRecords } from "../db/schema"
import { eq } from "drizzle-orm";


export const certificateRepository = {
    findByCertificateNumber: async (certificateNumber: string)=>{
        const [record] = await db.select().from(trainingRecords).where(eq(trainingRecords.certificateNumber, certificateNumber));
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

}