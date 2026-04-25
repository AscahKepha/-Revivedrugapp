import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { createMessageService, updateMessageServices, getMessageByIdService, getMessageServices, deleteMessageServices } from "./messages.service";
import { messagesTable } from "../drizzle/schema";
import db from "../drizzle/db";


export const getMessagesController = async (req: Request, res: Response) => {
    try {
        const allMessages = await getMessageServices();
        if (allMessages == null || allMessages.length == 0) {
            res.status(404).json({messages: "No messages found"});
        } else {
            res.status(200).json(allMessages);
        }
    } catch (error:any) {
        res.status(500).json({message: error.message || "error fetching messages"});
    }
}


export const getMessagesByIdController = async (req:Request, res:Response) => {
    const messageId = parseInt(req.params.id as string);
    if (isNaN(messageId)) {
        res.status(400).json({message: "Invalid message Id"});
        return;
    }
    try {
        const Messages = await getMessageByIdService(messageId)
        if (Messages == undefined ) {
            res.status(404).json({message: "Messages not found" });
        }else {
            res.status(200).json(Messages);
        }
    }catch (error: any){
        res.status(500).json({error: error.message || "error fetching Messages"});
    }
}

export const createMessagesController = async (req: Request, res: Response) => {
    // 1. Extract roomId and message from the body
    const { roomId, message } = req.body;
    
    // 2. Extract identity from the authenticated request (provided by your auth middleware)
    const userId = (req as any).user?.userId; 
    const sender = (req as any).user?.role;

    // Validation: We check the body fields AND the authenticated fields
    if (!roomId || !message || !userId || !sender) {
        res.status(400).json({ error: "Room ID and message text are required" });
        return;
    }

    try {
        const newMessages = await createMessageService({
            roomId,
            userId,
            message,
            sender
        });

        if (!newMessages) {
            res.status(500).json({ message: "Failed to create Messages" });
        } else {
            res.status(201).json(newMessages);
        }
    } catch (error: any) {  
       res.status(500).json({ error: error.message || "Failed to create Messages" });
    }
};

export const updateMessagesController = async(req:Request, res:Response) => {
    const messagesId = parseInt(req.params.id as string);
    if (isNaN(messagesId)) {
    res.status(400).json({ error: "Invalid message Id" });
    return;
}

const authUserId = (req as any).user?.userId; 
    const authRole = (req as any).user?.role;

const { message } = req.body; // Usually, you only allow updating the text
if (!message) {
    res.status(400).json({ error: "Message content is required for update" });
    return;
}

try {
    const existingMessage = await getMessageByIdService(messagesId);
    
    if (!existingMessage) {
        res.status(404).json({ message: "Message not found" });
        return;
    }

    // SECURITY CHECK: Is this the owner of the message OR an admin?
    if (existingMessage.userId !== authUserId && authRole !== 'admin') {
        res.status(403).json({ error: "You are not authorized to edit this message" });
        return;
    }

    const updatedMessage = await updateMessageServices(messagesId, { message });
    
    if (!updatedMessage) {
        res.status(404).json({ message: "Message not found or failed to update" });
    } else {
        res.status(200).json({ message: updatedMessage });
    }
} catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update Message" });
}
}


export const deleteMessagesController = async(req:Request, res:Response) => {
    const messagesId = parseInt(req.params.id as string);
    if (isNaN(messagesId)){ 
        res.status(400).json({message: "Invalid Message Id"});
        return;
    }
    try{
        const deletedMessages = await deleteMessageServices(messagesId);
        if (deletedMessages) {
            res.status(200).json({message: "Message deleted "});

        }else {
            res.status(404).json({message: "Message not found"});
        }
    }catch  (error:any){
        res.status(500).json({error:error.message || "failed to delete Message"});
    }
}