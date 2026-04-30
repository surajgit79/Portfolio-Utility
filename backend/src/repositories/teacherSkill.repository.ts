import { db } from "../db/client";
import { teacherSkills, skills } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

type TeacherSkill    = typeof teacherSkills.$inferSelect;
type NewTeacherSkill = typeof teacherSkills.$inferInsert;

export const teacherSkillRepository = {
  findByTeacherId: async (teacherId: string): Promise<TeacherSkill[]> => {
    return db.select() .from(teacherSkills).where(eq(teacherSkills.teacherId, teacherId));
  },

  findByTeacherIdWithSkill: async (teacherId: string) => {
    return db.select({
        id: teacherSkills.id,
        teacherId: teacherSkills.teacherId,
        skillId: teacherSkills.skillId,
        trainingRecordId: teacherSkills.trainingRecordId,
        createdAt: teacherSkills.createdAt,
        skillName: skills.name,
        program: skills.program,
        module: skills.module,
        unit: skills.unit,
      })
      .from(teacherSkills)
      .innerJoin(skills, eq(teacherSkills.skillId, skills.id))
      .where(eq(teacherSkills.teacherId, teacherId));
  },

  findDuplicate: async (teacherId: string, skillId: string): Promise<TeacherSkill | undefined> => {
    const [record] = await db.select().from(teacherSkills)
      .where(
        and(
          eq(teacherSkills.teacherId, teacherId),
          eq(teacherSkills.skillId, skillId)
        )
      );
    return record;
  },

  create: async (data: NewTeacherSkill): Promise<TeacherSkill> => {
    const [record] = await db.insert(teacherSkills).values(data).returning();
    return record;
  },

  getPercentageByTeacher: async (teacherId: string) => {
    const result = await db.execute(
      sql`
        SELECT
          s.program,
          s.module,
          s.unit,
          COUNT(s.id)::int AS "totalSkills",
          COUNT(ts.id)::int AS "acquiredSkills",
          ROUND((COUNT(ts.id)::decimal / COUNT(s.id)::decimal) * 100, 2) AS "percentage"
        FROM skills s
        LEFT JOIN teacher_skills ts
          ON ts.skill_id = s.id
          AND ts.teacher_id = ${teacherId}
        GROUP BY s.program, s.module, s.unit
        ORDER BY s.program, s.module, s.unit
      `
    );

    return result.rows as {
      program: string;
      module: string;
      unit: string | null;
      totalSkills: number;
      acquiredSkills: number;
      percentage: string;
    }[];
  },

  delete: async (teacherId: string, skillId: string): Promise<void> => {
    await db
      .delete(teacherSkills)
      .where(
        and(
          eq(teacherSkills.teacherId, teacherId),
          eq(teacherSkills.skillId, skillId)
        )
      );
  },
};