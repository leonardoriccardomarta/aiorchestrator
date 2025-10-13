import { FC } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface UsageMetric {
  timestamp: string;
  apiCalls: number;
  storageUsed: number;
  activeUsers: number;
}

interface UsageTrendsChartProps {
  data: UsageMetric[];
  title?: string;
  height?: number;
}

export const UsageTrendsChart: FC<UsageTrendsChartProps> = ({
  data,
  title = 'Usage Trends',
  height = 400,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="apiCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="storage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="timestamp"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#E5E7EB' }}
                labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="apiCalls"
                name="API Calls"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#apiCalls)"
              />
              <Area
                type="monotone"
                dataKey="storageUsed"
                name="Storage Used (GB)"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#storage)"
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#users)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 