import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Metric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface ChartData {
  name: string;
  value: number;
}

const defaultMetrics: Metric[] = [
  { id: '1', label: 'Total Users', value: 1234, change: 12, trend: 'up' },
  { id: '2', label: 'Active Chatbots', value: 45, change: 5, trend: 'up' },
  { id: '3', label: 'Messages Today', value: 8765, change: -2, trend: 'down' },
  { id: '4', label: 'Response Rate', value: 98, change: 0, trend: 'neutral' },
];

const defaultChartData: ChartData[] = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 200 },
  { name: 'Sun', value: 300 },
];

const DashboardMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const [chartData, setChartData] = useState<ChartData[]>(defaultChartData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data.metrics);
        setChartData(data.chartData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Keep using default data
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate loading for a better UX
    setTimeout(() => {
      fetchMetrics();
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-gray-600 text-sm font-medium">{metric.label}</h3>
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold">{metric.value.toLocaleString()}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics; 