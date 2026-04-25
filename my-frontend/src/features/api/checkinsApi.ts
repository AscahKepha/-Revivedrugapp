import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type Checkin, type CreateCheckinRequest, type CheckinResponse } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const checkinsApi = createApi({
  reducerPath: 'checkinsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Checkin', 'User'], // 'User' tag helps refresh streaks on the UI
  endpoints: (builder) => ({

    // Get all checkins (For Admin Dashboard)
    getAllCheckins: builder.query<Checkin[], void>({
      query: () => 'checkins',
      providesTags: ['Checkin'],
    }),

    // Get a specific checkin by ID
    getCheckinById: builder.query<Checkin, number>({
      query: (id) => `checkins/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Checkin', id }],
    }),

    // The Main Check-in Action
    createCheckin: builder.mutation<CheckinResponse, CreateCheckinRequest>({
      query: (newCheckin) => ({
        url: 'checkins',
        method: 'POST',
        body: newCheckin,
      }),
      // This invalidates 'User' so the streak count updates on the Profile/Dashboard
      invalidatesTags: ['Checkin', 'User'],
    }),

    // Update a checkin
    updateCheckin: builder.mutation<Checkin, { id: number; data: Partial<CreateCheckinRequest> }>({
      query: ({ id, data }) => ({
        url: `checkins/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Checkin', id }, 'Checkin'],
    }),

    // Delete a checkin
    deleteCheckin: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `checkins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Checkin'],
    }),
  }),
});

export const {
  useGetAllCheckinsQuery,
  useGetCheckinByIdQuery,
  useCreateCheckinMutation,
  useUpdateCheckinMutation,
  useDeleteCheckinMutation,
} = checkinsApi;