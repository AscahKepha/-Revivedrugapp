import { Router } from "express";
import { 
    getSupportPartnerController, 
    getSupportPartnerByIdController, 
    createSupportPartnerController, 
    deleteSupportPartnerController, 
    updateSupportPartnerController 
} from "./supportpartner.controller";
//  Import name corrected to supportPartnerRoleAuth to match bearAuth.ts
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const SupportPartnerRouter = Router();

/**
 * GET /supportpartner
 * Access: Admin only (to list all partners)
 */
SupportPartnerRouter.get('/supportpartner', adminRoleAuth, getSupportPartnerController);

/**
 * GET /supportpartner/:id
 * Access: All roles (useful for patients to view their specific partner)
 */
SupportPartnerRouter.get('/supportpartner/:id', allRoleAuth, getSupportPartnerByIdController);

/**
 * POST /supportpartner
 * Access: Patient (allowing a patient to link/assign a support partner)
 */
SupportPartnerRouter.post('/supportpartner', patientRoleAuth, createSupportPartnerController);

/**
 * PUT /supportpartner/:id
 * Access: Patient (allowing a patient to update their partner's details)
 */
SupportPartnerRouter.put('/supportpartner/:id', patientRoleAuth, updateSupportPartnerController);

/**
 * DELETE /supportpartner/:id
 * Access: Admin only
 */
SupportPartnerRouter.delete('/supportpartner/:id', adminRoleAuth, deleteSupportPartnerController);