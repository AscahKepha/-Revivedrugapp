import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

// 1. Define the shape of your JWT payload
export type DecodedToken = {
    userId: number;
    email: string;
    userType: "admin" | "patient" | "support_partner"; 
    userName: string;
    exp: number;
};

// 2. Extend the Express Request type to include the user property
// This allows you to access req.user in your controllers without type errors
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

// 3. Authentication helper
export const verifyToken = (token: string, secret: string): DecodedToken | null => {
    try {
        return jwt.verify(token, secret) as DecodedToken;
    } catch (error) {
        return null;
    }
};

/**
 * 4. Core Authorization Middleware
 * Manages token extraction, verification, and role-based access control.
 */
export const authMiddleware = async (
    req: Request, 
    res: Response, 
    next: NextFunction, 
    requiredRole: "admin" | "patient" | "support_partner" | "all"
) => {
    const authHeader = req.header('Authorization');
    
    // Check if header exists
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    // Handle "Bearer <token>" format or raw token
    const parts = authHeader.split(" ");
    const token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : parts[0];

    // Verify Token
    const decodedToken = verifyToken(token, process.env.JWT_SECRET as string);

    if (!decodedToken) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userType = decodedToken.userType;

    // Role Authorization Logic
    // Access is granted if role matches OR if the endpoint is open to 'all' authenticated users
    const hasAccess = requiredRole === "all" || userType === requiredRole;

    if (hasAccess) {
        // SUCCESS: Assign decoded data to req.user for use in controllers
        req.user = decodedToken; 
        return next(); // Return here to ensure no further code in this function runs
    } 

    // FAILURE: Correct role not found
    return res.status(403).json({ 
        error: `Forbidden: This resource requires ${requiredRole} privileges.` 
    });
};

/**
 * 5. Role-specific wrappers
 * These are used in your router files (e.g., router.get('/', adminRoleAuth, controller))
 */
export const adminRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "admin");

export const patientRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "patient");

export const supportPartnerRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "support_partner");

export const allRoleAuth = (req: Request, res: Response, next: NextFunction) => 
    authMiddleware(req, res, next, "all");