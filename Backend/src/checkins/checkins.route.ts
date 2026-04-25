import { Router } from "express";
import { 
    getCheckinsController, 
    getCheckinsByIdController, 
    createCheckinsController, 
    deleteCheckinsController, 
    updateCheckinsController 
} from "./checkins.controller";
// Corrected import name to supportPartnerRoleAuth to match bearAuth.ts
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const CheckinsRouter = Router();

/**
 * GET /checkins
 * Access: Admin only (for system-wide overview)
 */
CheckinsRouter.get('/checkins', adminRoleAuth, getCheckinsController);

/**
 * GET /checkins/:id
 * Access: allRoleAuth (Patients viewing their history or Partners checking up on them)
 */
CheckinsRouter.get('/checkins/:id', allRoleAuth, getCheckinsByIdController);

/**
 * POST /checkins
 * Access: patientRoleAuth (Only patients should be creating their own check-ins)
 */
CheckinsRouter.post('/checkins', patientRoleAuth, createCheckinsController);

/**
 * PUT /checkins/:id
 * Access: Admin only (Prevents users from tampering with past recovery data)
 */
CheckinsRouter.put('/checkins/:id', adminRoleAuth, updateCheckinsController);

/**
 * DELETE /checkins/:id
 * Access: Admin only
 */
CheckinsRouter.delete('/checkins/:id', adminRoleAuth, deleteCheckinsController);