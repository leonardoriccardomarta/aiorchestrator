import React, { forwardRef, useState } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { EyeIcon, EyeOffIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { inputVariants } from '../variants/input';


export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  helperText?: string;
  required?: boolean;
  optional?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type,
      label,
      error,
      success,
      warning,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      helperText,
      required,
      optional,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Determine variant based on validation state
    const effectiveVariant = error
      ? 'error'
      : success
      ? 'success'
      : warning
      ? 'warning'
      : variant;

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    const hasMessage = error || success || warning || helperText;

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
            {optional && <span className="ml-1 text-muted-foreground">(optional)</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant: effectiveVariant, size }),
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || effectiveVariant === 'error' || effectiveVariant === 'success' || effectiveVariant === 'warning') && 'pr-10',
              isFocused && 'ring-2 ring-offset-2',
              className
            )}
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              hasMessage ? (error ? errorId : helperTextId) : undefined
            }
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Validation icon */}
            {effectiveVariant === 'error' && (
              <AlertCircleIcon className="h-4 w-4 text-destructive" aria-hidden="true" />
            )}
            {effectiveVariant === 'success' && (
              <CheckCircleIcon className="h-4 w-4 text-green-500" aria-hidden="true" />
            )}
            {effectiveVariant === 'warning' && (
              <AlertCircleIcon className="h-4 w-4 text-yellow-500" aria-hidden="true" />
            )}

            {/* Password toggle */}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Custom right icon */}
            {rightIcon && !showPasswordToggle && (
              <div className="text-muted-foreground">{rightIcon}</div>
            )}
          </div>
        </div>

        {/* Helper text / Error message */}
        {hasMessage && (
          <p
            id={error ? errorId : helperTextId}
            className={cn(
              'text-xs',
              error && 'text-destructive',
              success && 'text-green-600',
              warning && 'text-yellow-600',
              !error && !success && !warning && 'text-muted-foreground'
            )}
            role={error ? 'alert' : undefined}
          >
            {error || success || warning || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };