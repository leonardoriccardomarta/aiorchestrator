import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  width,
  height,
  circle = false,
}) => {
  const baseStyle = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: circle ? '50%' : '4px',
  };

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`animate-pulse bg-gray-200 ${className} ${
              index !== count - 1 ? 'mb-2' : ''
            }`}
            style={baseStyle}
            data-testid="skeleton-loader"
          />
        ))}
    </>
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-3">
    {Array(lines)
      .fill(0)
      .map((_, index) => (
        <Skeleton
          key={index}
          width={`${Math.random() * 30 + 70}%`}
          className="rounded"
        />
      ))}
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="border rounded-lg p-4 shadow-sm">
    <Skeleton circle height={50} width={50} className="mb-4" />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-4">
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} height={30} />
        ))}
    </div>
    {Array(rows)
      .fill(0)
      .map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array(columns)
            .fill(0)
            .map((_, colIndex) => (
              <Skeleton key={colIndex} height={20} />
            ))}
        </div>
      ))}
  </div>
);

export default Skeleton; 