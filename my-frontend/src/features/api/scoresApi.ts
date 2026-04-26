import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Define the interface based on your riskScoreTable schema
export interface RiskScore {
  scoreId: number;
  userId: number;
  score: number;
  riskLevel: string;
  createdAt?: string;
  updatedAt?: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * riskScoreApi: Manages behavioral health risk assessments.
 * Access is controlled by adminRoleAuth and allRoleAuth.
 */
export const riskScoreApi = createApi({
  reducerPath: 'riskScoreApi',
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
  tagTypes: ['RiskScore'],
  endpoints: (builder) => ({
    
    // GET /riskscore - Restricted to Admin (System-wide monitoring)
    getAllRiskScores: builder.query<RiskScore[], void>({
      query: () => 'riskscore',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ scoreId }) => ({ type: 'RiskScore' as const, id: scoreId })),
              { type: 'RiskScore', id: 'LIST' },
            ]
          : [{ type: 'RiskScore', id: 'LIST' }],
    }),

    // GET /riskscore/:id - Accessible via allRoleAuth
    getRiskScoreById: builder.query<RiskScore, number>({
      query: (id) => `riskscore/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'RiskScore', id }],
    }),

    /**
     * GET /riskscore/user/:userId
     * Maps to getRiskScoreByUserId controller.
     * Useful for showing a specific user's score history.
     */
    getRiskScoresByUserId: builder.query<RiskScore[], number>({
      query: (userId) => `riskscore/user/${userId}`,
      providesTags: (result) => 
        result 
          ? [{ type: 'RiskScore', id: 'LIST' }] 
          : [],
    }),

    // PUT /riskscore/:id - Restricted to Admin
    updateRiskScore: builder.mutation<
      { message: string }, 
      Partial<RiskScore> & { scoreId: number }
    >({
      query: ({ scoreId, ...patch }) => ({
        url: `riskscore/${scoreId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { scoreId }) => [
        { type: 'RiskScore', id: scoreId },
        { type: 'RiskScore', id: 'LIST' }
      ],
    }),

    // DELETE /riskscore/:id - Restricted to Admin
    deleteRiskScore: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `riskscore/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'RiskScore', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllRiskScoresQuery,
  useGetRiskScoreByIdQuery,
  useGetRiskScoresByUserIdQuery,
  useUpdateRiskScoreMutation,
  useDeleteRiskScoreMutation,
} = riskScoreApi;