import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile, type UserRole } from "../../types/auth";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  userType: UserRole | null;
}

// Helper to safely parse localStorage
const getStoredUser = (): UserProfile | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  userType: (localStorage.getItem("userType") as UserRole) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called automatically by authApi (via onQueryStarted) 
     * on successful Login or Registration.
     */
    setCredentials: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.userType = user.userType;

      // Persistence Layer
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", user.userType);
    },

    /**
     * Clears all auth data. Use this for Logout buttons.
     */
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;

      // Wipe persistence
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;