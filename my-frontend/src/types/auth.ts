// src/types/Types.ts

/** * Matches the roleEnum defined in your Drizzle schema.
 * Included "user" as a fallback to prevent assignment errors.
 */
export type UserRole = "patient" | "support_partner" | "admin" | "user";

export interface BackendUser {
    userId: number; 
    userName: string; 
    email: string; 
    userType: UserRole; 
    contactPhone: string; 
    address: string | null; 
    streak_days: number;
    longest_streak: number;
    createdAt: string; 
    updatedAt: string;
    profile_picture?: string | null;
}

/**
 * Interface used for the Redux Auth State
 */
export interface UserProfile extends BackendUser {}

export interface BackendLoginResponse {
    token: string;
    user: BackendUser;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    userName: string;
    contactPhone: string;
    address: string;
}