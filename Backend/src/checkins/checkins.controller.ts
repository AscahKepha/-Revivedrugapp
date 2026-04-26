import { Request, Response, NextFunction } from "express";
import { 
    createRiskScoreService, 
    createcheckinService, 
    updatecheckinServices, 
    getcheckinByIdService, 
    getcheckinServices, 
    deletecheckinServices 
} from "./checkins.service";
import { incrementUserStreakSmart } from "../users/user.service";

/**
 * Helper to calculate Risk Metrics based on check-in data
 */
const calculateRiskMetrics = (cravings: number, control: number, selfEfficacy: number, consequences: boolean) => {
    // Scoring logic: higher cravings = higher risk, lower control/efficacy = higher risk
    const score = cravings + (10 - control) + (10 - selfEfficacy) + (consequences ? 5 : 0);
    
    let riskLevel: "low" | "medium" | "high" = "low";
    if (score >= 18) riskLevel = "high";
    else if (score >= 10) riskLevel = "medium";
    
    return { score, riskLevel };
};

/**
 * GET /checkins
 */
export const getCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allcheckins = await getcheckinServices();
        if (!allcheckins || allcheckins.length === 0) {
            return res.status(404).json({ message: "No checkins found" });
        }
        return res.status(200).json(allcheckins);
    } catch (error: any) {
        next(error);
    }
}

/**
 * GET /checkins/:id
 */
export const getCheckinsByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const checkinId = parseInt(req.params.id as string);
    if (isNaN(checkinId)) {
        return res.status(400).json({ message: "Invalid checkin Id" });
    }
    try {
        const checkin = await getcheckinByIdService(checkinId);
        if (!checkin) {
            return res.status(404).json({ message: "Check-in not found" });
        }
        return res.status(200).json(checkin);
    } catch (error: any) {
        next(error);
    }
}

/**
 * POST /checkins
 * Core behavioral check-in logic including risk calculation and streak update
 */
export const createCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, cravings, control, selfEfficacy, consequences, copingUsed, notes } = req.body;

    // 1. Validation
    if (!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined || !notes) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // 2. Save the Check-in
        const newCheckin = await createcheckinService({
            userId, cravings, control, selfEfficacy, consequences, copingUsed, notes
        });

        if (!newCheckin) {
            return res.status(500).json({ error: "Failed to create checkin record" });
        }

        // 3. Calculate Risk and Save to riskScoreTable
        const { score, riskLevel } = calculateRiskMetrics(cravings, control, selfEfficacy, consequences);
        
        await createRiskScoreService({
            userId,
            score,
            riskLevel
        });

        // 4. Update the User Streak
        await incrementUserStreakSmart(userId);

        // 5. Send consolidated response
        return res.status(201).json({
            message: "Check-in successful! 🔥",
            streakMessage: "Your streak has been updated.",
            riskStatus: `Current risk level is ${riskLevel}`,
            data: newCheckin,
            metrics: { score, riskLevel }
        });

    } catch (error: any) {
        next(error);
    }
};

/**
 * PUT /checkins/:id
 */
export const updateCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const checkinsId = parseInt(req.params.id as string);
    if (isNaN(checkinsId)) {
        return res.status(400).json({ error: "Invalid checkin Id" });
    }
    
    const { userId, cravings, control, selfEfficacy, consequences, copingUsed, notes } = req.body;
    if (!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined || !notes) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingcheckins = await getcheckinByIdService(checkinsId);
        if (!existingcheckins) {
            return res.status(404).json({ message: "Check-in not found" });
        }

        const updatedcheckin = await updatecheckinServices(checkinsId, {
            userId, cravings, control, selfEfficacy, consequences, copingUsed, notes
        });

        if (!updatedcheckin) {
            return res.status(404).json({ message: "Check-in not found or failed to update" });
        }
        return res.status(200).json({ checkin: updatedcheckin });
    } catch (error: any) {
        next(error);
    }
}

/**
 * DELETE /checkins/:id
 */
export const deleteCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const checkinsId = parseInt(req.params.id as string);
    if (isNaN(checkinsId)) {
        return res.status(400).json({ message: "Invalid checkin Id" });
    }
    try {
        const deletedcheckins = await deletecheckinServices(checkinsId);
        if (deletedcheckins) {
            return res.status(200).json({ message: "Check-in deleted successfully" });
        } else {
            return res.status(404).json({ message: "Check-in not found" });
        }
    } catch (error: any) {
        next(error);
    }
}