import {Request, Response} from "express";
import { createSupportPartnerActionsService, getSupportPartnerActionsByIdService, getSupportPartnerActionsServices, updateSupportPartnerActionsServices, deleteSupportPartnerActionsServices } from "./supportpartneractions.service";
import { supportPartnersActionsTable } from "../drizzle/schema";
import {eq} from "drizzle-orm";
import db from "../drizzle/db";

export const getActionsController = async (req: Request, res:Response) => {
    try{
        const allActions = await getSupportPartnerActionsServices();
        if (allActions == null || allActions.length == 0) {
            res.status(404).json({error: "No actions found"});
        }else {
            res.status(200).json(allActions);
        }
    } catch (error:any) {
        res.status(500).json({error: error.message || "Error fetching actions"});
    }
}

export const getActionsByIdController = async(req: Request, res:Response) => {
    const actionId = parseInt(req.params.id as string);
    if(isNaN(actionId)) {
        res.status(400).json({error: "Invalid action Id"});
        return;
    } else {
        try {
            const action = await getSupportPartnerActionsByIdService(actionId);
            if (action == undefined) {
                res.status(404).json({message: "Action not found or doesn't exist"});
            }else {
                res.status(200).json(action);
            }
        }catch (error: any) {
            res.status(500).json({error: error.message || "Error fetching action"});
        }
    }
}

export const createActionsController = async(req:Request, res:Response) => {
    const {partnerId,userId,success,actionDescription} = req.body;
    if (!partnerId || !userId || success === undefined || !actionDescription) {
        res.status(400).json({error: "All fields are required"});
        return;
    } 
        try {
            const newAction = await createSupportPartnerActionsService({
                partnerId,userId,success,actionDescription
            });
            res.status(200).json(newAction);
        }catch (error:any) {
        res.status(500).json({error: error.message || "Error creating action"});
}
}

export const updateActionsController = async(req:Request, res:Response) => {
    const actionId = parseInt(req.params.id as string);
    if(isNaN(actionId)) {
        res.status(400).json({error: "Invalid action Id"});
        return;
    }
    const {partnerId,userId,success,actionDescription} = req.body;
    if (!partnerId || !userId || success === undefined || !actionDescription) {
        res.status(400).json({error: "All fields required"});
        return;
    } try {
        const existingAction = await getSupportPartnerActionsByIdService(actionId);
        if (!existingAction) {
            res.status(404).json({message: "Action not found"})
        } else {
            const updatedAction = await updateSupportPartnerActionsServices(actionId, {
                partnerId,userId,success,actionDescription
            });
            res.status(200).json(updatedAction);
        }
    } catch (error:any) {
        res.status(500).json({error: error.message || "Error updating action"});
    }
}


export const deleteActionsController = async(req:Request, res:Response) => {
    const actionId = parseInt(req.params.id as string);
    if(isNaN(actionId)) {
        res.status(400).json({error: "Invalid action Id"});
        return;
    }
    try {
        const existingAction = await getSupportPartnerActionsByIdService(actionId);
        if (!existingAction) {
            res.status(404).json({message: "Action not found"});
        } else {
            await deleteSupportPartnerActionsServices(actionId);
            res.status(200).json({message: "Action deleted successfully"});
        }
    }catch (error:any ){
        res.status(500).json({error: error.message || "Error deleting action"});
    }
}