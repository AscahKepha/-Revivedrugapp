import { Request, Response, NextFunction } from "express";
import { 
    createChatRoomService, 
    updateChatRoomServices, 
    getChatRoomByIdService, 
    getChatRoomServices, 
    deleteChatRoomServices 
} from "./chatrooms.service";

export const getChatRoomsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allChatRooms = await getChatRoomServices();
        if (!allChatRooms || allChatRooms.length === 0) {
            res.status(404).json({ message: "No ChatRooms found" });
        } else {
            res.status(200).json(allChatRooms);
        }
    } catch (error: any) {
        next(error);
    }
}

export const getChatRoomsByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const chatRoomId = parseInt(req.params.id as string);
    
    if (isNaN(chatRoomId)) {
        res.status(400).json({ message: "Invalid ChatRoom Id" });
        return;
    }
    
    try {
        const ChatRoom = await getChatRoomByIdService(chatRoomId);
        if (!ChatRoom) {
            res.status(404).json({ message: "ChatRoom not found" });
        } else {
            res.status(200).json(ChatRoom);
        }
    } catch (error: any) {
        next(error);
    }
}

export const createChatRoomsController = async (req: Request, res: Response, next: NextFunction) => {
    const { isPersistent, description } = req.body;
    
    if (isPersistent === undefined || !description) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    
    try {
        const newChatRoom = await createChatRoomService({ isPersistent, description });

        if (!newChatRoom) {
            res.status(500).json({ error: "Failed to create ChatRoom" });
        } else {
            res.status(201).json(newChatRoom);
        }
    } catch (error: any) {
        next(error);
    }
};

export const updateChatRoomsController = async (req: Request, res: Response, next: NextFunction) => {
    const chatRoomId = parseInt(req.params.id as string);
    
    if (isNaN(chatRoomId)) {
        res.status(400).json({ error: "Invalid ChatRoom Id" });
        return;
    }
    
    const { isPersistent, description } = req.body;
    if (isPersistent === undefined || !description) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    try {
        const existingChatRoom = await getChatRoomByIdService(chatRoomId);
        if (!existingChatRoom) {
            res.status(404).json({ message: "ChatRoom not found" });
            return;
        }

        const updatedChatRoom = await updateChatRoomServices(chatRoomId, { isPersistent, description });
        
        if (!updatedChatRoom) {
            res.status(404).json({ message: "ChatRoom not found or failed to update" });
        } else {
            res.status(200).json({ message: "ChatRoom updated", data: updatedChatRoom });
        }
    } catch (error: any) {
        next(error);
    }
}

export const deleteChatRoomsController = async (req: Request, res: Response, next: NextFunction) => {
    const chatRoomId = parseInt(req.params.id as string);
    
    if (isNaN(chatRoomId)) {
        res.status(400).json({ error: "Invalid ChatRoom Id" });
        return;
    }
    
    try {
        const deletedChatRoom = await deleteChatRoomServices(chatRoomId);
        if (deletedChatRoom) {
            res.status(200).json({ message: "ChatRoom deleted successfully" });
        } else {
            res.status(404).json({ message: "ChatRoom not found" });
        }
    } catch (error: any) {
        next(error);
    }
}