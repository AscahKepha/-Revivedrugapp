import { Request, Response, NextFunction } from "express";
import { 
    createRiskScoreService, 
    createcheckinService, 
    updatecheckinServices, 
    getcheckinByIdService, 
    getcheckinServices, 
    deletecheckinServices,
    getCheckinStatsByUserIdService 
} from "./checkins.service";
import { incrementUserStreakSmart } from "../users/user.service";

/**
 * GET /checkins/stats/:userId
 * Aggregates check-in counts, retrieves live streak, and latest notes for the dashboard
 */
export const getCheckinStatsController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId as string);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User Id" });
    }

    try {
        const stats = await getCheckinStatsByUserIdService(userId);
        
        // If no stats exist, return a clean empty state object
        if (!stats) {
            return res.status(200).json({ 
                totalLogs: 0, 
                lastWeekCount: 0, 
                userStreak: 0,
                averageSelfEfficacy: 0,
                isTodayLogged: false,
                todayNote: "",
                previousNote: ""
            });
        }

        // Return stats (includes the live userStreak fetched in the service)
        return res.status(200).json(stats);
    } catch (error: any) {
        console.error(`❌ [StatsController]: Error for user ${userId}:`, error);
        next(error);
    }
};

/**
 * Helper to calculate Risk Metrics based on check-in data
 * Score formula: cravings + (10 - control) + (10 - selfEfficacy) + (consequences ? 5 : 0)
 */
const calculateRiskMetrics = (cravings: number, control: number, selfEfficacy: number, consequences: boolean) => {
    const score = Number(cravings) + (10 - Number(control)) + (10 - Number(selfEfficacy)) + (consequences ? 5 : 0);
    
    let riskLevel: "low" | "medium" | "high" = "low";
    if (score >= 18) riskLevel = "high";
    else if (score >= 10) riskLevel = "medium";
    
    return { score, riskLevel };
};

/**
 * POST /checkins
 * Core behavioral check-in logic: Saves check-in, calculates risk, and updates streak
 */
export const createCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, cravings, control, selfEfficacy, consequences, copingUsed, notes } = req.body;

    // Strict validation: ensure all necessary fields are present
    if (!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined) {
        return res.status(400).json({ error: "Required fields missing for Urge Assessment" });
    }

    try {
        console.log(`🚀 [CreateCheckin]: Processing entry for user ${userId}`);

        // 1. Save the Check-in to PostgreSQL
        const newCheckin = await createcheckinService({
            userId, 
            cravings: Number(cravings), 
            control: Number(control), 
            selfEfficacy: Number(selfEfficacy), 
            consequences, 
            copingUsed, 
            notes: notes || ""
        });

        if (!newCheckin) return res.status(500).json({ error: "Failed to create checkin record" });

        // 2. Calculate and Save Risk Score to 'risk_scores' table
        const { score, riskLevel } = calculateRiskMetrics(cravings, control, selfEfficacy, consequences);
        await createRiskScoreService({ userId, score, riskLevel });

        // 3. Update User Streak
        // Logic checks if last check-in was yesterday to increment streak_days in usersTable
        await incrementUserStreakSmart(userId);

        return res.status(201).json({
            message: "Check-in successful! 🔥",
            streakMessage: "Your progress streak has been secured.",
            riskStatus: `Current risk level: ${riskLevel}`,
            data: newCheckin,
            metrics: { score, riskLevel }
        });
    } catch (error: any) {
        console.error("❌ [CreateCheckin]: Error:", error);
        next(error);
    }
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
};

/**
 * GET /checkins/:id
 */
export const getCheckinsByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const checkinId = parseInt(req.params.id as string);
    if (isNaN(checkinId)) return res.status(400).json({ message: "Invalid checkin Id" });

    try {
        const checkin = await getcheckinByIdService(checkinId);
        if (!checkin) return res.status(404).json({ message: "Check-in not found" });
        return res.status(200).json(checkin);
    } catch (error: any) {
        next(error);
    }
};

/**
 * PUT /checkins/:id
 */
export const updateCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const checkinsId = parseInt(req.params.id as string);
    if (isNaN(checkinsId)) return res.status(400).json({ error: "Invalid checkin Id" });
    
    const { userId, cravings, control, selfEfficacy, consequences, copingUsed, notes } = req.body;

    try {
        const existingcheckins = await getcheckinByIdService(checkinsId);
        if (!existingcheckins) return res.status(404).json({ message: "Check-in not found" });

        const updatedcheckin = await updatecheckinServices(checkinsId, {
            userId, cravings, control, selfEfficacy, consequences, copingUsed, notes
        });

        if (!updatedcheckin) return res.status(404).json({ message: "Failed to update" });
        return res.status(200).json({ message: "Update successful", data: updatedcheckin });
    } catch (error: any) {
        next(error);
    }
};

/**
 * DELETE /checkins/:id
 */
export const deleteCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const checkinsId = parseInt(req.params.id as string);
    if (isNaN(checkinsId)) return res.status(400).json({ message: "Invalid checkin Id" });

    try {
        const deleted = await deletecheckinServices(checkinsId);
        if (deleted) return res.status(200).json({ message: "Check-in deleted successfully" });
        return res.status(404).json({ message: "Check-in not found" });
    } catch (error: any) {
        next(error);
    }
};