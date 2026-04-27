import { Request, Response, NextFunction } from "express";
import {
    createUserService,
    updateUserService,
    getUserByIdService,
    getUserServices,
    deleteUserServices,
    incrementUserStreakSmart
} from "./user.service";

/**
 * getUsersController: Fetches users based on role permissions.
 */
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    const requesterId = (req as any).user?.userId;
    const requesterRole = (req as any).user?.userType;

    try {
        let allusers;

        if (requesterRole === 'admin') {
            allusers = await getUserServices();
        } else if (requesterRole === 'support_partner') {
            allusers = await getUserServices(requesterId);
        } else {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        if (!allusers || allusers.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(allusers);
    } catch (error: any) {
        next(error);
    }
};

/**
 * getUserByIdController: Fetches a single user by ID.
 * Updated to allow: Admins, the User themselves, or their assigned Partner.
 */
export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const targetUserId = parseInt(req.params.id as string);
    const requesterId = (req as any).user?.userId;
    const requesterRole = (req as any).user?.userType;

    if (isNaN(targetUserId)) {
        return res.status(400).json({ message: "Invalid user Id" });
    }

    try {
        const user = await getUserByIdService(targetUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // --- SECURITY GATE ---
        const isAdmin = requesterRole === 'admin';
        const isSelf = requesterId === targetUserId;
        const isAssignedPartner = requesterRole === 'support_partner' && user.partnerId === requesterId;

        if (isAdmin || isSelf || isAssignedPartner) {
            return res.status(200).json(user);
        }

        // If it fails, log the IDs to your terminal to debug the mismatch
        console.warn(`🚨 [403 Forbidden]: Requester(ID:${requesterId}, Role:${requesterRole}) tried to access Patient(ID:${targetUserId}, AssignedPartnerID:${user.partnerId})`);

        return res.status(403).json({
            message: "Access Denied: You are not authorized to view this clinical profile."
        });
    } catch (error: any) {
        next(error);
    }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const resultMessage = await createUserService(req.body);
        res.status(201).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id as string);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user Id" });

    try {
        const resultMessage = await updateUserService(userId, req.body);
        res.status(200).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id as string);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user Id" });

    try {
        const resultMessage = await deleteUserServices(userId);
        res.status(200).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

export const handleUserCheckIn = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id as string);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user Id" });

    try {
        const [updatedUser] = await incrementUserStreakSmart(userId);
        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            message: "Streak updated!",
            currentStreak: updatedUser.streak_days
        });
    } catch (error: any) {
        next(error);
    }
};