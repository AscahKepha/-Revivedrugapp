import { eq, desc } from "drizzle-orm";
import { 
    supportPartnersActionsTable, 
    userTable, 
    supportpartnersTable,
    TSupportPartnerActionsInsert, 
    TSupportPartnerActionsSelect 
} from "../drizzle/schema";
import db from "../drizzle/db";

/**
 * FETCH ALL ACTIONS
 * Uses an explicit JOIN to flatten 'userName' and 'partnerName' into the object.
 * This ensures the frontend ActionCenter can read 'action.userName' directly.
 */
export const getSupportPartnerActionsServices = async (): Promise<any[]> => {
    return await db
        .select({
            actionId: supportPartnersActionsTable.actionId,
            partnerId: supportPartnersActionsTable.partnerId,
            userId: supportPartnersActionsTable.userId,
            success: supportPartnersActionsTable.success,
            actionDescription: supportPartnersActionsTable.actionDescription,
            createdAt: supportPartnersActionsTable.createdAt,
            // Flattening the names into the top-level object
            userName: userTable.userName,
            partnerName: supportpartnersTable.partnerName
        })
        .from(supportPartnersActionsTable)
        .leftJoin(userTable, eq(supportPartnersActionsTable.userId, userTable.userId))
        .leftJoin(supportpartnersTable, eq(supportPartnersActionsTable.partnerId, supportpartnersTable.partnerId))
        .orderBy(desc(supportPartnersActionsTable.actionId));
}

/**
 * FETCH ACTIONS BY ID
 */
export const getSupportPartnerActionsByIdService = async (id: number): Promise<any | undefined> => {
    const result = await db
        .select({
            actionId: supportPartnersActionsTable.actionId,
            partnerId: supportPartnersActionsTable.partnerId,
            userId: supportPartnersActionsTable.userId,
            success: supportPartnersActionsTable.success,
            actionDescription: supportPartnersActionsTable.actionDescription,
            createdAt: supportPartnersActionsTable.createdAt,
            userName: userTable.userName,
            partnerName: supportpartnersTable.partnerName
        })
        .from(supportPartnersActionsTable)
        .leftJoin(userTable, eq(supportPartnersActionsTable.userId, userTable.userId))
        .leftJoin(supportpartnersTable, eq(supportPartnersActionsTable.partnerId, supportpartnersTable.partnerId))
        .where(eq(supportPartnersActionsTable.actionId, id))
        .limit(1);

    return result[0];
}

/**
 * CREATE ACTION
 */
export const createSupportPartnerActionsService = async (actionData: TSupportPartnerActionsInsert): Promise<TSupportPartnerActionsSelect> => {
    try {
        const [newAction] = await db.insert(supportPartnersActionsTable)
            .values({
                partnerId: actionData.partnerId,
                userId: actionData.userId,
                success: actionData.success,
                actionDescription: actionData.actionDescription,
            })
            .returning();
            
        if (!newAction) {
            throw new Error("Failed to insert action: Database returned empty.");
        }

        return newAction;
    } catch (error: any) {
        console.error("❌ [DB Service Error]:", error.message);
        throw error; 
    }
}

/**
 * UPDATE ACTION
 */
export const updateSupportPartnerActionsServices = async (actionid: number, actionData: Partial<TSupportPartnerActionsSelect>): Promise<string> => {
    await db.update(supportPartnersActionsTable)
        .set(actionData)
        .where(eq(supportPartnersActionsTable.actionId, actionid));
    return "Support Partner Action Updated Successfully 😎";
}

/**
 * DELETE ACTION
 */
export const deleteSupportPartnerActionsServices = async (actionId: number): Promise<string> => {
    await db.delete(supportPartnersActionsTable)
        .where(eq(supportPartnersActionsTable.actionId, actionId));
    return "Support Partner Action deleted Successfully";
}