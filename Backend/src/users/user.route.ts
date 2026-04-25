import { Router } from "express";
import { 
    getUsersController, 
    getUserByIdController, 
    createUserController, 
    deleteUserController, 
    updateUserController,
    handleUserCheckIn
} from "./user.controller";

import { 
    adminRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const userRouter = Router();

// Retrieve all users - restricted to Admin
userRouter.get('/users', adminRoleAuth, getUsersController);

// Get a specific user profile by ID - accessible by the user themselves or Admin
userRouter.get('/users/:id', allRoleAuth, getUserByIdController);

// Create a new user - restricted to Admin (standard registration usually goes through auth routes)
userRouter.post('/users', adminRoleAuth, createUserController);

// Update user details - accessible by the user or Admin
userRouter.put('/users/:id', allRoleAuth, updateUserController);

// Delete a user - restricted to Admin
userRouter.delete('/users/:id', adminRoleAuth, deleteUserController);

/**
 * Custom Actions
 */

// Increment streak when a user completes a daily check-in
// Usually accessible by patients or all authenticated roles
userRouter.patch('/users/:id/checkin', allRoleAuth, handleUserCheckIn);

export default userRouter;