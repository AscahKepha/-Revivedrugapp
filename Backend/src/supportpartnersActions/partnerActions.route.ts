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
 * Route Management for Support Partner Interventions
 * Note: These paths assume the router is mounted at '/api' or '/api/actions' in app.ts
 */

// URL: GET /api/actions
// UPDATED: allRoleAuth so Patients can see their "Recovery Pulse" and Partners can see history.
ActionsRouter.get('/', allRoleAuth, getActionsController);

// URL: GET /api/actions/:id
ActionsRouter.get('/:id', allRoleAuth, getActionsByIdController);

// URL: POST /api/actions
// Access: supportPartnerRoleAuth (Only partners log interventions)
ActionsRouter.post('/', supportPartnerRoleAuth, createActionsController);

// URL: PUT /api/actions/:id
// Access: supportPartnerRoleAuth (Partners can update their specific intervention notes)
ActionsRouter.put('/:id', supportPartnerRoleAuth, updateActionsController);

// URL: DELETE /api/actions/:id
// Access: adminRoleAuth (Hard-deleting clinical logs is an Admin-only privilege)
ActionsRouter.delete('/:id', adminRoleAuth, deleteActionsController);