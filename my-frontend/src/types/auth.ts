/**
 * Matches the roleEnum defined in your Drizzle schema.
 */
export type UserRole = "patient" | "support_partner" | "admin";

/**
 * The full user object structure as it exists in your PostgreSQL database
 * and as returned by your backend controllers.
 */
export interface BackendUser {
  userId: number;
  userName: string;
  email: string;
  userType: UserRole;
  partnerId?: number | null;
  contactPhone: string;
  address: string | null;
  profile_picture?: string;
  streak_days: number;
  longest_streak: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface used for the Redux Auth State.
 * CHANGED: Made checkins and riskScores optional (?) so they don't crash
 * the login process where this data is initially missing.
 */
export interface UserProfile extends BackendUser {
  checkins?: any[];   // Added ? and typed as array
  riskScores?: any[]; // Added ? and typed as array
}

/**
 * The standard response shape for both /login and /register endpoints.
 */
export interface BackendLoginResponse {
  token: string;
  user: BackendUser;
  message?: string;
}

/**
 * Credentials required for the Sign In flow.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Data required for the Registration flow.
 */
export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: UserRole;
  contactPhone: string;
  address: string;
  profile_picture?: string; 
}

/**
 * Error response structure for RTK Query error handling
 */
export interface AuthError {
  data: {
    message: string;
  };
  status: number;
}