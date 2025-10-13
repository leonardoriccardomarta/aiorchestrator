import { FC } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  areaColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const AreaChart: FC<AreaChartProps> = ({
  data,
  height = 350,
  areaColor = '#8b5cf6',
  gradientFrom = '#8b5cf6',
  gradientTo = '#8b5cf600',
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.3} />
            <stop offset="95%" stopColor={gradientTo} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
        <XAxis
          dataKey="name"
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
        <Area
          type="monotone"
          dataKey="value"
          stroke={areaColor}
          strokeWidth={2}
          fill="url(#colorGradient)"
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}; 