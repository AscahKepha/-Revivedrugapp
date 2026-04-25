/** * Matches the roleEnum defined in your Drizzle schema.
 */
export type UserRole = "patient" | "support_partner" | "admin";

/**
 * The full user object structure as it exists in your PostgreSQL database
 * and as returned by your backend controllers.
 */
export interface BackendUser {
  userId: number; 
  userName: string; // Combined firstName and lastName from the frontend
  email: string; 
  userType: UserRole; 
  contactPhone: string; 
  address: string | null; 
  streak_days: number;
  longest_streak: number;
  createdAt: string; 
  updatedAt: string;
}

/**
 * Interface used for the Redux Auth State.
 * Using an alias here makes it easier to extend if the UI needs
 * extra local-only properties later.
 */
export interface UserProfile extends BackendUser {}

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
 * Note: These match the state variables used in your teal Signin component.
 */
export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: UserRole;
  contactPhone: string;
  address: string;
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