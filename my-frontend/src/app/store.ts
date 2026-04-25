import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

// Custom storage wrapper for SSR/Local compatibility
const storage = {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve(true);
  },
  removeItem: (key: string) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// Auth Reducer
import authReducer from "../features/auth/authSlice";

// APIs
import { userApi } from "../features/api/userApi";
import { checkinsApi } from "../features/api/checkinsApi";
import { chatRoomsApi } from "../features/api/chatroomApi";
import { messagesApi } from "../features/api/messagesApi";
import { partnerApi } from "../features/api/partnerApi";
import { supportActionsApi } from "../features/api/actionsApi";
// If you have a separate authApi for login/register, import it here:
import { authApi } from "../features/api/authApi";

// Persist config for Auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated", "userType"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    // API Reducers
    [userApi.reducerPath]: userApi.reducer,
    [checkinsApi.reducerPath]: checkinsApi.reducer,
    [chatRoomsApi.reducerPath]: chatRoomsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [partnerApi.reducerPath]: partnerApi.reducer,
    [supportActionsApi.reducerPath]: supportActionsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,

    // Persisted State
    auth: persistedAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid console warnings
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      userApi.middleware,
      checkinsApi.middleware,
      chatRoomsApi.middleware,
      messagesApi.middleware,
      partnerApi.middleware,
      supportActionsApi.middleware,
      // authApi.middleware
    ),
});

export const persistor = persistStore(store);

// Infer Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;