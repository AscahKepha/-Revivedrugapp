import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type BackendLoginResponse, type LoginCredentials, type RegisterCredentials } from "../../types/auth";
import { setCredentials } from "../auth/authSlice"; 
import type { RootState } from "../../app/store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // Updated port to 5000 as requested
    baseUrl: "http://localhost:5000/api/auth", 
    prepareHeaders: (headers, { getState }) => {
      // Automatically attach Bearer token to all requests if it exists in Redux state
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Login Mutation
    loginUser: builder.mutation<BackendLoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      // Automatically syncs state on success
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (error) {
          console.error("Login sync failed:", error);
        }
      },
    }),

    // Register Mutation
    registerUser: builder.mutation<BackendLoginResponse, RegisterCredentials>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      // Added automatic login after successful registration
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch (error) {
          console.error("Registration sync failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;