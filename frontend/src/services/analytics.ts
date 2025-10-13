export interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    trend: number;
    history: Array<{
      date: string;
      value: number;
    }>;
  };
  users: {
    total: number;
    active: number;
    new: number;
    churn: number;
    byPlan: Array<{
      plan: string;
      count: number;
    }>;
  };
  usage: {
    apiCalls: number;
    storage: number;
    bandwidth: number;
  };
  engagement: {
    dailyActiveUsers: number;
    averageSessionTime: number;
    features: Array<{
      name: string;
      usage: number;
    }>;
  };
}

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  // Mock implementation
  return {
    revenue: {
      current: 50000,
      previous: 45000,
      trend: 11,
      history: [
        { date: '2024-07-01', value: 40000 },
        { date: '2024-07-02', value: 42000 },
        { date: '2024-07-03', value: 45000 },
        { date: '2024-07-04', value: 47000 },
        { date: '2024-07-05', value: 50000 },
      ],
    },
    users: {
      total: 1200,
      active: 900,
      new: 100,
      churn: 5,
      byPlan: [
        { plan: 'Free', count: 800 },
        { plan: 'Pro', count: 300 },
        { plan: 'Enterprise', count: 100 },
      ],
    },
    usage: {
      apiCalls: 100000,
      storage: 1024 * 1024 * 1024 * 2, // 2GB
      bandwidth: 1024 * 1024 * 500, // 500MB/s
    },
    engagement: {
      dailyActiveUsers: 700,
      averageSessionTime: 15,
      features: [
        { name: 'Chat', usage: 500 },
        { name: 'Analytics', usage: 200 },
        { name: 'Integrations', usage: 100 },
      ],
    },
  };
};