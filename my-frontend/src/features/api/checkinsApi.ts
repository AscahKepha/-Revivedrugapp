import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Interface based on your checkinTable schema
export interface Checkin {
  checkinId: number;
  userId: number;
  cravings: number;
  control: number;
  selfEfficacy: number;
  consequences: boolean;
  copingUsed: string;
  notes: string;
  createdAt?: string;
}

// Request interface for the POST body
export interface CreateCheckinRequest {
  userId: number;
  cravings: number;
  control: number;
  selfEfficacy: number;
  consequences: boolean;
  copingUsed: string;
  notes: string;
}

// Response interface for the consolidated create response
export interface CreateCheckinResponse {
  message: string;
  streakMessage: string;
  riskStatus: string;
  data: Checkin;
  metrics: {
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

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
  tagTypes: ['Checkin', 'User', 'RiskScore'],
  endpoints: (builder) => ({
    
    // GET /checkins - Admin only
    getAllCheckins: builder.query<Checkin[], void>({
      query: () => 'checkins',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ checkinId }) => ({ type: 'Checkin' as const, id: checkinId })),
              { type: 'Checkin', id: 'LIST' },
            ]
          : [{ type: 'Checkin', id: 'LIST' }],
    }),

    // GET /checkins/:id - Patients or Partners
    getCheckinById: builder.query<Checkin, number>({
      query: (id) => `checkins/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Checkin', id }],
    }),

    /**
     * POST /checkins - The core "Daily Check-in" action
     * This triggers risk score calculation and streak increments on the backend.
     */
    createCheckin: builder.mutation<CreateCheckinResponse, CreateCheckinRequest>({
      query: (newCheckin) => ({
        url: 'checkins',
        method: 'POST',
        body: newCheckin,
      }),
      // We invalidate User and RiskScore because this call updates those tables too!
      invalidatesTags: ['Checkin', 'User', 'RiskScore'],
    }),

    // PUT /checkins/:id - Admin only
    updateCheckin: builder.mutation<{ checkin: string }, Partial<Checkin> & { checkinId: number }>({
      query: ({ checkinId, ...patch }) => ({
        url: `checkins/${checkinId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { checkinId }) => [
        { type: 'Checkin', id: checkinId },
        { type: 'Checkin', id: 'LIST' }
      ],
    }),

    // DELETE /checkins/:id - Admin only
    deleteCheckin: builder.mutation<{ checkin: string }, number>({
      query: (id) => ({
        url: `checkins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Checkin', id: 'LIST' }],
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