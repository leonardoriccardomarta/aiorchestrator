import { cva } from "class-variance-authority"

export const inputVariants = cva(
  [
    'flex w-full rounded-md border border-input bg-background px-3 py-2',
    'text-sm ring-offset-background file:border-0 file:bg-transparent',
    'file:text-sm file:font-medium placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-all duration-200 ease-in-out',
  ],
  {
    variants: {
      variant: {
        default: 'border-input focus-visible:ring-ring',
        error: 'border-destructive focus-visible:ring-destructive/50 bg-destructive/5',
        success: 'border-green-500 focus-visible:ring-green-500/50 bg-green-50/50',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500/50 bg-yellow-50/50',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2 py-1 text-xs',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)