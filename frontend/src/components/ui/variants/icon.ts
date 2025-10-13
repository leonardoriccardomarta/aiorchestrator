import { cva } from "class-variance-authority"

export const iconVariants = cva(
  [
    // Base styles
    'inline-block',
    'fill-current',
    'transition-colors duration-200 ease-in-out',
  ],
  {
    variants: {
      size: {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        default: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
        '2xl': 'w-10 h-10',
        '3xl': 'w-12 h-12',
      },
      color: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        primary: 'text-primary',
        secondary: 'text-secondary-foreground',
        accent: 'text-accent-foreground',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        error: 'text-red-600 dark:text-red-400',
        white: 'text-white',
        black: 'text-black',
      },
      weight: {
        thin: 'stroke-1',
        light: 'stroke-1.5',
        normal: 'stroke-2',
        medium: 'stroke-2.5',
        semibold: 'stroke-3',
        bold: 'stroke-4',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
      weight: 'normal',
    },
  }
)