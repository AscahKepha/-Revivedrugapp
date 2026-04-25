import { Router } from "express";
import { 
    getUsersController, 
    getUserByIdController, 
    createUserController, 
    deleteUserController, 
    updateUserController 
} from "./user.controller";
//  Ensure 'supportPartnerRoleAuth' matches the exact export name in bearAuth.ts
import { 
    adminRoleAuth, 
    patientRoleAuth, 
    supportPartnerRoleAuth, 
    allRoleAuth 
} from "../middleware/bearAuth";

export const userRouter = Router();

// Fixed typo from '/uers' to '/users'
// Only Admins should be able to list all users
userRouter.get('/users', adminRoleAuth, getUsersController);

// Individuals or Admins can view a profile
userRouter.get('/users/:id', allRoleAuth, getUserByIdController);

// Usually, creating a user is via /register, but if this is an admin tool:
userRouter.post('/users', adminRoleAuth, createUserController);

// Users can update their own info or Admins can assist
userRouter.put('/users/:id', allRoleAuth, updateUserController);

// Only Admins should be allowed to delete accounts
userRouter.delete('/users/:id', adminRoleAuth, deleteUserController);