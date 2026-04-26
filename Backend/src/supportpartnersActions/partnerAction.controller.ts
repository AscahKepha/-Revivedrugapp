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
 * Fetch all logged actions (Admin utility)
 */
export const getActionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allActions = await getSupportPartnerActionsServices();
        if (!allActions || allActions.length === 0) {
            return res.status(404).json({ error: "No actions found" });
        }
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
 * Log a new action taken by a Support Partner
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

        if (!newAction) {
            return res.status(500).json({ error: "Failed to log action" });
        }

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
    if (isNaN(actionId)) {
        return res.status(400).json({ error: "Invalid action Id" });
    }

    const { partnerId, userId, success, actionDescription } = req.body;
    if (!partnerId || !userId || success === undefined || !actionDescription) {
        return res.status(400).json({ error: "All fields required" });
    }

    try {
        const existingAction = await getSupportPartnerActionsByIdService(actionId);
        if (!existingAction) {
            return res.status(404).json({ message: "Action not found" });
        }

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
    if (isNaN(actionId)) {
        return res.status(400).json({ error: "Invalid action Id" });
    }

    try {
        const existingAction = await getSupportPartnerActionsByIdService(actionId);
        if (!existingAction) {
            return res.status(404).json({ message: "Action not found" });
        }

        await deleteSupportPartnerActionsServices(actionId);
        return res.status(200).json({ message: "Action deleted successfully" });
    } catch (error: any) {
        next(error);
    }
}