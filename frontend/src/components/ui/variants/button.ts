import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'relative overflow-hidden',
    // Smooth hover and active transitions
    'transform-gpu will-change-transform',
    'active:scale-95 hover:scale-105 transition-transform duration-150',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground shadow-sm',
          'hover:bg-primary/90 hover:shadow-md',
          'active:bg-primary/95',
          'focus-visible:ring-primary/50',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground shadow-sm',
          'hover:bg-destructive/90 hover:shadow-md',
          'active:bg-destructive/95',
          'focus-visible:ring-destructive/50',
        ],
        outline: [
          'border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground hover:border-accent',
          'active:bg-accent/50',
          'focus-visible:ring-primary/50',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm',
          'hover:bg-secondary/80 hover:shadow-md',
          'active:bg-secondary/90',
          'focus-visible:ring-secondary/50',
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
          'active:bg-accent/50',
          'focus-visible:ring-primary/50',
        ],
        link: [
          'text-primary underline-offset-4',
          'hover:underline focus-visible:ring-primary/50',
          'active:text-primary/80',
        ],
        gradient: [
          'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg',
          'hover:from-primary/90 hover:to-primary/70 hover:shadow-xl',
          'active:from-primary/95 active:to-primary/75',
          'focus-visible:ring-primary/50',
        ],
        premium: [
          'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-amber-950 shadow-lg',
          'hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500 hover:shadow-xl',
          'active:from-amber-500 active:via-yellow-600 active:to-amber-700',
          'focus-visible:ring-amber-500/50',
        ],
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        xl: 'h-12 rounded-lg px-10 text-base',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-10 w-10',
        'icon-xl': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      rounded: {
        default: '',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      rounded: 'default',
    },
  }
)