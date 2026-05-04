import { db } from "../db/client"
import { teachers, trainingEvents, trainingRecords, teacherSkills, skills } from "../db/schema"
import { eq, and } from "drizzle-orm";


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

    findSkillsByTrainingRecord: async (teacherId: string, trainingEventId: string) => {
      return db.select({
        name: skills.name,
        module: skills.module,
        unit: skills.unit,
      })
      .from(teacherSkills)
      .innerJoin(skills, eq(teacherSkills.skillId, skills.id))
      .innerJoin(trainingRecords, eq(teacherSkills.trainingRecordId, trainingRecords.id))
      .where(
        and(
          eq(teacherSkills.teacherId, teacherId),
          eq(trainingRecords.trainingEventId, trainingEventId)
        )
      );
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