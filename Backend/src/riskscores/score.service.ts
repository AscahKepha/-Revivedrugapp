import { eq, desc } from "drizzle-orm";
import { riskScoreTable, TRiskScoreSelect, TRiskScoreInsert } from "../drizzle/schema";
import db from "../drizzle/db";


export const getRiskScoreServices = async (): Promise<TRiskScoreSelect[] | null> => {
    return await db.query.riskScoreTable.findMany({
        orderBy: desc(riskScoreTable.scoreId),
    });
}

export const getRiskScoreByIdService = async (id: number): Promise<TRiskScoreSelect | undefined> => {
    return await db.query.riskScoreTable.findFirst({
        where: eq(riskScoreTable.scoreId, id)
    });
}

export const createRiskScoreService = async (actionData: TRiskScoreInsert): Promise<TRiskScoreSelect> =>{
    const [newRecord] = await db.insert(riskScoreTable).values(actionData).returning();
    return newRecord; // Return the object instead of a string
}


export const updateRiskScoreServices = async (actionid:number, actionData: Partial<TRiskScoreSelect>): Promise<string> => {
    await db.update(riskScoreTable).set(actionData).where(eq(riskScoreTable.scoreId, actionid));
    return "Support RiskScore Action Updated Successfully 😎"
}

export const deleteRiskScoreServices = async (actionId: number): Promise<string> => {
    await db.delete(riskScoreTable).where(eq(riskScoreTable.scoreId, actionId));
    return "Support RiskScore Action deleted Successfully";
}

export const getRiskScoresByUserService = async (userId: number): Promise<TRiskScoreSelect[] | null> => {
    return await db.query.riskScoreTable.findMany({
        where: eq(riskScoreTable.userId, userId),
        orderBy: desc(riskScoreTable.createdAt), // Or use scoreId to match your getRiskScoreServices
    });
}
