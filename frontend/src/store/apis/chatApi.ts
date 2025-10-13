import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
}

interface SendMessageRequest {
  conversationId: string;
  content: string;
  metadata?: Record<string, unknown>;
}

interface CreateConversationRequest {
  title: string;
  initialMessage?: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/chat',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Conversation', 'Message'],
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/conversations',
      providesTags: ['Conversation'],
    }),
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/conversations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Conversation', id }],
    }),
    createConversation: builder.mutation<Conversation, CreateConversationRequest>({
      query: (data) => ({
        url: '/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversation'],
    }),
    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/conversations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversation'],
    }),
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: (data) => ({
        url: `/conversations/${data.conversationId}/messages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Conversation', id: conversationId },
      ],
    }),
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: (_result, _error, conversationId) => [
        { type: 'Conversation', id: conversationId },
        { type: 'Conversation', id: 'list' }
      ],
    }),
    streamMessage: builder.query<Message, SendMessageRequest>({
      query: (data) => ({
        url: `/conversations/${data.conversationId}/messages/stream`,
        method: 'POST',
        body: data,
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;

          const eventSource = new EventSource(
            `/api/chat/conversations/${arg.conversationId}/messages/stream`
          );

          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            updateCachedData((draft) => {
              return { ...draft, ...data };
            });
          };

          await cacheEntryRemoved;
          eventSource.close();
        } catch {
          // Handle errors
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useSendMessageMutation,
  useGetMessagesQuery,
  useStreamMessageQuery,
} = chatApi; 