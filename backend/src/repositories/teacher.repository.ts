import { db } from "../db/client";
import { teachers, trainingEvents, trainingRecords, users } from "../db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";
import { careerRecords } from "../db/schema";

type Teacher = typeof teachers.$inferSelect;
type NewTeacher = typeof teachers.$inferInsert;

export const teacherRepository = {
  findById: async (id: string) => {
    const results = await db
      .select({
        id:                  teachers.id,
        userId:              teachers.userId,
        name:                teachers.name,
        address:             teachers.address,
        contact:             teachers.contact,
        email:               teachers.email,
        gender:              teachers.gender,
        qualification:       teachers.qualification,
        imageUrl:            teachers.imageUrl,
        dob:                 teachers.dob,
        teachingSince:       teachers.teachingSince,
        createdAt:           teachers.createdAt,
        updatedAt:           teachers.updatedAt,
        currentOrganization: careerRecords.organization,
        currentGrades:       careerRecords.grade,
        program:             trainingEvents.program,
        module:              trainingEvents.module,
        unit:                trainingEvents.unit,
      })
      .from(teachers).where(eq(teachers.id, id))
      .leftJoin(
        careerRecords,
        and(
          eq(careerRecords.teacherId, teachers.id),
          eq(careerRecords.stillWorking, 1)
        )
      ).leftJoin(
        trainingRecords,
        eq(trainingRecords.teacherId, teachers.id)
      )
      .leftJoin(
        trainingEvents,
        eq(trainingEvents.id, trainingRecords.trainingEventId)
      );

    if (!results.length) return null;

    const teacher = results[0];
    const uniqueGrades = [...new Set(results.map(r => r.currentGrades).filter(Boolean))];

    return {
      ...teacher,
      currentGrades: uniqueGrades,
    };
  },

  findByUserId: async (userId: string): Promise<Teacher | undefined> => {
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.userId, userId));
    return teacher;
  },

  findByEmail: async (email: string): Promise<Teacher | undefined> => {
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.email, email));
    return teacher;
  },

  findAll: async (search?: string, page = 1, limit = 10): Promise<Teacher[]> => {
    const offset = (page -1)*limit;
    
    const currentCareerSubquery = db
      .select({
        teacherId: careerRecords.teacherId,
        organization: careerRecords.organization,
      })
      .from(careerRecords)
      .where(eq(careerRecords.stillWorking, 1))
      .limit(1)
      .as("current_career");

    const currentGradesSubquery = db
      .select({
        teacherId: careerRecords.teacherId,
        sql: sql`array_agg(${careerRecords.grade})`.as("grades"),
      })
      .from(careerRecords)
      .where(eq(careerRecords.stillWorking, 1))
      .groupBy(careerRecords.teacherId)
      .as("current_grades");

    let query = db
      .select({
        id:                  teachers.id,
        userId:              teachers.userId,
        name:                teachers.name,
        address:             teachers.address,
        contact:             teachers.contact,
        email:               teachers.email,
        gender:              teachers.gender,
        qualification:       teachers.qualification,
        imageUrl:            teachers.imageUrl,
        dob:                 teachers.dob,
        teachingSince:       teachers.teachingSince,
        createdAt:           teachers.createdAt,
        updatedAt:           teachers.updatedAt,
        currentOrganization: currentCareerSubquery.organization,
        currentGrades:      currentGradesSubquery.sql,
      })
      .from(teachers)
      .leftJoin(currentCareerSubquery, eq(currentCareerSubquery.teacherId, teachers.id))
      .leftJoin(currentGradesSubquery, eq(currentGradesSubquery.teacherId, teachers.id));

    if (search) {
      return query.where(ilike(teachers.name, `%${search}%`)).limit(limit).offset(offset);
    }

    return query.limit(limit).offset(offset);

  },

  findCareerAndTraining: async (teacherId: string) => {
    const career = await db
      .select({
        organization: careerRecords.organization,
        grade: careerRecords.grade,
      })
      .from(careerRecords)
      .where(and(
        eq(careerRecords.teacherId, teacherId),
        eq(careerRecords.stillWorking, 1)
      ));

    const training = await db
      .select({
        program: trainingEvents.program,
        module: trainingEvents.module,
        unit:   trainingEvents.unit,
      })
      .from(trainingRecords)
      .leftJoin(trainingEvents, eq(trainingEvents.id, trainingRecords.trainingEventId))
      .where(eq(trainingRecords.teacherId, teacherId))
      .limit(1);

    return {
      currentOrganization: career[0]?.organization,
      currentGrades: career.map(c => c.grade).filter(Boolean),
      ...training[0],
    };
  },

  create: async (data: NewTeacher): Promise<Teacher> => {
    const [teacher] = await db
      .insert(teachers)
      .values(data)
      .returning();
    return teacher;
  },

  update: async (id: string, data: Partial<NewTeacher>): Promise<Teacher> => {
    const [teacher] = await db
      .update(teachers)
      .set(data)
      .where(eq(teachers.id, id))
      .returning();
    return teacher;
  },

  delete: async (id: string): Promise<void> => {
    const [ teacher ] = await db.select().from(teachers).where(eq(teachers.id, id));

    if(teacher){
      await db.delete(users).where(eq(users.id, teacher.userId));
    }
  },

  countAll: async(search?: string): Promise<number>=>{
    const query = db.select({ count: sql<number>`count(*)`}).from(teachers);

    if(search){
      const [result] = await query.where(ilike(teachers.name, `%${search}%`));
      return Number(result.count);
    }

    const [result] = await query;
    return Number(result.count);
  }
};