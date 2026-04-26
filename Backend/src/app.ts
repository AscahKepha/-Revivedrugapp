import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";

// Router Imports
import { userRouter } from "./users/user.route";
import { ActionsRouter } from "./supportpartnersActions/partnerActions.route";
import { SupportPartnerRouter } from "./supportpartners/supportpartner.route";
import { RiskScoreRouter } from "./riskscores/score.route";
import { MessagesRouter } from "./messages/message.route";
import { CheckinsRouter } from "./checkins/checkins.route";
import { ChatRoomsRouter } from "./chatrooms/chatroom.route";
import { authRouter } from "./auth/auth.route";

const app: Application = express();

// 1. Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware);

// 2. Default Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Welcome to Drug-Revive API Backend With Drizzle ORM and Postgresql 🔥");
});

// 3. API Routes
app.use('/api', userRouter);
app.use('/api', ActionsRouter);
app.use('/api', SupportPartnerRouter);
app.use('/api', RiskScoreRouter);
app.use('/api', MessagesRouter);
app.use('/api', CheckinsRouter);
app.use('/api', ChatRoomsRouter);
app.use('/api/auth', authRouter);

/**
 * 4. 404 Route Handler
 * Explicitly removing the '*' or '(.*)' path. 
 * When no path is provided, Express 5 matches all requests that 
 * haven't been caught by previous routes.
 */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    });
});

/**
 * 5. Global Error Handling Middleware
 * Catch-all for all errors passed via next(error) from your controllers.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error for internal debugging
    console.error(`[Error] ${req.method} ${req.url}:`, message);

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        // Shows the stack trace only when you are in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;