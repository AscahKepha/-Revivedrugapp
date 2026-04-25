import { eq, desc } from "drizzle-orm";
import { messagesTable, TMessageSelect, TMessageInsert } from "../drizzle/schema";
import db from "../drizzle/db";


export const getMessageServices = async (): Promise<TMessageSelect[] | null> => {
    return await db.query.messagesTable.findMany({
        orderBy: desc(messagesTable.messagesId),
    });
}

export const getMessageByIdService = async (id: number): Promise<TMessageSelect | undefined> => {
    return await db.query.messagesTable.findFirst({
        where: eq(messagesTable.messagesId, id)
    });
}

export const createMessageService = async (actionData: TMessageInsert): Promise<string> =>{
    await db.insert(messagesTable).values(actionData).returning();
    return "Support messages Action Created Successfully 😎";
}


export const updateMessageServices = async (actionid:number, actionData: Partial<TMessageSelect>): Promise<string> => {
    await db.update(messagesTable).set(actionData).where(eq(messagesTable.messagesId, actionid));
    return "Support messages Action Updated Successfully 😎"
}

export const deleteMessageServices = async (actionId: number): Promise<string> => {
    await db.delete(messagesTable).where(eq(messagesTable.messagesId, actionId));
    return "Support messages Action deleted Successfully";
}

