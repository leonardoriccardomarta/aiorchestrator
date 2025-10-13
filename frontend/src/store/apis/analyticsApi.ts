import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

interface AnalyticsMetrics {
  conversations: {
    total: number;
    resolved: number;
    pending: number;
    avgResolutionTime: number;
  };
  channels: {
    name: string;
    conversations: number;
    responseRate: number;
  }[];
  timeline: {
    date: string;
    conversations: number;
    resolvedCount: number;
  }[];
  satisfaction: {
    excellent: number;
    good: number;
    neutral: number;
    poor: number;
  };
}

interface ChannelMetrics {
  id: string;
  name: string;
  metrics: {
    messageCount: number;
    responseTime: number;
    resolutionRate: number;
    customerSatisfaction: number;
  };
  trends: {
    date: string;
    value: number;
  }[];
}

interface ReportRequest {
  startDate: string;
  endDate: string;
  channels?: string[];
  metrics?: string[];
  format?: 'csv' | 'pdf' | 'json';
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/analytics',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMetrics: builder.query<AnalyticsMetrics, { timeRange: '7d' | '30d' | '90d' }>({
      query: ({ timeRange }) => `/metrics?range=${timeRange}`,
    }),
    getChannelMetrics: builder.query<ChannelMetrics[], void>({
      query: () => '/channels',
    }),
    getChannelDetails: builder.query<ChannelMetrics, string>({
      query: (channelId) => `/channels/${channelId}`,
    }),
    generateReport: builder.mutation<{ url: string }, ReportRequest>({
      query: (data) => ({
        url: '/reports/generate',
        method: 'POST',
        body: data,
      }),
    }),
    getRealTimeMetrics: builder.query<{
      activeUsers: number;
      activeConversations: number;
      messagesPerMinute: number;
    }, void>({
      query: () => '/realtime',
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;

          const ws = new WebSocket(
            `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
              window.location.host
            }/api/analytics/realtime/ws`
          );

          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            updateCachedData((draft) => {
              return { ...draft, ...data };
            });
          };

          await cacheEntryRemoved;
          ws.close();
        } catch {
          // Handle errors
        }
      },
    }),
    getCustomMetrics: builder.query<
      Record<string, number>,
      { metrics: string[]; timeRange: string }
    >({
      query: ({ metrics, timeRange }) =>
        `/custom?metrics=${metrics.join(',')}&range=${timeRange}`,
    }),
  }),
});

export const {
  useGetMetricsQuery,
  useGetChannelMetricsQuery,
  useGetChannelDetailsQuery,
  useGenerateReportMutation,
  useGetRealTimeMetricsQuery,
  useGetCustomMetricsQuery,
} = analyticsApi; 