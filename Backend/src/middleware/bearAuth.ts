import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// Define the shape of your JWT payload
export type DecodedToken = {
    userId: number;
    email: string;
    userType: "admin" | "patient" | "support_partner"; // Strict typing from your schema
    userName: string;
    exp: number;
};

// Extend the Express Request type to include the user
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

// Authentication helper
export const verifyToken = (token: string, secret: string): DecodedToken | null => {
    try {
        const decoded = jwt.verify(token, secret) as DecodedToken;
        return decoded;
    } catch (error) {
        return null;
    }
};

// Core Authorization Middleware
export const authMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction, 
    requiredRole: "admin" | "patient" | "support_partner" | "all"
) => {
    const authHeader = req.header('Authorization');
    
    // 1. Check if header exists
    if (!authHeader) {
        res.status(401).json({ error: "Authorization header is missing" });
        return;
    }

    // 2. Handle "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    // 3. Verify Token
    const decodedToken = verifyToken(token, process.env.JWT_SECRET as string);

    if (!decodedToken) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }

    const userType = decodedToken.userType;

    // 4. Role Authorization Logic
    const hasAccess = 
        requiredRole === "all" || 
        userType === requiredRole;

    if (hasAccess) {
        // FIX: Use single '=' for assignment, not '==='
        req.user = decodedToken; 
        next();
        return;
    } else {
        res.status(403).json({ error: "Forbidden: You do not have permission to access this resource" });
    }
};

// Role-specific wrappers
export const adminRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "admin");

export const patientRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "patient");

export const supportPartnerRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "support_partner");

export const allRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "all");