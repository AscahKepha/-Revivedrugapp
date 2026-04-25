import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type BackendLoginResponse, type LoginCredentials, type RegisterCredentials } from "../../types/auth";
import { setCredentials } from "../auth/authSlice"; // Import your action
import type { RootState } from "../../app/store"; // We'll define this in the store file
 // We'll define this in the store file

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/auth", 
    prepareHeaders: (headers, { getState }) => {
      // Automatically attach Bearer token to all requests if it exists
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
      // Sync backend response with authSlice automatically
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
    registerUser: builder.mutation<any, RegisterCredentials>({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;