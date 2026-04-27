import { Request, Response, NextFunction } from "express";
import {
    createMessageService,
    updateMessageServices,
    getMessageByIdService,
    getMessageServices,
    deleteMessageServices
} from "./messages.service";

/**
 * GET /messages
 */
export const getMessagesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allMessages = await getMessageServices();
        if (!allMessages || allMessages.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }
        return res.status(200).json(allMessages);
    } catch (error: any) {
        next(error);
    }
}

/**
 * GET /messages/:id
 */
export const getMessagesByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const messageId = parseInt(req.params.id as string);
    if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid message Id" });
    }
    try {
        const message = await getMessageByIdService(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        return res.status(200).json(message);
    } catch (error: any) {
        next(error);
    }
}

/**
 * POST /messages
 */
export const createMessagesController = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, message } = req.body;

    // Extracted from auth middleware (bearAuth)
    const userId = (req as any).user?.userId;
    const sender = (req as any).user?.userType;

    if (!roomId || !message || !userId || !sender) {
        return res.status(400).json({ error: "Room ID and message text are required" });
    }

    try {
        const newMessage = await createMessageService({
            roomId,
            userId,
            message,
            sender
        });

        if (!newMessage) {
            return res.status(500).json({ message: "Failed to create message" });
        }
        return res.status(201).json(newMessage);
    } catch (error: any) {
        next(error);
    }
};

/**
 * PUT /messages/:id
 */
export const updateMessagesController = async (req: Request, res: Response, next: NextFunction) => {
    const messageId = parseInt(req.params.id as string);
    if (isNaN(messageId)) {
        return res.status(400).json({ error: "Invalid message Id" });
    }

    const authUserId = (req as any).user?.userId;
    const authRole = (req as any).user?.userType;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message content is required for update" });
    }

    try {
        const existingMessage = await getMessageByIdService(messageId);

        if (!existingMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Security: Only the creator or an Admin can edit
        if (existingMessage.userId !== authUserId && authRole !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to edit this message" });
        }

        const updatedMessage = await updateMessageServices(messageId, { message });

        if (!updatedMessage) {
            return res.status(404).json({ message: "Failed to update message" });
        }
        return res.status(200).json({ message: updatedMessage });
    } catch (error: any) {
        next(error);
    }
}

/**
 * DELETE /messages/:id
 */
export const deleteMessagesController = async (req: Request, res: Response, next: NextFunction) => {
    const messageId = parseInt(req.params.id as string);
    if (isNaN(messageId)) {
        return res.status(400).json({ message: "Invalid Message Id" });
    }

    const authUserId = (req as any).user?.userId;
    const authRole = (req as any).user?.userType;

    try {
        const existingMessage = await getMessageByIdService(messageId);
        if (!existingMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Security: Only the creator or an Admin can delete
        if (existingMessage.userId !== authUserId && authRole !== 'admin') {
            return res.status(403).json({ error: "You are not authorized to delete this message" });
        }

        const deletedMessage = await deleteMessageServices(messageId);
        if (deletedMessage) {
            return res.status(200).json({ message: "Message deleted successfully" });
        } else {
            return res.status(404).json({ message: "Message not found" });
        }
    } catch (error: any) {
        next(error);
    }
}