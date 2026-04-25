import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUserService, getUserByEmailService } from "./auth.service";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        
        if (!user.userName || !user.email || !user.password || !user.contactPhone || !user.address) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        // Generate hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        const newUser = await createUserService(user);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error: any) {
        // Pass the error to the global error handler
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const existingUser = await getUserByEmailService(email);
        
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isMatchPasswords = await bcrypt.compare(password, existingUser.password);
        if (!isMatchPasswords) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        // Generate token 
        const payload = {
            userId: existingUser.userId,
            email: existingUser.email,
            userName: existingUser.userName,
            userType: existingUser.userType,
        };

        const secret = process.env.JWT_SECRET as string;
        
        // jwt.sign handles the 'exp' internally if you pass 'expiresIn'
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                userId: existingUser.userId,
                email: existingUser.email,
                userName: existingUser.userName,
                userType: existingUser.userType
            }
        });
    } catch (error: any) {
        next(error);
    }
};