import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type Message, type CreateMessageRequest } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    // Get all messages (General use or admin logs)
    getMessages: builder.query<Message[], void>({
      query: () => 'messages',
      providesTags: ['Message'],
    }),

    // Fetch messages for a specific room
    // Assuming your backend has a route like GET /messages/room/:roomId
    getMessagesByRoom: builder.query<Message[], number>({
      query: (roomId) => `messages/room/${roomId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ messagesId }) => ({ type: 'Message' as const, id: messagesId })), 'Message']
          : ['Message'],
    }),

    // Send a new message
    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (newMessage) => ({
        url: 'messages',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: ['Message'],
    }),

    // Update an existing message (Owner or Admin only)
    updateMessage: builder.mutation<Message, { id: number; message: string }>({
      query: ({ id, message }) => ({
        url: `messages/${id}`,
        method: 'PUT',
        body: { message },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Message', id }],
    }),

    // Delete a message
    deleteMessage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetMessagesByRoomQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;