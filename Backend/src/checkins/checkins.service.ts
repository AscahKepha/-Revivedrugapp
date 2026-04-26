import { eq, desc, sql, and, gte } from "drizzle-orm";
import { 
    checkinTable, 
    TCheckinSelect, 
    TCheckinInsert, 
    riskScoreTable, 
    userTable // Imported to fetch live streak
} from "../drizzle/schema";
import db from "../drizzle/db";

interface RiskScoreData {
    userId: number;
    score: number;
    riskLevel: "low" | "medium" | "high";
}

/**
 * FETCH AGGREGATE STATS & NOTES
 * Retrieves counts, check-in status, live streak, and the two most recent journal entries.
 */
export const getCheckinStatsByUserIdService = async (userId: number) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. Get Total Count
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(checkinTable)
            .where(eq(checkinTable.userId, userId));

        // 2. Get Weekly Count
        const weeklyResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(checkinTable)
            .where(
                and(
                    eq(checkinTable.userId, userId),
                    gte(checkinTable.createdAt, sevenDaysAgo)
                )
            );

        // 3. Fetch the two most recent check-ins for journal display
        const recentEntries = await db
            .select()
            .from(checkinTable)
            .where(eq(checkinTable.userId, userId))
            .orderBy(desc(checkinTable.createdAt))
            .limit(2);

        // 4. Fetch the LIVE streak from the users table
        const userResult = await db
            .select({ streak: userTable.streak_days })
            .from(userTable)
            .where(eq(userTable.userId, userId))
            .limit(1);

        // 5. Calculate "Today Logged" status
        // Fix for TS(2769): Handle null/undefined createdAt safely
        const latestEntry = recentEntries[0];
        const firstEntryDate = latestEntry?.createdAt ? new Date(latestEntry.createdAt) : null;
        
        const isTodayLogged = firstEntryDate !== null && 
            firstEntryDate.toDateString() === now.toDateString();

        return {
            totalLogs: Number(totalResult[0]?.count) || 0,
            lastWeekCount: Number(weeklyResult[0]?.count) || 0,
            userStreak: userResult[0]?.streak || 0, // Injected live streak data
            isTodayLogged,
            todayNote: isTodayLogged ? recentEntries[0]?.notes : "",
            previousNote: isTodayLogged ? (recentEntries[1]?.notes || "") : (recentEntries[0]?.notes || ""),
        };
    } catch (error: any) {
        console.error("❌ [Service Error]:", error);
        throw new Error("Error fetching check-in stats: " + error.message);
    }
};

/**
 * RISK SCORE SERVICE
 * Saves calculated risk assessment metrics to the database.
 */
export const createRiskScoreService = async (data: RiskScoreData) => {
    try {
        const [newScore] = await db.insert(riskScoreTable)
            .values({
                userId: data.userId,
                score: data.score,
                riskLevel: data.riskLevel,
            })
            .returning();
        
        return newScore;
    } catch (error: any) {
        throw new Error("Error saving risk score: " + error.message);
    }
};

/**
 * STANDARD CRUD SERVICES
 */
export const getcheckinServices = async (): Promise<TCheckinSelect[] | null> => {
    return await db.query.checkinTable.findMany({
        orderBy: desc(checkinTable.checkinId),
    });
}

export const getcheckinByIdService = async (id: number): Promise<TCheckinSelect | undefined> => {
    return await db.query.checkinTable.findFirst({
        where: eq(checkinTable.checkinId, id)
    });
}

export const createcheckinService = async (actionData: TCheckinInsert): Promise<TCheckinSelect> => {
    const [newCheckin] = await db.insert(checkinTable).values(actionData).returning();
    return newCheckin;
}

export const updatecheckinServices = async (actionid: number, actionData: Partial<TCheckinSelect>): Promise<string> => {
    await db.update(checkinTable).set(actionData).where(eq(checkinTable.checkinId, actionid));
    return "Check-in Updated Successfully 😎"
}

export const deletecheckinServices = async (actionId: number): Promise<string> => {
    await db.delete(checkinTable).where(eq(checkinTable.checkinId, actionId));
    return "Check-in deleted Successfully";
}