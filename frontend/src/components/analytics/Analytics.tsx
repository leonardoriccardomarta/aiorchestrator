import React, { useState, useCallback } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Brush,
} from 'recharts';
import {
  ConversationTrend,
  UserEngagement,
  BotPerformance,
} from '../../types';

const COLORS = {
  blue: '#3B82F6',
  red: '#EF4444',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  gray: '#6B7280',
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number; unit?: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<'total' | 'automated' | 'escalated'>('total');

  const trends: ConversationTrend[] = [
    { date: '2024-03-01', total: 150, automated: 120, escalated: 30 },
    { date: '2024-03-02', total: 180, automated: 150, escalated: 30 },
    { date: '2024-03-03', total: 200, automated: 170, escalated: 30 },
    { date: '2024-03-04', total: 220, automated: 190, escalated: 30 },
    { date: '2024-03-05', total: 250, automated: 220, escalated: 30 },
  ];

  const engagement: UserEngagement = {
    byChannel: [
      { name: 'Website', value: 45 },
      { name: 'Mobile App', value: 30 },
      { name: 'Social Media', value: 15 },
      { name: 'Email', value: 10 },
    ],
    sessionDuration: [
      { range: '0-1 min', count: 100 },
      { range: '1-5 min', count: 250 },
      { range: '5-15 min', count: 150 },
      { range: '15+ min', count: 50 },
    ],
  };

  const performance: BotPerformance = {
    responseTime: [
      { range: '0-2s', count: 300 },
      { range: '2-5s', count: 200 },
      { range: '5-10s', count: 100 },
      { range: '10s+', count: 50 },
    ],
    resolutionRate: [
      { category: 'Resolved', value: 75, color: COLORS.green },
      { category: 'Escalated', value: 15, color: COLORS.yellow },
      { category: 'Abandoned', value: 10, color: COLORS.red },
    ],
  };

  const handleMetricClick = useCallback((metric: 'total' | 'automated' | 'escalated') => {
    setSelectedMetric(metric);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Monitor your chatbot's performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
          {(['24h', '7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Conversation Trends */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conversation Trends</h2>
            <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
              {[
                { key: 'total', label: 'Total', color: COLORS.gray },
                { key: 'automated', label: 'Automated', color: COLORS.blue },
                { key: 'escalated', label: 'Escalated', color: COLORS.red },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => handleMetricClick(key as 'total' | 'automated' | 'escalated')}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    selectedMetric === key
                      ? 'bg-white shadow font-medium'
                      : 'hover:bg-white'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }}></span>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trends}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={
                    selectedMetric === 'total'
                      ? COLORS.gray
                      : selectedMetric === 'automated'
                      ? COLORS.blue
                      : COLORS.red
                  }
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'white', strokeWidth: 2 }}
                />
                <Brush 
                  dataKey="date" 
                  height={30} 
                  stroke={COLORS.blue}
                  fill="#F3F4F6"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Performance */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Channel Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagement.byChannel}
                margin={{ top: 20, right: 50, left: 80, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={70}
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill={COLORS.blue}
                  radius={[0, 4, 4, 0]}
                  label={{ 
                    position: 'right', 
                    fill: '#6B7280',
                    formatter: (value: number) => `${value}%`
                  }}
                  unit="%"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Response Time Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performance.responseTime}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="range"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS.purple}
                  radius={[4, 4, 0, 0]}
                  name="Responses"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Resolution Rate</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
                <Pie
                  data={performance.resolutionRate}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill={performance.resolutionRate[index].color}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="text-sm font-medium"
                      >
                        {`${value}%`}
                      </text>
                    );
                  }}
                >
                  {performance.resolutionRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  wrapperStyle={{
                    paddingLeft: '20px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Session Duration */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Session Duration</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagement.sessionDuration}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="range"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={COLORS.green}
                  radius={[4, 4, 0, 0]}
                  name="Sessions"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-sm font-medium text-gray-500">Total Conversations</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {trends.reduce((sum, t) => sum + t.total, 0)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                +{Math.round((trends[trends.length - 1].total - trends[0].total) / trends[0].total * 100)}% vs previous
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-sm font-medium text-gray-500">Automation Rate</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {Math.round(trends.reduce((sum, t) => sum + t.automated, 0) / trends.reduce((sum, t) => sum + t.total, 0) * 100)}%
              </p>
              <p className="text-sm text-green-600 mt-1">
                Target: 85%
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
              <p className="text-2xl font-bold text-yellow-600 mt-1">1.8s</p>
              <p className="text-sm text-yellow-600 mt-1">
                -0.3s vs previous
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-sm font-medium text-gray-500">User Satisfaction</h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">4.5/5</p>
              <p className="text-sm text-purple-600 mt-1">
                +0.2 vs previous
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 