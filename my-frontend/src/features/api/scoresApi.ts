import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type SupportAction, type CreateActionRequest } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const supportActionsApi = createApi({
  reducerPath: 'supportActionsApi',
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
  tagTypes: ['SupportAction'],
  endpoints: (builder) => ({
    // Fetch all logs of actions taken
    getActions: builder.query<SupportAction[], void>({
      query: () => 'actions',
      providesTags: ['SupportAction'],
    }),

    // Get a specific action log by ID
    getActionById: builder.query<SupportAction, number>({
      query: (id) => `actions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SupportAction', id }],
    }),

    // Log a new action (e.g., "Called user during high-risk event")
    createAction: builder.mutation<SupportAction, CreateActionRequest>({
      query: (newAction) => ({
        url: 'actions',
        method: 'POST',
        body: newAction,
      }),
      invalidatesTags: ['SupportAction'],
    }),

    // Update an existing action log
    updateAction: builder.mutation<SupportAction, { id: number; data: Partial<CreateActionRequest> }>({
      query: ({ id, data }) => ({
        url: `actions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'SupportAction', id }],
    }),

    // Delete an action log
    deleteAction: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `actions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportAction'],
    }),
  }),
});

export const {
  useGetActionsQuery,
  useGetActionByIdQuery,
  useCreateActionMutation,
  useUpdateActionMutation,
  useDeleteActionMutation,
} = supportActionsApi;