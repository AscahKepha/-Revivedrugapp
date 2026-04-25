import { Request, Response, NextFunction } from "express";
import { 
    createUserService, 
    updateUserService, 
    getUserByIdService, 
    getUserServices, 
    deleteUserServices, 
    incrementUserStreakSmart 
} from "./user.service";

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Fetching all users...");
    try {
        const allusers = await getUserServices();
        if (!allusers || allusers.length === 0) {
            console.warn("No users found in database.");
            return res.status(404).json({ messages: "No users found" });
        }
        console.log(`Successfully retrieved ${allusers.length} users.`);
        res.status(200).json(allusers);
    } catch (error: any) {
        next(error);
    }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = parseInt(id as string);
    
    console.log(`Fetching user with ID: ${userId}`);

    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user Id" });
    }

    try {
        const user = await getUserByIdService(userId);
        if (!user) {
            console.warn(`User with ID ${userId} not found.`);
            return res.status(404).json({ message: "User not found" });
        }
        console.log(`User ${userId} retrieved successfully.`);
        res.status(200).json(user);
    } catch (error: any) {
        next(error);
    }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Attempting to create new user:", req.body.email);
    const { userName, email, password, contactPhone, userType } = req.body;

    if (!userName || !email || !password || !contactPhone || !userType) {
        console.warn("User creation failed: Missing required fields.");
        return res.status(400).json({ error: "Required fields are missing" });
    }

    try {
        const resultMessage = await createUserService(req.body);
        console.log("User created successfully:", email);
        res.status(201).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id as string);
    console.log(`Update request for user ID: ${userId}`);

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user Id" });
    }

    try {
        const existingUser = await getUserByIdService(userId);
        if (!existingUser) {
            console.warn(`Update failed: User ${userId} does not exist.`);
            return res.status(404).json({ message: "User not found" });
        }

        const resultMessage = await updateUserService(userId, req.body);
        console.log(`User ${userId} updated successfully.`);
        res.status(200).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id as string);
    console.log(`Delete request for user ID: ${userId}`);

    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user Id" });
    }

    try {
        const resultMessage = await deleteUserServices(userId);
        console.log(`User ${userId} deleted successfully.`);
        res.status(200).json({ message: resultMessage });
    } catch (error: any) {
        next(error);
    }
};

export const handleUserCheckIn = async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id as string);
    console.log(`Streak increment request for user ID: ${userId}`);

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user Id" });
    }

    try {
        const [updatedUser] = await incrementUserStreakSmart(userId);
        if (!updatedUser) {
            console.warn(`Streak update failed: User ${userId} not found.`);
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`User ${userId} streak incremented to ${updatedUser.streak_days}.`);
        res.status(200).json({ 
            message: "Streak updated! Keep it up!", 
            currentStreak: updatedUser.streak_days 
        });
    } catch (error: any) {
        next(error);
    }
};