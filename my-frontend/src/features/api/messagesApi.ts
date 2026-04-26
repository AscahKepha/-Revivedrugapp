import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Interface based on messagesTable and controller logic
export interface Message {
  messageId: number;
  roomId: number;
  userId: number;
  message: string;
  sender: 'admin' | 'patient' | 'support_partner'; // Based on your auth role logic
  createdAt?: string;
  updatedAt?: string;
}

// Interface for creating a new message
export interface CreateMessageRequest {
  roomId: number;
  message: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * messagesApi: Manages chat messages within recovery rooms.
 * Aligns with MessagesRouter and bearAuth logic.
 */
export const messagesApi = createApi({
  reducerPath: 'messagesApi',
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
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    
    // GET /messages - Restricted to Admin
    getAllMessages: builder.query<Message[], void>({
      query: () => 'messages',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ messageId }) => ({ type: 'Message' as const, id: messageId })),
              { type: 'Message', id: 'LIST' },
            ]
          : [{ type: 'Message', id: 'LIST' }],
    }),

    // GET /messages/:id - Accessible via allRoleAuth
    getMessageById: builder.query<Message, number>({
      query: (id) => `messages/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Message', id }],
    }),

    /**
     * POST /messages - Send a message (allRoleAuth)
     * Backend automatically extracts userId and sender role from the token.
     */
    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (newMessage) => ({
        url: 'messages',
        method: 'POST',
        body: newMessage,
      }),
      // Invalidate the LIST so any active chat windows refresh to show the new message
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),

    // PUT /messages/:id - Edit a message (allRoleAuth - owner/admin only check in backend)
    updateMessage: builder.mutation<{ message: Message }, { messageId: number; message: string }>({
      query: ({ messageId, message }) => ({
        url: `messages/${messageId}`,
        method: 'PUT',
        body: { message },
      }),
      invalidatesTags: (_result, _error, { messageId }) => [
        { type: 'Message', id: messageId },
        { type: 'Message', id: 'LIST' }
      ],
    }),

    // DELETE /messages/:id - Restricted to Admin
    deleteMessage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllMessagesQuery,
  useGetMessageByIdQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;