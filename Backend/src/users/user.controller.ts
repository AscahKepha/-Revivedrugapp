import { Request, Response } from "express";
import { createUserService, updateUserService, getUserByIdService, getUserServices, deleteUserServices, incrementUserStreakSmart } from "./user.service";
import { userTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";


export const getUsersController = async (req: Request, res: Response) => {
    try {
        const allusers = await getUserServices();
        if (allusers == null || allusers.length == 0) {
            res.status(404).json({messages: "No users found"});
        } else {
            res.status(200).json(allusers);
        }
    } catch (error:any) {
        res.status(500).json({message: error.message || "error fetching users"});
    }
}


export const getUserByIdController = async (req:Request, res:Response) => {
    const userId = parseInt(req.params.id as string);
    if (isNaN(userId)) {
        res.status(400).json({message: "Invalid user Id"});
        return;
    }
    try {
        const user = await getUserByIdService(userId)
        if (user == undefined ) {
            res.status(404).json({message: "users not found" });
        }else {
            res.status(200).json(user);
        }
    }catch (error: any){
        res.status(500).json({error: error.message || "error fetching user"});
    }
}

export const createUserController = async(req: Request, res:Response) => {
    const { userName, email, password, contactPhone, address, streak_days, longest_streak, userType} = req.body;
    if( !userName || !email || !password || !contactPhone|| !address || streak_days==undefined || longest_streak===undefined || !userType) {
        res.status(400).json({error: "All fields are required"});
        return;
    }
    try{
        const newUser = await createUserService ({
             userName, email, password, contactPhone, address, streak_days, longest_streak, userType
        });

        if (!newUser) {
            res.status(500).json({message:"Failed to create user"});
        } else {
            res.status(201).json(newUser);
        }
    } catch (error:any){  
       res.status(500).json ({ error: error.message || "Failed to create user" });
    }
};

export const updateUserController = async(req:Request, res:Response) => {
    const userId = parseInt(req.params.id as string);
    if (isNaN(userId)) {
        res.status(400).json({error: "Invalid user Id"});
        return;
    }
    const {userName, email, password, contactPhone, address, streak_days, longest_streak, userType} = req.body;
    if(!userName || !email || !password || !contactPhone|| !address || !streak_days || !longest_streak || !userType) {
        res.status(400).json({error: "all fields is required"});
        return;
    }

    try {
        const existingUser = await getUserByIdService(userId);
        if (!existingUser) {
            res.status(404).json({message: "user not found"});
            return;
        }
        const updatedFields = {
            userName: req.body.userName ?? existingUser.userName,
            email: req.body.email ?? existingUser.email,
            password: req.body.password ?? existingUser.password, // Be careful here (see note below)
            contactPhone: req.body.contactPhone ?? existingUser.contactPhone,
            address: req.body.address ?? existingUser.address,
            streak_days: req.body.streak_days ?? existingUser.streak_days,
            longest_streak: req.body.longest_streak ?? existingUser.longest_streak,
            userType: req.body.userType ?? existingUser.userType
        };
        const updatedUser = await updateUserService(userId, updatedFields);
        if (updatedUser == null) {
            res.status(404).json({message: "User not found or failed to update"});
        }else{
            res.status(200).json({message:updatedUser});
        }
    }catch (error:any){
        res.status(500).json({error:error.message || "Failed to update user "})
    }
}


export const deleteUserController = async(req:Request, res:Response) => {
    const userId = parseInt(req.params.id as string);
    if (isNaN(userId)){ 
        res.status(400).json({message: "Invalid user Id"});
        return;
    }
    try{
        const deletedUser = await deleteUserServices(userId);
        if (deletedUser) {
            res.status(200).json({message: "User deleted "});

        }else {
            res.status(404).json({message: "User not found"});
        }
    }catch  (error:any){
        res.status(500).json({error:error.message || "failed to delete user"});
    }
}

export const handleUserCheckIn = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id as string);

    try {
        // Call the service to do the math and DB update
        const [updatedUser] = await incrementUserStreakSmart(userId);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ 
            message: "Streak updated! Keep it up!", 
            currentStreak: updatedUser.streak_days 
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};