import { Router } from "express";
import { 
    getMessagesController, 
    getMessagesByIdController, 
    createMessagesController, 
    deleteMessagesController, 
    updateMessagesController 
} from "./messages.controller";
// Corrected import name to supportPartnerRoleAuth to match bearAuth.ts
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const MessagesRouter = Router();

/**
 * GET /messages
 * Access: Admin only (for system-wide audit/monitoring)
 */
MessagesRouter.get('/messages', adminRoleAuth, getMessagesController);

/**
 * GET /messages/:id
 * Access: allRoleAuth (Users viewing their own conversation threads)
 */
MessagesRouter.get('/messages/:id', allRoleAuth, getMessagesByIdController);

/**
 * POST /messages
 * Access: allRoleAuth (Anyone authenticated can send a message)
 */
MessagesRouter.post('/messages', allRoleAuth, createMessagesController);

/**
 * PUT /messages/:id
 * Access: allRoleAuth (Usually used for 'marking as read' or editing)
 */
MessagesRouter.put('/messages/:id', allRoleAuth, updateMessagesController);

/**
 * DELETE /messages/:id
 * Access: Admin only
 */
MessagesRouter.delete('/messages/:id', adminRoleAuth, deleteMessagesController);