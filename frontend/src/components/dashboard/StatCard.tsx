import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: {
    value: number;
    isPositive: boolean;
  };
  change?: string;
  period?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  change,
  period,
  className
}) => {
  return (
    <div className={cn(
      'card card-hover p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-blue-200',
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div className="flex-shrink-0">
          {icon}
        </div>
        
        {/* Trend Indicator */}
        <div className="flex items-center space-x-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success-600' : 'text-error-600'
            )}
          >
            {trend.isPositive ? '↗' : '↘'}
          </span>
          <span
            className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success-600' : 'text-error-600'
            )}
          >
            {Math.abs(trend.value)}%
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-sm font-medium text-gray-600 mt-1">
          {title}
        </p>
      </div>

      {/* Change and Period */}
      {(change || period) && (
        <div className="mt-4 flex items-center justify-between">
          {change && (
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-success-600' : 'text-error-600'
              )}
            >
              {change}
            </span>
          )}
          {period && (
            <span className="text-xs text-gray-500">
              {period}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              trend.isPositive ? 'bg-success-500' : 'bg-error-500'
            )}
            style={{
              width: `${Math.min(Math.abs(trend.value), 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard; 