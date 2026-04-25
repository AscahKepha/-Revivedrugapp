import { Request, Response } from "express";
import { createRiskScoreService, updateRiskScoreServices, getRiskScoreByIdService, getRiskScoreServices, deleteRiskScoreServices, getRiskScoresByUserService } from "./score.service";
import { riskScoreTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";


export const getRiskScoreController = async (req: Request, res: Response) => {
    try {
        const allRiskScore = await getRiskScoreServices();
        if (allRiskScore == null || allRiskScore.length == 0) {
            res.status(404).json({messages: "No Risk Scores found"});
        } else {
            res.status(200).json(allRiskScore);
        }
    } catch (error:any) {
        res.status(500).json({message: error.message || "error fetching Risk Scores"});
    }
}


export const getRiskScoreByIdController = async (req:Request, res:Response) => {
    const RiskScoreId = parseInt(req.params.id as string);
    if (isNaN(RiskScoreId)) {
        res.status(400).json({message: "Invalid Risk Score Id"});
        return;
    }
    try {
        const RiskScore = await getRiskScoreByIdService(RiskScoreId)
        if (RiskScore == undefined ) {
            res.status(404).json({message: "RiskScore not found" });
        }else {
            res.status(200).json(RiskScore);
        }
    }catch (error: any){
        res.status(500).json({error: error.message || "error fetching RiskScore"});
    }
}

export const getRiskScoreByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId as string);
    try {
        const scores = await getRiskScoresByUserService(userId); // You'll need this service
        res.status(200).json(scores);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// export const createRiskScoreController = async(req: Request, res:Response) => {
//     const { userId, score, riskLevel} = req.body;
//     if(!userId || score === undefined || riskLevel === undefined ) {
//         res.status(400).json({error: "All fields are required"});
//         return;
//     }
//     try{
//         const newRiskScore = await createRiskScoreService ({
//              userId, score, riskLevel
//         });

//         if (!newRiskScore) {
//             res.status(500).json({message:"Failed to create RiskScore"});
//         } else {
//             res.status(201).json(newRiskScore);
//         }
//     } catch (error:any){  
//        res.status(500).json ({ error: error.message || "Failed to create RiskScore" });
//     }
// };

export const updateRiskScoreController = async(req:Request, res:Response) => {
    const riskScoreId = parseInt(req.params.id as string);
    if (isNaN(riskScoreId)) {
        res.status(400).json({error: "Invalid RiskScore Id"});
        return;
    }
    const {userId, score, riskLevel} = req.body;
    if(!userId || score === undefined || riskLevel === undefined) {
        res.status(400).json({error: "all fields is required"});
        return;
    }

    try {
        const existingRiskScore = await getRiskScoreByIdService(riskScoreId);
        if (!existingRiskScore) {
            res.status(404).json({message: "RiskScore not found"});
            return;
        }
        const updatedRiskScore = await updateRiskScoreServices(riskScoreId, {
            userId, score, riskLevel
        });
        if (updatedRiskScore == null) {
            res.status(404).json({message: "RiskScore not found or failed to update"});
        }else{
            res.status(200).json({message:updatedRiskScore});
        }
    }catch (error:any){
        res.status(500).json({error:error.message || "Failed to update RiskScore "})
    }
}


export const deleteRiskScoreController = async(req:Request, res:Response) => {
    const RiskScoreId = parseInt(req.params.id as string);
    if (isNaN(RiskScoreId)){ 
        res.status(400).json({message: "Invalid RiskScore Id"});
        return;
    }
    try{
        const deletedRiskScore = await deleteRiskScoreServices(RiskScoreId);
        if (deletedRiskScore) {
            res.status(200).json({message: "RiskScore deleted "});

        }else {
            res.status(404).json({message: "RiskScore not found"});
        }
    }catch  (error:any){
        res.status(500).json({error:error.message || "failed to delete RiskScore"});
    }
}