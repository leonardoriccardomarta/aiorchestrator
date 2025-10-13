import React, { forwardRef } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { LoaderIcon } from 'lucide-react';
import { buttonVariants } from '../variants/button';


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  tooltip?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      rounded,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      tooltip,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    const buttonContent = (
      <>
        {/* Loading spinner */}
        {loading && (
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        
        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        {/* Button text */}
        <span className={loading ? 'opacity-70' : ''}>
          {loading && loadingText ? loadingText : children}
        </span>
        
        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        
        {/* Ripple effect */}
        <span
          className="absolute inset-0 overflow-hidden rounded-inherit"
          aria-hidden="true"
        >
          <span className="absolute inset-0 rounded-inherit bg-white/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </span>
      </>
    );

    const buttonElement = (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-describedby={loading ? 'button-loading' : undefined}
        {...props}
      >
        {buttonContent}
        {loading && (
          <span id="button-loading" className="sr-only">
            Loading...
          </span>
        )}
      </Comp>
    );

    if (tooltip) {
      return (
        <div className="group relative">
          {buttonElement}
          <div
            role="tooltip"
            className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block dark:bg-gray-100 dark:text-gray-900"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
          </div>
        </div>
      );
    }

    return buttonElement;
  }
);

Button.displayName = 'Button';

export { Button };