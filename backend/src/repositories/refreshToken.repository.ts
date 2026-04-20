import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { refreshTokens } from "../db/schema";

type RefreshToken = typeof refreshTokens.$inferSelect;
type NewRefreshToken = typeof refreshTokens.$inferInsert;

export const refreshTokenRepository = {
    create:async(data: {
        userId: string;
        token: string;
        expiresAt: Date;
    }): Promise<RefreshToken> =>{
        const [refreshToken] = await db.insert(refreshTokens).values({
            id: crypto.randomUUID(),
            userId: data.userId,
            token: data.token,
            expiresAt: data.expiresAt,
        }).returning();
        return refreshToken;
    },

    findByToken: async(token: string): Promise<RefreshToken | undefined>=>{
        const [refreshToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
        return refreshToken;
    },

    deleteByToken: async(token: string):Promise<void> =>{
        await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    },

    deleteByUserId: async (userId: string): Promise<void>=>{
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    },
}