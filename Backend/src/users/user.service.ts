import { eq, desc, sql, and } from "drizzle-orm";
import db from "../drizzle/db";
import { userTable, TUserInsert } from "../drizzle/schema";

// This object maps to the 'relations' defined in your schema
const userWithRelations = {
    checkins: true,
    riskScores: true,
    supportPartners: true, // This is the 'many' relation
    assignedPartner: true, // This is the 'one' relation we just added
    supportPartnerActions: true,
    messages: true,
} as const;

/**
 * getUserServices: Fetches users with relations.
 */
export const getUserServices = async (partnerId?: number): Promise<any[]> => {
    return await db.query.userTable.findMany({
        orderBy: [desc(userTable.userId)],
        where: partnerId 
            ? and(
                eq(userTable.partnerId, partnerId), 
                eq(userTable.userType, 'patient')
              )
            : undefined,
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
        .set({ 
            ...userData, 
            // Using sql`now()` ensures the DB timestamp is used
            updatedAt: new Date() 
        })
        .where(eq(userTable.userId, userId));
    return "User Updated Successfully 😎";
};

export const deleteUserServices = async (userId: number): Promise<string> => {
    await db.delete(userTable).where(eq(userTable.userId, userId));
    return "User Deleted Successfully";
};

/**
 * Smartly increments streak and updates the longest_streak record.
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
 * Resets the streak to 0.
 */
export const resetUserStreak = async (userId: number): Promise<string> => {
    await db.update(userTable)
        .set({ streak_days: 0, updatedAt: new Date() })
        .where(eq(userTable.userId, userId));
    return "Streak reset to 0";
};