import { Request, Response, NextFunction } from "express";
import { 
    createRiskScoreService, 
    createcheckinService, 
    updatecheckinServices, 
    getcheckinByIdService, 
    getcheckinServices, 
    deletecheckinServices,
    getCheckinStatsByUserIdService,
    getCheckinsByPatientIdService // 🆕 New service function
} from "./checkins.service";
import { incrementUserStreakSmart } from "../users/user.service";

/**
 * GET /checkins/stats/:userId
 */
export const getCheckinStatsController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId as string);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User Id" });
    }

    try {
        const stats = await getCheckinStatsByUserIdService(userId);
        
        if (!stats) {
            return res.status(200).json({ 
                totalLogs: 0, 
                lastWeekCount: 0, 
                userStreak: 0,
                isTodayLogged: false,
                todayNote: "",
                previousNote: ""
            });
        }

        return res.status(200).json(stats);
    } catch (error: any) {
        console.error(`❌ [StatsController]: Error for user ${userId}:`, error);
        next(error);
    }
};

/**
 * Helper to calculate Risk Metrics
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
 */
export const createCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, cravings, control, selfEfficacy, consequences, copingUsed, notes } = req.body;

    if (!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined) {
        return res.status(400).json({ error: "Required fields missing for Urge Assessment" });
    }

    try {
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

        const { score, riskLevel } = calculateRiskMetrics(cravings, control, selfEfficacy, consequences);
        await createRiskScoreService({ userId, score, riskLevel });

        await incrementUserStreakSmart(userId);

        return res.status(201).json({
            message: "Check-in successful! 🔥",
            data: newCheckin,
            metrics: { score, riskLevel }
        });
    } catch (error: any) {
        next(error);
    }
};

/**
 * GET /checkins
 * UPDATED: Now supports ?patientId=XX for Clinical View
 */
export const getCheckinsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : null;

        let checkins;
        if (patientId) {
            // Fetch history for a specific patient (Clinical View)
            checkins = await getCheckinsByPatientIdService(patientId);
        } else {
            // Global logs (Admin Action Logs)
            checkins = await getcheckinServices();
        }

        if (!checkins || checkins.length === 0) {
            return res.status(404).json({ message: "No checkins found" });
        }
        return res.status(200).json(checkins);
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
    
    const actionData = req.body;

    try {
        const existing = await getcheckinByIdService(checkinsId);
        if (!existing) return res.status(404).json({ message: "Check-in not found" });

        const resultMessage = await updatecheckinServices(checkinsId, actionData);
        return res.status(200).json({ message: resultMessage });
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
        const message = await deletecheckinServices(checkinsId);
        return res.status(200).json({ message });
    } catch (error: any) {
        next(error);
    }
};