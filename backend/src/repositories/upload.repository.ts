import { db } from "../db/client";
import { users, teachers } from "../db/schema";

export const uploadRepository = {
  createTeacherWithUser: async (data: {
    userId:        string;
    teacherId:     string;
    email:         string;
    hashedPassword: string;
    name:          string;
    address:       string;
    contact:       string;
    gender:        "Male" | "Female" | "Others";
    dob:           Date;
    teachingSince?: number | null;
    imageUrl?: string | null;
  }) => {
    return db.transaction(async (tx) => {
      await tx.insert(users).values({
        id:       data.userId,
        email:    data.email,
        password: data.hashedPassword,
        role:     "teacher",
      });

      const [teacher] = await tx.insert(teachers).values({
        id:            data.teacherId,
        userId:        data.userId,
        name:          data.name,
        address:       data.address,
        contact:       data.contact,
        email:         data.email,
        gender:        data.gender,
        dob:           data.dob.toISOString().split('T')[0],
        teachingSince: data.teachingSince !== undefined ? data.teachingSince : null,
        imageUrl:      data.imageUrl?? null,
      }).returning();

      return teacher;
    });
  },
};