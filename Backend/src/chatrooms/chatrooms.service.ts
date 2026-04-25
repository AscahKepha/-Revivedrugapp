import { eq, desc } from "drizzle-orm";
import { chatRoomTable, TChatRoomSelect, TChatRoomInsert } from "../drizzle/schema";
import db from "../drizzle/db";


export const getChatRoomServices = async (): Promise<TChatRoomSelect[] | null> => {
    return await db.query.chatRoomTable.findMany({
        orderBy: desc(chatRoomTable.roomId),
    });
}

export const getChatRoomByIdService = async (id: number): Promise<TChatRoomSelect | undefined> => {
    return await db.query.chatRoomTable.findFirst({
        where: eq(chatRoomTable.roomId, id)
    });
}

export const createChatRoomService = async (actionData: TChatRoomInsert): Promise<string> =>{
    await db.insert(chatRoomTable).values(actionData).returning();
    return "Support chatRoom Action Created Successfully 😎";
}


export const updateChatRoomServices = async (actionid:number, actionData: Partial<TChatRoomSelect>): Promise<string> => {
    await db.update(chatRoomTable).set(actionData).where(eq(chatRoomTable.roomId, actionid));
    return "Support chatRoom Action Updated Successfully 😎"
}

export const deleteChatRoomServices = async (actionId: number): Promise<string> => {
    await db.delete(chatRoomTable).where(eq(chatRoomTable.roomId, actionId));
    return "Support chatRoom Action deleted Successfully";
}

