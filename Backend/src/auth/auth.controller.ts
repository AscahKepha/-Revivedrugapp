import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createUserService, getUserByEmailService } from "./auth.service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log("📥 Registration attempt received:", req.body.email);
    try {
        const { firstName, lastName, email, password, contactPhone, address, role } = req.body;

        if (!firstName || !lastName || !email || !password || !contactPhone) {
            console.warn("⚠️ Registration failed: Missing fields");
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        console.log("🔍 Checking if user exists in DB...");
        const existingUser = await getUserByEmailService(email);

        if (existingUser) {
            console.warn("⚠️ Registration failed: Email already exists");
            res.status(409).json({ message: "User with this email already exists" });
            return;
        }

        const fullName = `${firstName} ${lastName}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            userName: fullName,
            email,
            password: hashedPassword,
            contactPhone,
            address: address || null,
            userType: role || "patient",
        };

        console.log("💾 Attempting to save new user to DB...");
        const newUser = await createUserService(userData);
        console.log("✅ User saved successfully:", newUser.userId);

        const payload = {
            userId: newUser.userId,
            email: newUser.email,
            userType: newUser.userType,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

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
        console.error("🔥 Registration Controller Error:", error);
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log("🔑 Login attempt received for:", email);

    try {
        console.log("🔍 Fetching user from DB...");
        // THIS IS LIKELY WHERE YOUR 500 ERROR IS TRIGGERED
        const existingUser = await getUserByEmailService(email);

        if (!existingUser) {
            console.warn("⚠️ Login failed: User not found");
            res.status(404).json({ message: "Invalid email or password" });
            return;
        }

        console.log("🔐 User found. Verifying password...");
        const isMatchPasswords = await bcrypt.compare(password, existingUser.password);
        if (!isMatchPasswords) {
            console.warn("⚠️ Login failed: Password mismatch");
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const payload = {
            userId: existingUser.userId,
            email: existingUser.email,
            userType: existingUser.userType,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        console.log("✅ Login successful for:", email);
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
        console.error("🔥 Login Controller Error Details:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        next(error);
    }
};