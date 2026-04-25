import { Router } from "express";
import { 
    getChatRoomsController, 
    getChatRoomsByIdController, 
    createChatRoomsController, 
    deleteChatRoomsController, 
    updateChatRoomsController 
} from "./chatroom.controller";
// Standardized import name to supportPartnerRoleAuth to match bearAuth.ts
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const ChatRoomsRouter = Router();

/**
 * GET /chatroom
 * Access: Admin only (to manage and oversee all active rooms)
 */
ChatRoomsRouter.get('/chatroom', adminRoleAuth, getChatRoomsController);

/**
 * GET /chatroom/:id
 * Access: allRoleAuth (Patients and Partners accessing their specific recovery room)
 */
ChatRoomsRouter.get('/chatroom/:id', allRoleAuth, getChatRoomsByIdController);

/**
 * POST /chatroom
 * Access: Admin only (Admins typically initialize rooms for recovery pairs)
 */
ChatRoomsRouter.post('/chatroom', adminRoleAuth, createChatRoomsController);

/**
 * PUT /chatroom/:id
 * Access: Admin only (For room metadata changes)
 */
ChatRoomsRouter.put('/chatroom/:id', adminRoleAuth, updateChatRoomsController);

/**
 * DELETE /chatroom/:id
 * Access: Admin only
 */
ChatRoomsRouter.delete('/chatroom/:id', adminRoleAuth, deleteChatRoomsController);