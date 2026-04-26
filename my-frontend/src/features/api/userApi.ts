import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import type { UserProfile } from '../../types/auth';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * userApi: Dedicated to User Management & Profile Actions
 * (Auth logic like Login/Register is handled in authApi)
 */
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // Pull token from the auth state to satisfy the backend's bearAuth middleware
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    
    // GET /users - Restricted to Admin (adminRoleAuth)
    getAllUsersProfiles: builder.query<UserProfile[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({ type: 'User' as const, id: userId })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // GET /users/:id - Accessible by User or Admin (allRoleAuth)
    getUserById: builder.query<UserProfile, number>({
      query: (userId) => `users/${userId}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // POST /users - Create User via Admin dashboard (adminRoleAuth)
    createNewUserByAdmin: builder.mutation<{ message: string }, Partial<UserProfile>>({
      query: (userData) => ({
        url: 'users', 
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PUT /users/:id - Update profile (allRoleAuth)
    updateUser: builder.mutation<
      { message: string }, 
      Partial<UserProfile> & { userId: number }
    >({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' }
      ],
    }),

    // DELETE /users/:id - Restricted to Admin (adminRoleAuth)
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PATCH /users/:id/checkin - Streak Increment (allRoleAuth)
    performCheckIn: builder.mutation<{ message: string; currentStreak: number }, number>({
      query: (userId) => ({
        url: `users/${userId}/checkin`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetAllUsersProfilesQuery,
  useGetUserByIdQuery,
  useCreateNewUserByAdminMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePerformCheckInMutation, 
} = userApi;