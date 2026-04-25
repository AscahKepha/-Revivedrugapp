import { eq, desc } from "drizzle-orm";
import { checkinTable, TCheckinSelect, TCheckinInsert, riskScoreTable } from "../drizzle/schema";
import db from "../drizzle/db";

interface RiskScoreData {
    userId: number;
    score: number;
    riskLevel: "low" | "medium" | "high";
}

export const createRiskScoreService = async (data: RiskScoreData) => {
    try {
        const [newScore] = await db.insert(riskScoreTable)
            .values({
                userId: data.userId,
                score: data.score,
                riskLevel: data.riskLevel,
                createdAt: new Date() // Drizzle handles defaultNow, but explicit is fine too
            })
            .returning();
        
        return newScore;
    } catch (error: any) {
        throw new Error("Error saving risk score: " + error.message);
    }
};

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

export const createcheckinService = async (actionData: TCheckinInsert): Promise<string> =>{
    await db.insert(checkinTable).values(actionData).returning();
    return "Support checkin Action Created Successfully 😎";
}


export const updatecheckinServices = async (actionid:number, actionData: Partial<TCheckinSelect>): Promise<string> => {
    await db.update(checkinTable).set(actionData).where(eq(checkinTable.checkinId, actionid));
    return "Support checkin Action Updated Successfully 😎"
}

export const deletecheckinServices = async (actionId: number): Promise<string> => {
    await db.delete(checkinTable).where(eq(checkinTable.checkinId, actionId));
    return "Support checkin Action deleted Successfully";
}

