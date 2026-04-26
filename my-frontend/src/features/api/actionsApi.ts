import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type SupportAction, type CreateActionRequest } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * supportActionsApi: Manages support partner intervention logs.
 * Restricted by adminRoleAuth, supportPartnerRoleAuth, and allRoleAuth.
 */
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
    
    // GET /actions - Restricted to Admin
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

    // GET /actions/:id - Accessible via allRoleAuth
    getActionById: builder.query<SupportAction, number>({
      query: (id) => `actions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SupportAction', id }],
    }),

    // POST /actions - Restricted to Support Partner
    createAction: builder.mutation<string, CreateActionRequest>({
      query: (newAction) => ({
        url: 'actions',
        method: 'POST',
        body: newAction,
      }),
      // Invalidate the list so the new intervention shows up immediately
      invalidatesTags: [{ type: 'SupportAction', id: 'LIST' }],
    }),

    // PUT /actions/:id - Restricted to Support Partner
    updateAction: builder.mutation<string, { id: number; data: Partial<CreateActionRequest> }>({
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

    // DELETE /actions/:id - Restricted to Admin
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