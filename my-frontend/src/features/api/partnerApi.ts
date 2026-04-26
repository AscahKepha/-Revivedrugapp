import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Interface matching your supportpartnersTable and controller logic
export interface SupportPartner {
  partnerId: number;
  userId: number;
  partnerName: string;
  contactInfo: string;
  relationship: string;
  createdAt?: string;
  updatedAt?: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * supportPartnerApi: Manages the Support Partners assigned to patients.
 * Aligns with SupportPartnerRouter and SupportPartnerController.
 */
export const supportPartnerApi = createApi({
  reducerPath: 'supportPartnerApi',
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
  tagTypes: ['SupportPartner'],
  endpoints: (builder) => ({
    
    // GET /supportpartner - Restricted to Admin
    getSupportPartners: builder.query<SupportPartner[], void>({
      query: () => 'supportpartner',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ partnerId }) => ({ type: 'SupportPartner' as const, id: partnerId })),
              { type: 'SupportPartner', id: 'LIST' },
            ]
          : [{ type: 'SupportPartner', id: 'LIST' }],
    }),

    // GET /supportpartner/:id - Accessible via allRoleAuth
    getSupportPartnerById: builder.query<SupportPartner, number>({
      query: (id) => `supportpartner/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'SupportPartner', id }],
    }),

    // POST /supportpartner - Restricted to Patient (patientRoleAuth)
    createSupportPartner: builder.mutation<{ message: string }, Omit<SupportPartner, 'partnerId'>>({
      query: (newPartner) => ({
        url: 'supportpartner',
        method: 'POST',
        body: newPartner,
      }),
      invalidatesTags: [{ type: 'SupportPartner', id: 'LIST' }],
    }),

    // PUT /supportpartner/:id - Restricted to Patient (patientRoleAuth)
    updateSupportPartner: builder.mutation<
      { message: string }, 
      Partial<SupportPartner> & { partnerId: number }
    >({
      query: ({ partnerId, ...patch }) => ({
        url: `supportpartner/${partnerId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { partnerId }) => [
        { type: 'SupportPartner', id: partnerId },
        { type: 'SupportPartner', id: 'LIST' }
      ],
    }),

    // DELETE /supportpartner/:id - Restricted to Admin
    deleteSupportPartner: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `supportpartner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SupportPartner', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetSupportPartnersQuery,
  useGetSupportPartnerByIdQuery,
  useCreateSupportPartnerMutation,
  useUpdateSupportPartnerMutation,
  useDeleteSupportPartnerMutation,
} = supportPartnerApi;