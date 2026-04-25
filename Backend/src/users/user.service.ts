import { eq, desc, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { userTable, TUserInsert, TUserSelect } from "../drizzle/schema";


export const getUserServices = async (): Promise<TUserSelect[] | null> => {
    return await db.query.userTable.findMany({
        orderBy: [desc(userTable.userId)],
    });
    }

export const getUserByIdService = async (userId: number): Promise<TUserSelect | undefined > => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.userId, userId),
    });
}

export const createUserService = async (userData: TUserInsert) : Promise<string> =>{
    await db.insert(userTable).values(userData).returning();
    return "User Created Successfully 😎"
}

export const updateUserService = async (userId: number, userData: Partial<TUserInsert>): Promise<string> => {
    await db.update(userTable).set(userData).where(eq(userTable.userId, userId));
    return "User Updated Successffully 😎"
}

export const deleteUserServices = async (userId: number): Promise<string> => {
    await db.delete(userTable).where(eq(userTable.userId, userId));
    return "User Delete Sucessfully";
}

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
