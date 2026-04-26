import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Existing recovery data interface
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

// Request interface for new logs
export interface CreateCheckinRequest {
  userId: number;
  cravings: number;
  control: number;
  selfEfficacy: number;
  consequences: boolean;
  copingUsed: boolean | string;
  notes: string;
}

// Consolidated response from the backend
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

// Updated interface to include the missing property
export interface CheckinStats {
  totalLogs: number;
  lastWeekCount: number;
  averageSelfEfficacy: number;
  userStreak: number;
  isTodayLogged: boolean;
  todayNote?: string;
  previousNote?: string;
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
        console.log('🔑 [checkinsApi]: Token attached to request');
      }
      return headers;
    },
  }),
  tagTypes: ['Checkin', 'User', 'RiskScore'],
  endpoints: (builder) => ({

    /**
     * GET /checkins/stats/:userId
     * Provides the summary data for the "Recovery Pulse" UI cards.
     */
    getCheckinStats: builder.query<CheckinStats, number>({
      query: (userId) => `checkins/stats/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Checkin', id: `STATS-${userId}` }],
      onQueryStarted: async (userId, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(`📊 [checkinsApi]: Stats fetched for User ${userId}`, data);
        } catch (err) {
          console.error('❌ [checkinsApi]: Failed to fetch stats', err);
        }
      }
    }),

    // GET /checkins - Admin system-wide overview
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

    // GET /checkins/:id - Specific log details
    getCheckinById: builder.query<Checkin, number>({
      query: (id) => `checkins/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Checkin', id }],
    }),

    /**
     * POST /checkins
     * Triggers backend logic for risk assessment and streak calculation.
     */
    createCheckin: builder.mutation<CreateCheckinResponse, CreateCheckinRequest>({
      query: (newCheckin) => ({
        url: 'checkins',
        method: 'POST',
        body: newCheckin,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        'Checkin',
        'User',
        'RiskScore',
        { type: 'Checkin', id: `STATS-${userId}` }
      ],
    }),

    // PUT /checkins/:id - Admin correction of logs
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

    // DELETE /checkins/:id - Admin only removal
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
  useGetCheckinStatsQuery,
  useGetAllCheckinsQuery,
  useGetCheckinByIdQuery, // Corrected from useGetGetCheckinByIdQuery
  useCreateCheckinMutation,
  useUpdateCheckinMutation,
  useDeleteCheckinMutation,
} = checkinsApi;