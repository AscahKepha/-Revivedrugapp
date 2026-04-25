import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import { type ChatRoom, type CreateChatRoomRequest } from '../../types/index';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const chatRoomsApi = createApi({
  reducerPath: 'chatRoomsApi',
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
  tagTypes: ['ChatRoom'],
  endpoints: (builder) => ({
    // Fetch all available chat rooms
    getChatRooms: builder.query<ChatRoom[], void>({
      query: () => 'chatrooms',
      providesTags: ['ChatRoom'],
    }),

    // Get details for a specific room
    getChatRoomById: builder.query<ChatRoom, number>({
      query: (id) => `chatrooms/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ChatRoom', id }],
    }),

    // Create a new chat room (e.g., for a specific support group)
    createChatRoom: builder.mutation<ChatRoom, CreateChatRoomRequest>({
      query: (newRoom) => ({
        url: 'chatrooms',
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: ['ChatRoom'],
    }),

    // Update room settings or description
    updateChatRoom: builder.mutation<ChatRoom, { id: number; data: Partial<CreateChatRoomRequest> }>({
      query: ({ id, data }) => ({
        url: `chatrooms/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'ChatRoom', id }],
    }),

    // Delete a chat room
    deleteChatRoom: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `chatrooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ChatRoom'],
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useGetChatRoomByIdQuery,
  useCreateChatRoomMutation,
  useUpdateChatRoomMutation,
  useDeleteChatRoomMutation,
} = chatRoomsApi;