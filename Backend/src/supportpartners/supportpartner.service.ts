import { eq, desc } from "drizzle-orm";
import { supportpartnersTable, TPartnerSelect, TPartnerInsert } from "../drizzle/schema";
import db from "../drizzle/db";


export const getSupportPartnerServices = async (): Promise<TPartnerSelect[] | null> => {
    return await db.query.supportpartnersTable.findMany({
        orderBy: desc(supportpartnersTable.partnerId),
    });
}

export const getSupportPartnerByIdService = async (id: number): Promise<TPartnerSelect | undefined> => {
    return await db.query.supportpartnersTable.findFirst({
        where: eq(supportpartnersTable.partnerId, id)
    });
}

export const createSupportPartnerService = async (actionData: TPartnerInsert): Promise<string> =>{
    await db.insert(supportpartnersTable).values(actionData).returning();
    return "Support Partner Action Created Successfully 😎";
}


export const updateSupportPartnerServices = async (actionid:number, actionData: Partial<TPartnerSelect>): Promise<string> => {
    await db.update(supportpartnersTable).set(actionData).where(eq(supportpartnersTable.partnerId, actionid));
    return "Support Partner Action Updated Successfully 😎"
}

export const deleteSupportPartnerServices = async (actionId: number): Promise<string> => {
    await db.delete(supportpartnersTable).where(eq(supportpartnersTable.partnerId, actionId));
    return "Support Partner Action deleted Successfully";
}

