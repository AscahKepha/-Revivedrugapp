import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUserService, getUserByEmailService } from "./auth.service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password, contactPhone, address, role } = req.body;

        // 1. Validation based on your Drizzle schema and Frontend requirements
        if (!firstName || !lastName || !email || !password || !contactPhone) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        // 2. Check if user already exists
        const existingUser = await getUserByEmailService(email);
        if (existingUser) {
            res.status(409).json({ message: "User with this email already exists" });
            return;
        }

        // 3. Prepare data for Drizzle Table
        // Combining names to match the 'userName' column in your schema
        const fullName = `${firstName} ${lastName}`;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            userName: fullName,
            email,
            password: hashedPassword,
            contactPhone,
            address: address || null,
            userType: role || "patient", // Matches roleEnum in your schema
        };

        // 4. Save to Database
        const newUser = await createUserService(userData);

        // 5. Generate Token so they are logged in immediately after registration
        const payload = {
            userId: newUser.userId,
            email: newUser.email,
            userType: newUser.userType,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // 6. Response (matches BackendLoginResponse type on frontend)
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                userId: newUser.userId,
                userName: newUser.userName,
                email: newUser.email,
                userType: newUser.userType,
                contactPhone: newUser.contactPhone,
                address: newUser.address
            }
        });
    } catch (error: any) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const existingUser = await getUserByEmailService(email);
        
        if (!existingUser) {
            res.status(404).json({ message: "Invalid email or password" });
            return;
        }

        const isMatchPasswords = await bcrypt.compare(password, existingUser.password);
        if (!isMatchPasswords) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const payload = {
            userId: existingUser.userId,
            email: existingUser.email,
            userType: existingUser.userType,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            token,
            user: {
                userId: existingUser.userId,
                userName: existingUser.userName,
                email: existingUser.email,
                userType: existingUser.userType,
                contactPhone: existingUser.contactPhone,
                address: existingUser.address
            }
        });
    } catch (error: any) {
        next(error);
    }
};