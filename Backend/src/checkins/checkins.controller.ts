import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { createRiskScoreService ,createcheckinService, updatecheckinServices, getcheckinByIdService, getcheckinServices, deletecheckinServices } from "./checkins.service";
import { checkinTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { incrementUserStreakSmart } from "../users/user.service";


export const getCheckinsController = async (req: Request, res: Response) => {
    try {
        const allcheckins = await getcheckinServices();
        if (allcheckins == null || allcheckins.length == 0) {
            res.status(404).json({message: "No checkins found"});
        } else {
            res.status(200).json(allcheckins);
        }
    } catch (error:any) {
        res.status(500).json({error: error.message || "error fetching checkins"});
    }
}


export const getCheckinsByIdController = async (req:Request, res:Response) => {
    const checkinId = parseInt(req.params.id as string);
    if (isNaN(checkinId)) {
        res.status(400).json({message: "Invalid checkin Id"});
        return;
    }
    try {
        const checkins = await getcheckinByIdService(checkinId)
        if (checkins == undefined ) {
            res.status(404).json({message: "checkins not found" });
        }else {
            res.status(200).json(checkins);
        }
    }catch (error: any){
        res.status(500).json({error: error.message || "error fetching checkins"});
    }
}

// export const createCheckinsController = async(req: Request, res:Response) => {
//     const { userId,cravings,control,selfEfficacy,consequences,copingUsed,notes} = req.body;
//     if(!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined || !notes) {
//         res.status(400).json({error: "All fields are required"});
//         return;
//     }
//     try{
//         const newcheckins = await createcheckinService ({
//              userId,cravings,control,selfEfficacy,consequences,copingUsed,notes
//         });

//         if (!newcheckins) {
//             res.status(500).json({checkin:"Failed to create checkins"});
//         } else {
//             res.status(201).json(newcheckins);
//         }
//     } catch (error:any){  
//        res.status(500).json ({ error: error.message || "Failed to create checkins" });
//     }
// };

export const updateCheckinsController = async(req:Request, res:Response) => {
    const checkinsId = parseInt(req.params.id as string);
    if (isNaN(checkinsId)) {
        res.status(400).json({error: "Invalid checkin Id"});
        return;
    }
    const {userId,cravings,control,selfEfficacy,consequences,copingUsed,notes} = req.body;
    if(!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined || !notes) {
        res.status(400).json({error: "all fields is required"});
        return;
    }

    try {
        const existingcheckins = await getcheckinByIdService(checkinsId);
        if (!existingcheckins) {
            res.status(404).json({checkin: "checkins not found"});
            return;
        }
        const updatedcheckin = await updatecheckinServices(checkinsId, {
            userId,cravings,control,selfEfficacy,consequences,copingUsed,notes
        });
        if (updatedcheckin == null) {
            res.status(404).json({checkin: "checkin not found or failed to update"});
        }else{
            res.status(200).json({checkin:updatedcheckin});
        }
    }catch (error:any){
        res.status(500).json({error:error.message || "Failed to update checkin "})
    }
}


export const deleteCheckinsController = async(req:Request, res:Response) => {
    const checkinsId = parseInt(req.params.id as string);
    if (isNaN(checkinsId)){ 
        res.status(400).json({checkin: "Invalid checkin Id"});
        return;
    }
    try{
        const deletedcheckins = await deletecheckinServices(checkinsId);
        if (deletedcheckins) {
            res.status(200).json({checkin: "checkin deleted "});

        }else {
            res.status(404).json({checkin: "checkin not found"});
        }
    }catch  (error:any){
        res.status(500).json({error:error.message || "failed to delete checkin"});
    }
}

const calculateRiskMetrics = (cravings: number, control: number, selfEfficacy: number, consequences: boolean) => {
    // Scoring logic: higher cravings = higher risk, lower control/efficacy = higher risk
    // Plus a penalty if they've already faced consequences today
    const score = cravings + (10 - control) + (10 - selfEfficacy) + (consequences ? 5 : 0);
    
    let riskLevel: "low" | "medium" | "high" = "low";
    if (score >= 18) riskLevel = "high";
    else if (score >= 10) riskLevel = "medium";
    
    return { score, riskLevel };
};

export const createCheckinsController = async (req: Request, res: Response) => {
    const { userId, cravings, control, selfEfficacy, consequences, copingUsed, notes } = req.body;

    // 1. Validation
    if (!userId || cravings === undefined || control === undefined || selfEfficacy === undefined || consequences === undefined || copingUsed === undefined || !notes) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    try {
        // 2. Save the Check-in
        const newCheckin = await createcheckinService({
            userId, cravings, control, selfEfficacy, consequences, copingUsed, notes
        });

        if (!newCheckin) {
            res.status(500).json({ error: "Failed to create checkin record" });
            return;
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
        res.status(201).json({
            message: "Check-in successful! 🔥",
            streakMessage: "Your streak has been updated.",
            riskStatus: `Current risk level is ${riskLevel}`,
            data: newCheckin,
            metrics: { score, riskLevel } // Optional: send back the score to show in React
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || "An unexpected error occurred during check-in" });
    }
};