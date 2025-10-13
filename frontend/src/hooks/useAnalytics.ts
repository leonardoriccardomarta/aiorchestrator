import { useState, useEffect } from 'react';

interface ChatbotEvent {
  eventName: string;
  properties: Record<string, unknown>;
  timestamp: number;
}
interface WeeklyData {
  date: string;
  total: number;
}
interface ChannelDistribution {
  name: string;
  value: number;
}
interface SentimentAnalysis {
  range: string;
  count: number;
}
interface TopIssue {
  category: string;
  value: number;
}
interface AnalyticsData {
  totalRevenue: number;
  totalConversations: number;
  averageResponseTime: number;
  overallSatisfaction: number;
  chatbots: ChatbotEvent[];
  weeklyData: WeeklyData[];
  channelDistribution: ChannelDistribution[];
  sentimentAnalysis: SentimentAnalysis[];
  topIssues: TopIssue[];
}

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Mock data for now
        const mockData: AnalyticsData = {
          totalRevenue: 125000,
          totalConversations: 15420,
          averageResponseTime: 2.3,
          overallSatisfaction: 4.8,
          chatbots: [
            { eventName: 'UserLogin', properties: { user: 'John' }, timestamp: Date.now() },
            { eventName: 'BotResponse', properties: { message: 'Hello' }, timestamp: Date.now() },
          ],
          weeklyData: [
            { date: '2024-07-01', total: 100 },
            { date: '2024-07-02', total: 120 },
          ],
          channelDistribution: [
            { name: 'Web', value: 60 },
            { name: 'Mobile', value: 40 },
          ],
          sentimentAnalysis: [
            { range: '0-1m', count: 10 },
            { range: '1-2m', count: 20 },
          ],
          topIssues: [
            { category: 'Login', value: 5 },
            { category: 'Payment', value: 3 },
          ],
        };
        setAnalyticsData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analyticsData, isLoading, error };
};