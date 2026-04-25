import { Router } from "express";
import { createUser, loginUser } from "./auth.controller";

export const authRouter = Router();

// Routes for User Registration and Login
// Note: If you mount this router at '/api/auth' in index.ts, 
// these will be accessible at /api/auth/register and /api/auth/login
authRouter.post('/register', createUser);
authRouter.post('/login', loginUser);