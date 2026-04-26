import { Request, Response, NextFunction } from "express";
import {
    createSupportPartnerActionsService,
    getSupportPartnerActionsByIdService,
    getSupportPartnerActionsServices,
    updateSupportPartnerActionsServices,
    deleteSupportPartnerActionsServices
} from "./supportpartneractions.service";

/**
 * GET /partner-actions
 * Fixed: Now dynamically filters based on the logged-in user's role
 */
export const getActionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore - Assuming bearAuth attaches user info to req.user
        const { userId, role } = req.user;

        const allActions = await getSupportPartnerActionsServices();

        if (!allActions || allActions.length === 0) {
            return res.status(200).json([]); // Return empty array instead of 404 to avoid frontend crashes
        }

        // ROLE-BASED FILTERING:
        // If the user is a patient, only show actions where they are the recipient (userId)
        if (role === 'patient') {
            const patientActions = allActions.filter(action => action.userId === userId);
            return res.status(200).json(patientActions);
        }

        // If Admin or Support Partner, return all actions
        return res.status(200).json(allActions);
    } catch (error: any) {
        next(error);
    }
}

/**
 * GET /partner-actions/:id
 */
export const getActionsByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const actionId = parseInt(req.params.id as string);
    if (isNaN(actionId)) {
        return res.status(400).json({ error: "Invalid action Id" });
    }

    try {
        const action = await getSupportPartnerActionsByIdService(actionId);

        // Security Check: Ensure a patient isn't trying to peek at another patient's intervention
        // @ts-ignore
        const { userId, role } = req.user;
        if (role === 'patient' && action && action.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized access to this action" });
        }

        if (!action) {
            return res.status(404).json({ message: "Action not found or doesn't exist" });
        }
        return res.status(200).json(action);
    } catch (error: any) {
        next(error);
    }
}

/**
 * POST /partner-actions
 */
export const createActionsController = async (req: Request, res: Response, next: NextFunction) => {
    const { partnerId, userId, success, actionDescription } = req.body;

    if (!partnerId || !userId || success === undefined || !actionDescription) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newAction = await createSupportPartnerActionsService({
            partnerId, userId, success, actionDescription
        });

        return res.status(201).json({
            message: "Action logged successfully ✅",
            data: newAction
        });
    } catch (error: any) {
        next(error);
    }
}

/**
 * PUT /partner-actions/:id
 */
export const updateActionsController = async (req: Request, res: Response, next: NextFunction) => {
    const actionId = parseInt(req.params.id as string);
    const { partnerId, userId, success, actionDescription } = req.body;

    try {
        const updatedAction = await updateSupportPartnerActionsServices(actionId, {
            partnerId, userId, success, actionDescription
        });

        if (!updatedAction) {
            return res.status(404).json({ message: "Action not found or failed to update" });
        }

        return res.status(200).json({
            message: "Action updated successfully",
            data: updatedAction
        });
    } catch (error: any) {
        next(error);
    }
}

/**
 * DELETE /partner-actions/:id
 */
export const deleteActionsController = async (req: Request, res: Response, next: NextFunction) => {
    const actionId = parseInt(req.params.id as string);
    try {
        await deleteSupportPartnerActionsServices(actionId);
        return res.status(200).json({ message: "Action deleted successfully" });
    } catch (error: any) {
        next(error);
    }
}