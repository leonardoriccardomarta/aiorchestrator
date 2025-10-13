import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const loadingVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        spinner: 'animate-spin',
        dots: 'space-x-1',
        pulse: 'animate-pulse',
        skeleton: 'animate-pulse bg-gray-200 rounded',
      },
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      color: {
        primary: 'text-primary-600',
        secondary: 'text-gray-600',
        white: 'text-white',
        success: 'text-success-600',
        warning: 'text-warning-600',
        error: 'text-error-600',
      },
    },
    defaultVariants: {
      variant: 'spinner',
      size: 'md',
      color: 'primary',
    },
  }
);

export interface LoadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof loadingVariants> {
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ 
    className, 
    variant = 'spinner', 
    size = 'md', 
    color = 'primary',
    text,
    fullScreen = false,
    overlay = false,
    ...props 
  }, ref) => {
    const renderSpinner = () => (
      <svg
        className={cn(loadingVariants({ variant, size, color }))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const renderDots = () => (
      <div className={cn(loadingVariants({ variant, size, color }))}>
        <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    );

    const renderPulse = () => (
      <div className={cn(loadingVariants({ variant, size, color }), 'bg-current rounded-full')} />
    );

    const renderSkeleton = () => (
      <div className={cn(loadingVariants({ variant, size, color }), 'w-full h-full')} />
    );

    const renderContent = () => {
      switch (variant) {
        case 'dots':
          return renderDots();
        case 'pulse':
          return renderPulse();
        case 'skeleton':
          return renderSkeleton();
        case 'spinner':
        default:
          return renderSpinner();
      }
    };

    const content = (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          fullScreen && 'fixed inset-0 z-50 bg-white bg-opacity-90',
          overlay && 'absolute inset-0 z-40 bg-white bg-opacity-75',
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        {renderContent()}
        {text && (
          <p className="mt-2 text-sm text-gray-600 font-medium">
            {text}
          </p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    );

    return content;
  }
);

Loading.displayName = 'Loading';

// Specialized Loading Components
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <Loading
    variant="spinner"
    size="xl"
    color="primary"
    text={text}
    fullScreen
    className="bg-gray-50"
  />
);

export const CardLoading: React.FC<{ text?: string }> = ({ text }) => (
  <Loading
    variant="spinner"
    size="lg"
    color="secondary"
    text={text}
    className="py-8"
  />
);

export const ButtonLoading: React.FC<{ text?: string }> = ({ text }) => (
  <Loading
    variant="spinner"
    size="sm"
    color="white"
    text={text}
    className="inline-flex"
  />
);

export const SkeletonLoading: React.FC<{ 
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-gray-200 rounded animate-pulse',
          i === 0 ? 'w-3/4' : i === 1 ? 'w-1/2' : 'w-5/6'
        )}
      />
    ))}
  </div>
);

export const TableLoading: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              'h-4 bg-gray-200 rounded animate-pulse',
              colIndex === 0 ? 'w-32' : 'w-24'
            )}
          />
        ))}
      </div>
    ))}
  </div>
);
