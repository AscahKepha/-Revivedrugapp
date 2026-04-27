import { Router } from "express";
import { 
    getCheckinsController, 
    getCheckinsByIdController, 
    createCheckinsController, 
    deleteCheckinsController, 
    updateCheckinsController,
    getCheckinStatsController 
} from "./checkins.controller";
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    allRoleAuth,
    supportPartnerRoleAuth // Ensure this is imported or use allRoleAuth
} from "../middleware/bearAuth";

export const CheckinsRouter = Router();

/**
 * GET /checkins/stats/:userId
 * Access: allRoleAuth (Patients see their own, Partners check up on them)
 */
CheckinsRouter.get('/checkins/stats/:userId', allRoleAuth, getCheckinStatsController);

/**
 * GET /checkins
 * Access: Updated to allRoleAuth
 * Logic: 
 * - Admin sees ALL logs.
 * - Support Partner uses ?patientId=XX to see specific patient history.
 */
CheckinsRouter.get('/checkins', allRoleAuth, getCheckinsController);

/**
 * GET /checkins/:id
 * Access: allRoleAuth
 */
CheckinsRouter.get('/checkins/:id', allRoleAuth, getCheckinsByIdController);

/**
 * POST /checkins
 * Access: patientRoleAuth
 */
CheckinsRouter.post('/checkins', patientRoleAuth, createCheckinsController);

/**
 * PUT /checkins/:id
 * Access: adminRoleAuth (Only admins should edit clinical records)
 */
CheckinsRouter.put('/checkins/:id', adminRoleAuth, updateCheckinsController);

/**
 * DELETE /checkins/:id
 * Access: adminRoleAuth (Only admins can purge records)
 */
CheckinsRouter.delete('/checkins/:id', adminRoleAuth, deleteCheckinsController);