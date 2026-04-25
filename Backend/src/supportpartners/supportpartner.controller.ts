import { Request, Response } from "express";
import { createSupportPartnerService, updateSupportPartnerServices, getSupportPartnerByIdService, getSupportPartnerServices, deleteSupportPartnerServices } from "./supportpartner.service";
import { supportpartnersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";


export const getSupportPartnerController = async (req: Request, res: Response) => {
    try {
        const allSupportPartners = await getSupportPartnerServices();
        if (allSupportPartners == null || allSupportPartners.length == 0) {
            res.status(404).json({messages: "No Support Partners found"});
        } else {
            res.status(200).json(allSupportPartners);
        }
    } catch (error:any) {
        res.status(500).json({message: error.message || "error fetching Support Partners"});
    }
}


export const getSupportPartnerByIdController = async (req:Request, res:Response) => {
    const SupportPartnerId = parseInt(req.params.id as string);
    if (isNaN(SupportPartnerId)) {
        res.status(400).json({message: "Invalid Support Partner Id"});
        return;
    }
    try {
        const SupportPartner = await getSupportPartnerByIdService(SupportPartnerId)
        if (SupportPartner == undefined ) {
            res.status(404).json({message: "SupportPartners not found" });
        }else {
            res.status(200).json(SupportPartner);
        }
    }catch (error: any){
        res.status(500).json({error: error.message || "error fetching SupportPartner"});
    }
}

export const createSupportPartnerController = async(req: Request, res:Response) => {
    const { userId,partnerName, contactInfo, relationship} = req.body;
    if(!userId || !partnerName || !contactInfo || !relationship) {
        res.status(400).json({error: "All fields are required"});
        return;
    }
    try{
        const newSupportPartner = await createSupportPartnerService ({
             userId,partnerName, contactInfo, relationship
        });

        if (!newSupportPartner) {
            res.status(500).json({message:"Failed to create SupportPartner"});
        } else {
            res.status(201).json(newSupportPartner);
        }
    } catch (error:any){  
       res.status(500).json ({ error: error.message || "Failed to create SupportPartner" });
    }
};

export const updateSupportPartnerController = async(req:Request, res:Response) => {
    const SupportPartnerId = parseInt(req.params.id as string);
    if (isNaN(SupportPartnerId)) {
        res.status(400).json({error: "Invalid SupportPartner Id"});
        return;
    }
    const {userId,partnerName, contactInfo, relationship} = req.body;
    if(!userId || !partnerName || !contactInfo || !relationship) {
        res.status(400).json({error: "all fields is required"});
        return;
    }

    try {
        const existingSupportPartner = await getSupportPartnerByIdService(SupportPartnerId);
        if (!existingSupportPartner) {
            res.status(404).json({message: "SupportPartner not found"});
            return;
        }
        const updatedSupportPartner = await updateSupportPartnerServices(SupportPartnerId, {
            userId,partnerName, contactInfo, relationship
        });
        if (updatedSupportPartner == null) {
            res.status(404).json({message: "SupportPartner not found or failed to update"});
        }else{
            res.status(200).json({message:updatedSupportPartner});
        }
    }catch (error:any){
        res.status(500).json({error:error.message || "Failed to update SupportPartner "})
    }
}


export const deleteSupportPartnerController = async(req:Request, res:Response) => {
    const SupportPartnerId = parseInt(req.params.id as string);
    if (isNaN(SupportPartnerId)){ 
        res.status(400).json({message: "Invalid SupportPartner Id"});
        return;
    }
    try{
        const deletedSupportPartner = await deleteSupportPartnerServices(SupportPartnerId);
        if (deletedSupportPartner) {
            res.status(200).json({message: "SupportPartner deleted "});

        }else {
            res.status(404).json({message: "SupportPartner not found"});
        }
    }catch  (error:any){
        res.status(500).json({error:error.message || "failed to delete SupportPartner"});
    }
}