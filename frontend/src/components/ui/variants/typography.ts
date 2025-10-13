import { cva } from "class-variance-authority"

export const typographyVariants = cva(
  [
    // Base styles
    'font-sans antialiased',
    'leading-normal',
    'tracking-normal',
  ],
  {
    variants: {
      variant: {
        // Headings
        h1: 'text-4xl font-bold leading-tight tracking-tight',
        h2: 'text-3xl font-bold leading-tight tracking-tight',
        h3: 'text-2xl font-semibold leading-tight tracking-tight',
        h4: 'text-xl font-semibold leading-tight tracking-tight',
        h5: 'text-lg font-semibold leading-tight tracking-tight',
        h6: 'text-base font-semibold leading-tight tracking-tight',
        
        // Body text
        body: 'text-base leading-relaxed',
        'body-lg': 'text-lg leading-relaxed',
        'body-sm': 'text-sm leading-relaxed',
        
        // Captions
        caption: 'text-sm leading-normal',
        'caption-sm': 'text-xs leading-normal',
        
        // Display text
        'display-1': 'text-6xl font-bold leading-tight tracking-tight',
        'display-2': 'text-5xl font-bold leading-tight tracking-tight',
        'display-3': 'text-4xl font-bold leading-tight tracking-tight',
        
        // Special text
        'lead': 'text-xl leading-relaxed',
        'small': 'text-sm leading-normal',
        'tiny': 'text-xs leading-normal',
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
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
    },
    defaultVariants: {
      variant: 'body',
      color: 'default',
      weight: 'normal',
      align: 'left',
    },
  }
)