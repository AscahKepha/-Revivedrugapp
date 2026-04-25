import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type SupportPartner, type CreatePartnerRequest } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const partnerApi = createApi({
  reducerPath: 'partnerApi',
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
  tagTypes: ['Partner'],
  endpoints: (builder) => ({
    // Fetch all support partners (Admin view)
    getSupportPartners: builder.query<SupportPartner[], void>({
      query: () => 'partners',
      providesTags: ['Partner'],
    }),

    // Get partners for a specific user
    // Assumes your backend has a route like GET /partners/user/:userId
    getPartnersByUserId: builder.query<SupportPartner[], number>({
      query: (userId) => `partners/user/${userId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ partnerId }) => ({ type: 'Partner' as const, id: partnerId })), 'Partner']
          : ['Partner'],
    }),

    // Add a new support partner
    createSupportPartner: builder.mutation<SupportPartner, CreatePartnerRequest>({
      query: (newPartner) => ({
        url: 'partners',
        method: 'POST',
        body: newPartner,
      }),
      invalidatesTags: ['Partner'],
    }),

    // Update partner details (e.g., new phone number)
    updateSupportPartner: builder.mutation<SupportPartner, { id: number; data: Partial<CreatePartnerRequest> }>({
      query: ({ id, data }) => ({
        url: `partners/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Partner', id }],
    }),

    // Remove a support partner
    deleteSupportPartner: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `partners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetSupportPartnersQuery,
  useGetPartnersByUserIdQuery,
  useCreateSupportPartnerMutation,
  useUpdateSupportPartnerMutation,
  useDeleteSupportPartnerMutation,
} = partnerApi;