import { Router } from "express";
import { 
    getRiskScoreController, 
    getRiskScoreByIdController, 
    deleteRiskScoreController, 
    updateRiskScoreController 
} from "./score.controller";
//  Corrected import name to match CamelCase in bearAuth.ts
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const RiskScoreRouter = Router();

/**
 * GET /riskscore
 * Access: Admin only (for system-wide monitoring)
 */
RiskScoreRouter.get('/riskscore', adminRoleAuth, getRiskScoreController);

/**
 * GET /riskscore/:id
 * Access: allRoleAuth (Patients checking their own score, or Partners checking up on them)
 */
RiskScoreRouter.get('/riskscore/:id', allRoleAuth, getRiskScoreByIdController);

/**
 * PUT /riskscore/:id
 * Access: Admin only (Risk parameters are usually strictly system-defined)
 */
RiskScoreRouter.put('/riskscore/:id', adminRoleAuth, updateRiskScoreController);

/**
 * DELETE /riskscore/:id
 * Access: Admin only
 */
RiskScoreRouter.delete('/riskscore/:id', adminRoleAuth, deleteRiskScoreController);