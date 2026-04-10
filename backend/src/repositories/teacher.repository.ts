import { db } from "../db/client";
import { teachers, users } from "../db/schema";
import { eq, ilike, and } from "drizzle-orm";
import { careerRecords } from "../db/schema";

type Teacher = typeof teachers.$inferSelect;
type NewTeacher = typeof teachers.$inferInsert;

export const teacherRepository = {
  findById: async (id: string) => {
    const [teacher] = await db
      .select({
        id:                  teachers.id,
        userId:              teachers.userId,
        name:                teachers.name,
        address:             teachers.address,
        contact:             teachers.contact,
        email:               teachers.email,
        gender:              teachers.gender,
        imageUrl:            teachers.imageUrl,
        dob:                 teachers.dob,
        teachingSince:       teachers.teachingSince,
        createdAt:           teachers.createdAt,
        updatedAt:           teachers.updatedAt,
        currentOrganization: careerRecords.organization,
      })
      .from(teachers)
      .leftJoin(
        careerRecords,
        and(
          eq(careerRecords.teacherId, teachers.id),
          eq(careerRecords.stillWorking, 1)
        )
      )
      .where(eq(teachers.id, id));

    return teacher;
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

  findAll: async (search?: string): Promise<Teacher[]> => {
    const query = db
      .select({
        id:                  teachers.id,
        userId:              teachers.userId,
        name:                teachers.name,
        address:             teachers.address,
        contact:             teachers.contact,
        email:               teachers.email,
        gender:              teachers.gender,
        imageUrl:            teachers.imageUrl,
        dob:                 teachers.dob,
        teachingSince:       teachers.teachingSince,
        createdAt:           teachers.createdAt,
        updatedAt:           teachers.updatedAt,
        currentOrganization: careerRecords.organization,
      })
      .from(teachers)
      .leftJoin(
        careerRecords,
        and(
          eq(careerRecords.teacherId, teachers.id),
          eq(careerRecords.stillWorking, 1)
        )
      );

    if (search) {
      return query.where(ilike(teachers.name, `%${search}%`));
    }

    return query;

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
};