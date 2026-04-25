// src/redux/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile, type UserRole } from "../../types/auth"; // Import from source

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  userType: UserRole | null;
}

// Pull from localStorage so users stay logged in on refresh
const initialState: AuthState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  userType: (localStorage.getItem("userType") as UserRole) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userType = action.payload.user.userType;

      // Save to localStorage for persistence
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("userType", action.payload.user.userType);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;

      // Wipe localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;