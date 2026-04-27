import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type UserProfile, type UserRole } from "../../types/auth";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  userType: UserRole | null;
}

const getStoredUser = (): UserProfile | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
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
    setCredentials: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.userType = user.userType;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", user.userType);
    },

    /**
     * Updates the user object in state and storage without touching the token.
     * Useful after profile updates or streak increments.
     */
    updateUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.userType = action.payload.userType;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("userType", action.payload.userType);
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
    }
  }
});

export const { setCredentials, updateUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;