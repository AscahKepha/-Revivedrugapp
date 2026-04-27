import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type SupportAction, type CreateActionRequest } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * supportActionsApi: Manages support partner intervention logs.
 * Synchronized with 'ActionsRouter' mounted at /api/actions in the backend.
 */
export const supportActionsApi = createApi({
  reducerPath: 'supportActionsApi',
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
  tagTypes: ['SupportAction'],
  endpoints: (builder) => ({

    /**
     * GET /api/actions
     * Fetches historical interventions. 
     * Backend handles role-based filtering (Admin vs Partner vs Patient).
     */
    getActions: builder.query<SupportAction[], void>({
      query: () => 'actions',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ actionId }) => ({ type: 'SupportAction' as const, id: actionId })),
            { type: 'SupportAction', id: 'LIST' },
          ]
          : [{ type: 'SupportAction', id: 'LIST' }],
    }),

    /**
     * GET /api/actions/:id
     */
    getActionById: builder.query<SupportAction, number>({
      query: (id) => `actions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SupportAction', id }],
    }),

    /**
     * POST /api/actions
     * Logs a new intervention note.
     * Invalidates 'LIST' to force the ActionCenter history to refresh.
     */
    createAction: builder.mutation<{ message: string; data: SupportAction }, CreateActionRequest>({
      query: (newAction) => ({
        url: 'actions',
        method: 'POST',
        body: newAction,
      }),
      invalidatesTags: [{ type: 'SupportAction', id: 'LIST' }],
    }),

    /**
     * PUT /api/actions/:id
     */
    updateAction: builder.mutation<
      { message: string; data: SupportAction },
      { id: number; data: Partial<CreateActionRequest> }
    >({
      query: ({ id, data }) => ({
        url: `actions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SupportAction', id },
        { type: 'SupportAction', id: 'LIST' }
      ],
    }),

    /**
     * DELETE /api/actions/:id
     */
    deleteAction: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `actions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SupportAction', id: 'LIST' }],
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