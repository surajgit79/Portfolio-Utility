import { db } from "../db/client";
import { teachers } from "../db/schema";
import { eq, ilike } from "drizzle-orm";

type Teacher = typeof teachers.$inferSelect;
type NewTeacher = typeof teachers.$inferInsert;

export const teacherRepository = {
  findById: async (id: string): Promise<Teacher | undefined> => {
    const [teacher] = await db
      .select()
      .from(teachers)
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
    if (search) {
      return db
        .select()
        .from(teachers)
        .where(ilike(teachers.name, `%${search}%`));
    }
    return db.select().from(teachers);
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
    await db.delete(teachers).where(eq(teachers.id, id));
  },
};