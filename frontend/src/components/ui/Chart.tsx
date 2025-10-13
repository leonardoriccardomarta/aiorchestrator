import React from 'react';
import { cn } from '../../utils/cn';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  title?: string;
  height?: number;
  width?: number;
  className?: string;
  showLegend?: boolean;
  showValues?: boolean;
  animate?: boolean;
}

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export const Chart: React.FC<ChartProps> = ({
  data,
  type,
  title,
  height = 300,
  width = '100%',
  className,
  showLegend = true,
  showValues = true,
  animate = true,
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2">
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const color = item.color || colors[index % colors.length];
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative w-full">
              <div
                className={cn(
                  'w-full bg-gray-200 rounded-t',
                  animate && 'transition-all duration-1000 ease-out'
                )}
                style={{
                  height: `${percentage}%`,
                  backgroundColor: color,
                  transform: animate ? 'scaleY(0)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                }}
              />
              {showValues && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                  {item.value}
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = () => (
    <svg width="100%" height="100%" className="overflow-visible">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        points={data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value / maxValue) * 100);
          return `${x}%,${y}%`;
        }).join(' ')}
        className={animate ? 'animate-dash' : ''}
      />
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((item.value / maxValue) * 100);
        return (
          <circle
            key={index}
            cx={`${x}%`}
            cy={`${y}%`}
            r="4"
            fill="#3B82F6"
            className={animate ? 'animate-ping' : ''}
          />
        );
      })}
    </svg>
  );

  const renderPieChart = () => {
    let currentAngle = 0;
    const radius = 80;
    const centerX = 50;
    const centerY = 50;

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const color = item.color || colors[index % colors.length];
          
          const x1 = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          currentAngle += angle;

          return (
            <path
              key={index}
              d={pathData}
              fill={color}
              className={animate ? 'transition-all duration-1000 ease-out' : ''}
              style={{
                transform: animate ? 'scale(0)' : 'scale(1)',
                transformOrigin: 'center',
              }}
            />
          );
        })}
      </svg>
    );
  };

  const renderDoughnutChart = () => {
    let currentAngle = 0;
    const radius = 60;
    const innerRadius = 30;
    const centerX = 50;
    const centerY = 50;

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const color = item.color || colors[index % colors.length];
          
          const x1 = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
          
          const innerX1 = centerX + innerRadius * Math.cos((currentAngle * Math.PI) / 180);
          const innerY1 = centerY + innerRadius * Math.sin((currentAngle * Math.PI) / 180);
          const innerX2 = centerX + innerRadius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
          const innerY2 = centerY + innerRadius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${innerX1} ${innerY1}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${innerX2} ${innerY2}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
            'Z'
          ].join(' ');

          currentAngle += angle;

          return (
            <path
              key={index}
              d={pathData}
              fill={color}
              className={animate ? 'transition-all duration-1000 ease-out' : ''}
              style={{
                transform: animate ? 'scale(0)' : 'scale(1)',
                transformOrigin: 'center',
              }}
            />
          );
        })}
        {/* Center text */}
        <text x="50" y="45" textAnchor="middle" className="text-xs font-medium fill-gray-600">
          {total}
        </text>
        <text x="50" y="55" textAnchor="middle" className="text-xs fill-gray-500">
          Totale
        </text>
      </svg>
    );
  };

  const renderAreaChart = () => (
    <svg width="100%" height="100%" className="overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#areaGradient)"
        d={data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value / maxValue) * 100);
          return index === 0 ? `M ${x}%,${y}%` : `L ${x}%,${y}%`;
        }).join(' ') + ` L 100%,100% L 0%,100% Z`}
        className={animate ? 'transition-all duration-1000 ease-out' : ''}
        style={{
          opacity: animate ? 0 : 1,
        }}
      />
      <polyline
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        points={data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value / maxValue) * 100);
          return `${x}%,${y}%`;
        }).join(' ')}
        className={animate ? 'animate-dash' : ''}
      />
    </svg>
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      case 'doughnut':
        return renderDoughnutChart();
      case 'area':
        return renderAreaChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div
        className="relative"
        style={{ height, width }}
      >
        {renderChart()}
      </div>

      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              {showValues && (
                <span className="text-sm font-medium text-gray-900">
                  ({item.value})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart; 