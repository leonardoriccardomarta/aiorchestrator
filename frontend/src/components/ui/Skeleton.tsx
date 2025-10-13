import { FC } from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
    />
  );
};

export const SkeletonText: FC<SkeletonProps> = ({ className }) => {
  return <Skeleton className={cn('h-4 w-[250px]', className)} />;
};

export const SkeletonCircle: FC<SkeletonProps> = ({ className }) => {
  return <Skeleton className={cn('h-12 w-12 rounded-full', className)} />;
};

export const SkeletonButton: FC<SkeletonProps> = ({ className }) => {
  return <Skeleton className={cn('h-10 w-[100px]', className)} />;
};

export const SkeletonCard: FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <SkeletonText className="h-6 w-[180px]" />
      <SkeletonText className="h-4 w-[250px]" />
      <div className="space-y-3">
        <SkeletonText className="h-4 w-full" />
        <SkeletonText className="h-4 w-[80%]" />
        <SkeletonText className="h-4 w-[90%]" />
      </div>
    </div>
  );
}; 