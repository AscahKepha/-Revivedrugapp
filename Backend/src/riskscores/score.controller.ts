import { Request, Response, NextFunction } from "express";
import { 
    createRiskScoreService, 
    updateRiskScoreServices, 
    getRiskScoreByIdService, 
    getRiskScoreServices, 
    deleteRiskScoreServices, 
    getRiskScoresByUserService 
} from "./score.service";

/**
 * GET /risk-scores
 * Fetch all risk scores (Admin utility)
 */
export const getRiskScoreController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allRiskScore = await getRiskScoreServices();
        if (!allRiskScore || allRiskScore.length === 0) {
            return res.status(404).json({ message: "No Risk Scores found" });
        }
        return res.status(200).json(allRiskScore);
    } catch (error: any) {
        next(error);
    }
}

/**
 * GET /risk-scores/:id
 */
export const getRiskScoreByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const riskScoreId = parseInt(req.params.id as string);
    if (isNaN(riskScoreId)) {
        return res.status(400).json({ message: "Invalid Risk Score Id" });
    }
    try {
        const riskScore = await getRiskScoreByIdService(riskScoreId);
        if (!riskScore) {
            return res.status(404).json({ message: "Risk Score not found" });
        }
        return res.status(200).json(riskScore);
    } catch (error: any) {
        next(error);
    }
}

/**
 * GET /risk-scores/user/:userId
 * Fetch scores specifically for one user's history
 */
export const getRiskScoreByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId as string);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User Id" });
    }
    try {
        const scores = await getRiskScoresByUserService(userId);
        if (!scores || scores.length === 0) {
            return res.status(404).json({ message: "No scores found for this user" });
        }
        return res.status(200).json(scores);
    } catch (error: any) {
        next(error);
    }
};

/**
 * PUT /risk-scores/:id
 */
export const updateRiskScoreController = async (req: Request, res: Response, next: NextFunction) => {
    const riskScoreId = parseInt(req.params.id as string);
    if (isNaN(riskScoreId)) {
        return res.status(400).json({ error: "Invalid RiskScore Id" });
    }

    const { userId, score, riskLevel } = req.body;
    if (!userId || score === undefined || riskLevel === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingRiskScore = await getRiskScoreByIdService(riskScoreId);
        if (!existingRiskScore) {
            return res.status(404).json({ message: "RiskScore not found" });
        }

        const updatedRiskScore = await updateRiskScoreServices(riskScoreId, {
            userId, score, riskLevel
        });

        if (!updatedRiskScore) {
            return res.status(404).json({ message: "RiskScore not found or failed to update" });
        }
        return res.status(200).json({ message: "Risk Score updated successfully", data: updatedRiskScore });
    } catch (error: any) {
        next(error);
    }
}

/**
 * DELETE /risk-scores/:id
 */
export const deleteRiskScoreController = async (req: Request, res: Response, next: NextFunction) => {
    const riskScoreId = parseInt(req.params.id as string);
    if (isNaN(riskScoreId)) {
        return res.status(400).json({ message: "Invalid RiskScore Id" });
    }
    try {
        const deletedRiskScore = await deleteRiskScoreServices(riskScoreId);
        if (deletedRiskScore) {
            return res.status(200).json({ message: "RiskScore deleted successfully" });
        } else {
            return res.status(404).json({ message: "RiskScore not found" });
        }
    } catch (error: any) {
        next(error);
    }
}