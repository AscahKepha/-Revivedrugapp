import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import type { UserProfile } from '../../types/auth';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * userApi: Dedicated to User Management & Profile Actions
 */
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      // Pull token from auth state for bearAuth middleware
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    
    /**
     * GET /users
     * - Admin: Returns all users.
     * - Support Partner: Returns assigned patients.
     */
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

    // GET /users/:id - Accessible by User, Partner, or Admin
    getUserById: builder.query<UserProfile, number>({
      query: (userId) => `users/${userId}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // POST /users - Create User (Admin only)
    createNewUserByAdmin: builder.mutation<{ message: string }, Partial<UserProfile>>({
      query: (userData) => ({
        url: 'users', 
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PUT /users/:id - Update profile
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

    // DELETE /users/:id - Admin only
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // PATCH /users/:id/checkin - Streak Increment
    performCheckIn: builder.mutation<{ message: string; currentStreak: number }, number>({
      query: (userId) => ({
        url: `users/${userId}/checkin`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' } // Invalidates list to refresh streak counts in UI
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