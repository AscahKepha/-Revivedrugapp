import { Router } from "express";
import { 
    getActionsController, 
    getActionsByIdController, 
    createActionsController, 
    deleteActionsController, 
    updateActionsController 
} from "./partnerAction.controller";
//  Corrected the import name from support_partner to supportPartnerRoleAuth
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const ActionsRouter = Router();

// Get all actions (Admin only)
ActionsRouter.get('/actions', adminRoleAuth, getActionsController);

// Get specific action (Accessible to everyone authorized)
ActionsRouter.get('/actions/:id', allRoleAuth, getActionsByIdController);

//  Create action (Corrected middleware name)
ActionsRouter.post('/actions', supportPartnerRoleAuth, createActionsController);

//  Update action (Corrected middleware name)
ActionsRouter.put('/actions/:id', supportPartnerRoleAuth, updateActionsController);

// Delete action (Admin only)
ActionsRouter.delete('/actions/:id', adminRoleAuth, deleteActionsController);