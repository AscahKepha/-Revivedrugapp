import { eq, desc, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { userTable, TUserInsert } from "../drizzle/schema";

// ✅ Using 'as const' solves the ts(2322) error by telling TS these are literal keys
const userWithRelations = {
    checkins: true,
    riskScores: true,
    supportPartners: true,
    supportPartnerActions: true,
    messages: true,
} as const;

// ✅ We use 'any' or a custom interface because the default TUserSelect 
// does not include the nested arrays returned by the 'with' query.
export const getUserServices = async (): Promise<any[]> => {
    return await db.query.userTable.findMany({
        orderBy: [desc(userTable.userId)],
        with: userWithRelations,
    });
};

export const getUserByIdService = async (userId: number): Promise<any | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.userId, userId),
        with: userWithRelations,
    });
};

export const createUserService = async (userData: TUserInsert): Promise<string> => {
    await db.insert(userTable).values(userData).returning();
    return "User Created Successfully 😎";
};

export const updateUserService = async (userId: number, userData: Partial<TUserInsert>): Promise<string> => {
    await db.update(userTable)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(userTable.userId, userId));
    return "User Updated Successfully 😎";
};

export const deleteUserServices = async (userId: number): Promise<string> => {
    await db.delete(userTable).where(eq(userTable.userId, userId));
    return "User Deleted Successfully";
};

/**
 * Smartly increments streak and updates the longest_streak record
 * if the current streak exceeds it.
 */
export const incrementUserStreakSmart = async (userId: number) => {
    return await db.update(userTable)
        .set({
            streak_days: sql`${userTable.streak_days} + 1`,
            longest_streak: sql`CASE 
                WHEN ${userTable.streak_days} + 1 > ${userTable.longest_streak} 
                THEN ${userTable.streak_days} + 1 
                ELSE ${userTable.longest_streak} 
            END`,
            updatedAt: new Date()
        })
        .where(eq(userTable.userId, userId))
        .returning();
};

/**
 * Resets the streak to 0 (useful for missed check-ins)
 */
export const resetUserStreak = async (userId: number): Promise<string> => {
    await db.update(userTable)
        .set({ streak_days: 0, updatedAt: new Date() })
        .where(eq(userTable.userId, userId));
    return "Streak reset to 0";
};