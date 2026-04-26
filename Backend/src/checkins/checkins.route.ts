import { Router } from "express";
import { 
    getCheckinsController, 
    getCheckinsByIdController, 
    createCheckinsController, 
    deleteCheckinsController, 
    updateCheckinsController,
    getCheckinStatsController // Import the new stats controller
} from "./checkins.controller";
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const CheckinsRouter = Router();

/**
 * GET /checkins/stats/:userId
 * Access: allRoleAuth (Patients see their stats, Partners check up on them)
 * This feeds the "Recovery Pulse" metrics on the frontend.
 */
CheckinsRouter.get('/checkins/stats/:userId', allRoleAuth, getCheckinStatsController);

/**
 * GET /checkins
 * Access: Admin only
 */
CheckinsRouter.get('/checkins', adminRoleAuth, getCheckinsController);

/**
 * GET /checkins/:id
 * Access: allRoleAuth
 */
CheckinsRouter.get('/checkins/:id', allRoleAuth, getCheckinsByIdController);

/**
 * POST /checkins
 * Access: patientRoleAuth
 * Triggers risk calculation and streak updates
 */
CheckinsRouter.post('/checkins', patientRoleAuth, createCheckinsController);

/**
 * PUT /checkins/:id
 * Access: Admin only
 */
CheckinsRouter.put('/checkins/:id', adminRoleAuth, updateCheckinsController);

/**
 * DELETE /checkins/:id
 * Access: Admin only
 */
CheckinsRouter.delete('/checkins/:id', adminRoleAuth, deleteCheckinsController);