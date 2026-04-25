import express, {Application, Response } from "express";

import { logger } from "./middleware/logger";
import { userRouter } from "./users/user.route";
import { ActionsRouter } from "./supportpartnersActions/partnerActions.route";
import { SupportPartnerRouter } from "./supportpartners/supportpartner.route";
import { RiskScoreRouter } from "./riskscores/score.route";
import { MessagesRouter } from "./messages/message.route";
import { CheckinsRouter } from "./checkins/checkins.route";
import { ChatRoomsRouter } from "./chatrooms/chatroom.route";
import { authRouter } from "./auth/auth.route";

import cors from "cors";
import { rateLimiterMiddleware} from "./middleware/rateLimiter";

const app: Application = express();

//Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware)

//default route
app.get('/', (req, res: Response) => { //req contains the request info while res contains the response from express
    res.send("Welcome to Express Api Backend With Drizzle ORM and Postgresql")
})

//routes
app.use('/api', userRouter)
app.use('/api', ActionsRouter)
app.use('/api', SupportPartnerRouter)
app.use('/api', RiskScoreRouter)
app.use('/api', MessagesRouter)
app.use('/api', CheckinsRouter)
app.use('/api', ChatRoomsRouter)
app.use('/api/auth', authRouter)

export default app;
