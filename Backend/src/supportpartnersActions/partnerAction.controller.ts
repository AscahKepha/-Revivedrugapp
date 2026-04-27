import { Request, Response, NextFunction } from "express";
import {
    createSupportPartnerActionsService,
    getSupportPartnerActionsByIdService,
    getSupportPartnerActionsServices,
    updateSupportPartnerActionsServices,
    deleteSupportPartnerActionsServices
} from "./supportpartneractions.service";

/**
 * GET /api/actions
 * Provides filtered intervention history with real names for the UI.
 */
export const getActionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        if (!user) {
            console.error("❌ [GetActions]: Unauthorized - No user context");
            return res.status(401).json({ error: "Unauthorized: User context missing" });
        }

        const requesterId = Number(user.userId);
        const requesterRole = user.userType;

        // 1. Fetch from Service (Now using explicit join)
        const allActions = await getSupportPartnerActionsServices();

        console.log("🔍 [GetActions DEBUG]: Raw data from service (first record):", allActions?.[0]);

        if (!allActions || allActions.length === 0) {
            console.log("ℹ️ [GetActions]: No records found in database.");
            return res.status(200).json([]); 
        }

        // 2. Role-Based Filtering
        let filteredActions;
        if (requesterRole === 'patient') {
            filteredActions = allActions.filter(action => Number(action.userId) === requesterId);
        } else if (requesterRole === 'support_partner') {
            filteredActions = allActions.filter(action => Number(action.partnerId) === requesterId);
        } else {
            filteredActions = allActions; // Admin sees all
        }

        // 3. UI Synchronization Fix
        // This ensures the frontend always finds 'userName' even if the join varies
        const responseData = filteredActions.map((action: any) => {
            const finalName = action.userName || action.user?.userName || `Patient #${action.userId}`;
            return {
                ...action,
                userName: finalName
            };
        });

        console.log(`📊 [GetActions]: Sending ${responseData.length} records to ${requesterRole}. Sample Name: ${responseData[0]?.userName}`);
        
        return res.status(200).json(responseData);

    } catch (error: any) {
        console.error(" [GetActions Controller Error]:", error.message);
        res.status(400).json({ error: "Failed to fetch intervention history" });
    }
}

/**
 * GET /api/actions/:id
 */
export const getActionsByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const actionId = parseInt(req.params.id as string);
    const user = (req as any).user;

    console.log(`🔍 [GetActionsById]: Fetching ID ${actionId}`);

    if (isNaN(actionId)) {
        return res.status(400).json({ error: "Invalid action Id format" });
    }

    try {
        const action = await getSupportPartnerActionsByIdService(actionId);

        if (!action) {
            console.warn(`⚠️ [GetActionsById]: Record ${actionId} not found`);
            return res.status(404).json({ message: "Action record not found" });
        }

        // Security Check
        if (user?.userType === 'patient' && Number(action.userId) !== Number(user.userId)) {
            console.error(`🚫 [Security]: Patient ${user.userId} tried to access record belonging to User ${action.userId}`);
            return res.status(403).json({ error: "Unauthorized access" });
        }

        return res.status(200).json(action);
    } catch (error: any) {
        console.error("❌ [GetActionsById Error]:", error.message);
        next(error);
    }
}

/**
 * POST /api/actions
 */
export const createActionsController = async (req: Request, res: Response, next: NextFunction) => {
    const { partnerId, userId, success, actionDescription } = req.body;

    console.log("📥 [CreateAction]: Received payload:", req.body);

    if (!partnerId || !userId || success === undefined || !actionDescription) {
        console.warn("⚠️ [CreateAction]: Validation failed - Missing fields");
        return res.status(400).json({ error: "Required fields missing" });
    }

    try {
        const newAction = await createSupportPartnerActionsService({
            partnerId: Number(partnerId),
            userId: Number(userId),
            success: Boolean(success),
            actionDescription: actionDescription.trim()
        });

        console.log(`✅ [CreateAction]: Successfully logged intervention for User ${userId}`);
        return res.status(201).json({
            message: "Action logged successfully ✅",
            data: newAction
        });
    } catch (error: any) {
        console.error("❌ [CreateAction Error]:", error.message);
        if (error.message.includes('foreign key')) {
            return res.status(400).json({ error: "Relation Error: Patient or Partner ID does not exist." });
        }
        next(error);
    }
}

/**
 * PUT /api/actions/:id
 */
export const updateActionsController = async (req: Request, res: Response, next: NextFunction) => {
    const actionId = parseInt(req.params.id as string);
    console.log(`🔄 [UpdateAction]: Updating record ${actionId}`);

    if (isNaN(actionId)) return res.status(400).json({ error: "Invalid ID" });

    try {
        const message = await updateSupportPartnerActionsServices(actionId, req.body);
        console.log(`✅ [UpdateAction]: Success for ID ${actionId}`);
        return res.status(200).json({ message, actionId });
    } catch (error: any) {
        console.error("❌ [UpdateAction Error]:", error.message);
        next(error);
    }
}

/**
 * DELETE /api/actions/:id
 */
export const deleteActionsController = async (req: Request, res: Response, next: NextFunction) => {
    const actionId = parseInt(req.params.id as string);
    console.log(`🗑️ [DeleteAction]: Deleting record ${actionId}`);

    try {
        const message = await deleteSupportPartnerActionsServices(actionId);
        console.log(`✅ [DeleteAction]: Success for ID ${actionId}`);
        return res.status(200).json({ message });
    } catch (error: any) {
        console.error("❌ [DeleteAction Error]:", error.message);
        next(error);
    }
}