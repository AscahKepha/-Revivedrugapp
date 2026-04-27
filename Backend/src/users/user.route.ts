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

/**
 * User Management Routes
 * Access: allRoleAuth allows Admins, Partners, and Patients to view directories/profiles.
 */

// URL: GET /api/users
// Used by Support Partners to see the "All Patients" list
userRouter.get('/', allRoleAuth, getUsersController);

// URL: GET /api/users/:id
// Used by Support Partners to view a specific "Clinical Profile"
userRouter.get('/:id', allRoleAuth, getUserByIdController);

// URL: POST /api/users
// Restricted to Admin for account creation
userRouter.post('/', adminRoleAuth, createUserController);

// URL: PUT /api/users/:id
// allRoleAuth: Allows users to update their own profiles or admins to manage them
userRouter.put('/:id', allRoleAuth, updateUserController);

// URL: DELETE /api/users/:id
// Restricted to Admin only
userRouter.delete('/:id', adminRoleAuth, deleteUserController);

/**
 * Custom Actions
 */

// URL: PATCH /api/users/:id/checkin
userRouter.patch('/:id/checkin', allRoleAuth, handleUserCheckIn);

export default userRouter;