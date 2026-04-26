import { Router } from "express";
import { 
    getActionsController, 
    getActionsByIdController, 
    createActionsController, 
    deleteActionsController, 
    updateActionsController 
} from "./partnerAction.controller";
import { 
    adminRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const ActionsRouter = Router();

/**
 * GET /actions
 * UPDATED: Changed from adminRoleAuth to allRoleAuth.
 * This allows Patients and Partners to see the "Intervention Score" page.
 */
ActionsRouter.get('/actions', allRoleAuth, getActionsController);

/**
 * GET /actions/:id
 * Access: allRoleAuth (Viewing a specific intervention detail)
 */
ActionsRouter.get('/actions/:id', allRoleAuth, getActionsByIdController);

/**
 * POST /actions
 * Access: supportPartnerRoleAuth (Only partners log interventions)
 */
ActionsRouter.post('/actions', supportPartnerRoleAuth, createActionsController);

/**
 * PUT /actions/:id
 * Access: supportPartnerRoleAuth (Partners can update their own notes)
 */
ActionsRouter.put('/actions/:id', supportPartnerRoleAuth, updateActionsController);

/**
 * DELETE /actions/:id
 * Access: adminRoleAuth (Only admins can hard-delete logs)
 */
ActionsRouter.delete('/actions/:id', adminRoleAuth, deleteActionsController);