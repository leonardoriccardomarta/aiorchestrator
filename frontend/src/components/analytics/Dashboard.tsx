import React from 'react';
import { Card, Title, AreaChart, DonutChart, BarChart } from '@tremor/react';
import { useQuery } from '@tanstack/react-query';
import { formatBytes } from '../../utils/formatBytes';
import { motion } from 'framer-motion';
import { fetchAnalytics } from '../../services/analytics';

interface AnalyticsData {
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

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 300000 // 5 minutes
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics</div>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Revenue Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <Title>Revenue Overview</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-gray-500">Current MRR</h3>
              <p className="text-2xl font-bold">${data.revenue.current.toLocaleString()}</p>
              <span className={`text-sm ${data.revenue.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.revenue.trend >= 0 ? '↑' : '↓'} {Math.abs(data.revenue.trend)}%
              </span>
            </div>
            {/* Add more revenue metrics */}
          </div>
          <AreaChart
            data={data.revenue.history}
            index="date"
            categories={["value"]}
            colors={["blue"]}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            yAxisWidth={60}
          />
        </Card>
      </motion.div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <Title>User Distribution</Title>
            <DonutChart
              data={data.users.byPlan}
              category="count"
              index="plan"
              valueFormatter={(value) => `${value.toLocaleString()} users`}
              colors={["blue", "cyan", "indigo"]}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <Title>User Metrics</Title>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-500">Total Users</h4>
                <p className="text-xl font-bold">{data.users.total.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-gray-500">Active Users</h4>
                <p className="text-xl font-bold">{data.users.active.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-gray-500">New Users</h4>
                <p className="text-xl font-bold">{data.users.new.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-gray-500">Churn Rate</h4>
                <p className="text-xl font-bold">{data.users.churn}%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Usage Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <Title>System Usage</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-gray-500">API Calls</h4>
              <p className="text-xl font-bold">{data.usage.apiCalls.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-gray-500">Storage Used</h4>
              <p className="text-xl font-bold">{formatBytes(data.usage.storage)}</p>
            </div>
            <div>
              <h4 className="text-gray-500">Bandwidth</h4>
              <p className="text-xl font-bold">{formatBytes(data.usage.bandwidth)}/s</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Feature Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <Title>Feature Usage</Title>
          <BarChart
            data={data.engagement.features}
            index="name"
            categories={["usage"]}
            colors={["blue"]}
            valueFormatter={(value) => value.toLocaleString()}
            yAxisWidth={48}
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard; 