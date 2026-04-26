import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Interface based on your controller logic
export interface ChatRoom {
  roomId: number;
  isPersistent: boolean;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * chatRoomApi: Manages recovery chat room metadata.
 * Access is primarily Admin-driven, with read access for Patients/Partners.
 */
export const chatRoomApi = createApi({
  reducerPath: 'chatRoomApi',
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
    
    // GET /chatroom - Restricted to Admin
    getAllChatRooms: builder.query<ChatRoom[], void>({
      query: () => 'chatroom',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ roomId }) => ({ type: 'ChatRoom' as const, id: roomId })),
              { type: 'ChatRoom', id: 'LIST' },
            ]
          : [{ type: 'ChatRoom', id: 'LIST' }],
    }),

    // GET /chatroom/:id - Accessible via allRoleAuth
    getChatRoomById: builder.query<ChatRoom, number>({
      query: (id) => `chatroom/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ChatRoom', id }],
    }),

    // POST /chatroom - Restricted to Admin
    createChatRoom: builder.mutation<ChatRoom, Omit<ChatRoom, 'roomId'>>({
      query: (newRoom) => ({
        url: 'chatroom',
        method: 'POST',
        body: newRoom,
      }),
      invalidatesTags: [{ type: 'ChatRoom', id: 'LIST' }],
    }),

    // PUT /chatroom/:id - Restricted to Admin
    updateChatRoom: builder.mutation<
      { message: string; data: ChatRoom }, 
      Partial<ChatRoom> & { roomId: number }
    >({
      query: ({ roomId, ...patch }) => ({
        url: `chatroom/${roomId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { roomId }) => [
        { type: 'ChatRoom', id: roomId },
        { type: 'ChatRoom', id: 'LIST' }
      ],
    }),

    // DELETE /chatroom/:id - Restricted to Admin
    deleteChatRoom: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `chatroom/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ChatRoom', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllChatRoomsQuery,
  useGetChatRoomByIdQuery,
  useCreateChatRoomMutation,
  useUpdateChatRoomMutation,
  useDeleteChatRoomMutation,
} = chatRoomApi;