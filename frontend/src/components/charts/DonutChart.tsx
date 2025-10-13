import React from 'react';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  height?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = Math.min(height / 2 - 20, 80);
  const centerX = height / 2;
  const centerY = height / 2;

  let currentAngle = 0;

  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${height} ${height}`}>
        {data.map((item, index) => {
          const startAngle = currentAngle;
          const endAngle = currentAngle + (item.value / total) * 2 * Math.PI;
          currentAngle = endAngle;

          return (
            <g key={index}>
              <path
                d={createArc(startAngle, endAngle, radius)}
                fill="none"
                stroke={item.color}
                strokeWidth={radius * 0.3}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        
        {/* Center circle for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.7}
          fill="white"
        />
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-sm font-medium text-gray-900"
        >
          {total}%
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          className="text-xs text-gray-500"
        >
          Total
        </text>
      </svg>
    </div>
  );
}; 