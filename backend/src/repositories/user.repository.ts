import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

type User = typeof users.$inferSelect;

export const userRepository = {
    findByEmail: async (email: string): Promise<User | undefined> =>{
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    },

    findById: async (id: string) =>{
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    },

    create: async (data: {
        id: string;
        email: string;
        password: string;
        role: "admin" | "teacher";
    })=>{
        const[user] = await db.insert(users).values(data).returning();
        return user;
    },
}