import { Request, Response, NextFunction } from "express";
import { 
    createSupportPartnerService, 
    updateSupportPartnerServices, 
    getSupportPartnerByIdService, 
    getSupportPartnerServices, 
    deleteSupportPartnerServices 
} from "./supportpartner.service";

/**
 * GET /supportpartners
 */
export const getSupportPartnerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allSupportPartners = await getSupportPartnerServices();
        if (!allSupportPartners || allSupportPartners.length === 0) {
            return res.status(404).json({ message: "No Support Partners found" });
        }
        return res.status(200).json(allSupportPartners);
    } catch (error: any) {
        next(error);
    }
}

/**
 * GET /supportpartners/:id
 */
export const getSupportPartnerByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const supportPartnerId = parseInt(req.params.id as string);

    if (isNaN(supportPartnerId)) {
        return res.status(400).json({ message: "Invalid Support Partner Id" });
    }

    try {
        const supportPartner = await getSupportPartnerByIdService(supportPartnerId);
        if (!supportPartner) {
            return res.status(404).json({ message: "Support Partner not found" });
        }
        return res.status(200).json(supportPartner);
    } catch (error: any) {
        next(error);
    }
}

/**
 * POST /supportpartners
 */
export const createSupportPartnerController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, partnerName, contactInfo, relationship } = req.body;

    if (!userId || !partnerName || !contactInfo || !relationship) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const resultMessage = await createSupportPartnerService({
            userId, partnerName, contactInfo, relationship
        });

        if (!resultMessage) {
            return res.status(500).json({ message: "Failed to create Support Partner" });
        }
        return res.status(201).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

/**
 * PUT /supportpartners/:id
 */
export const updateSupportPartnerController = async (req: Request, res: Response, next: NextFunction) => {
    const supportPartnerId = parseInt(req.params.id as string);

    if (isNaN(supportPartnerId)) {
        return res.status(400).json({ message: "Invalid Support Partner Id" });
    }

    const { userId, partnerName, contactInfo, relationship } = req.body;
    // Note: Usually we check if at least one field is present for a PUT/PATCH
    if (!userId || !partnerName || !contactInfo || !relationship) {
        return res.status(400).json({ message: "All fields are required for a full update" });
    }

    try {
        const existingSupportPartner = await getSupportPartnerByIdService(supportPartnerId);
        if (!existingSupportPartner) {
            return res.status(404).json({ message: "Support Partner not found" });
        }

        const resultMessage = await updateSupportPartnerServices(supportPartnerId, {
            userId, partnerName, contactInfo, relationship
        });

        if (!resultMessage) {
            return res.status(404).json({ message: "Support Partner not found or failed to update" });
        }
        return res.status(200).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
}

/**
 * DELETE /supportpartners/:id
 */
export const deleteSupportPartnerController = async (req: Request, res: Response, next: NextFunction) => {
    const supportPartnerId = parseInt(req.params.id as string);

    if (isNaN(supportPartnerId)) {
        return res.status(400).json({ message: "Invalid Support Partner Id" });
    }

    try {
        const resultMessage = await deleteSupportPartnerServices(supportPartnerId);
        if (resultMessage) {
            return res.status(200).json({ message: resultMessage });
        } else {
            return res.status(404).json({ message: "Support Partner not found" });
        }
    } catch (error: any) {
        next(error);
    }
}