import { eq, desc } from "drizzle-orm";
import { supportPartnersActionsTable, TSupportPartnerActionsInsert, TSupportPartnerActionsSelect } from "../drizzle/schema";
import db from "../drizzle/db";


export const getSupportPartnerActionsServices = async (): Promise<TSupportPartnerActionsSelect[] | null> => {
    return await db.query.supportPartnersActionsTable.findMany({
        orderBy: desc(supportPartnersActionsTable.actionId),
    });
}

export const getSupportPartnerActionsByIdService = async (id: number): Promise<TSupportPartnerActionsSelect | undefined> => {
    return await db.query.supportPartnersActionsTable.findFirst({
        where: eq(supportPartnersActionsTable.actionId, id)
    });
}

export const createSupportPartnerActionsService = async (actionData: TSupportPartnerActionsInsert): Promise<string> =>{
    await db.insert(supportPartnersActionsTable).values(actionData).returning();
    return "Support Partner Action Created Successfully 😎";
}


export const updateSupportPartnerActionsServices = async (actionid:number, actionData: Partial<TSupportPartnerActionsSelect>): Promise<string> => {
    await db.update(supportPartnersActionsTable).set(actionData).where(eq(supportPartnersActionsTable.actionId, actionid));
    return "Support Partner Action Updated Successfully 😎"
}

export const deleteSupportPartnerActionsServices = async (actionId: number): Promise<string> => {
    await db.delete(supportPartnersActionsTable).where(eq(supportPartnersActionsTable.actionId, actionId));
    return "Support Partner Action deleted Successfully";
}

