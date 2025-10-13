import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const cardVariants = cva(
  'rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        elevated: 'border-gray-200 shadow-lg hover:shadow-xl',
        outlined: 'border-2 border-gray-300',
        ghost: 'border-transparent shadow-none hover:shadow-sm',
        gradient: 'border-transparent bg-gradient-to-br from-blue-50 to-purple-50',
        premium: 'border-transparent bg-gradient-to-br from-amber-50 to-orange-50',
        success: 'border-transparent bg-gradient-to-br from-green-50 to-emerald-50',
        warning: 'border-transparent bg-gradient-to-br from-yellow-50 to-orange-50',
        error: 'border-transparent bg-gradient-to-br from-red-50 to-pink-50',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
);

const cardHeaderVariants = cva('flex flex-col space-y-1.5', {
  variants: {
    size: {
      sm: 'pb-3',
      default: 'pb-4',
      lg: 'pb-6',
      xl: 'pb-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const cardTitleVariants = cva('text-lg font-semibold leading-none tracking-tight', {
  variants: {
    size: {
      sm: 'text-base',
      default: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const cardDescriptionVariants = cva('text-sm text-gray-600', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const cardContentVariants = cva('', {
  variants: {
    size: {
      sm: 'pt-0',
      default: 'pt-0',
      lg: 'pt-0',
      xl: 'pt-0',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const cardFooterVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'pt-3',
      default: 'pt-4',
      lg: 'pt-6',
      xl: 'pt-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  children: React.ReactNode;
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {
  children: React.ReactNode;
}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {
  children: React.ReactNode;
}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {
  children: React.ReactNode;
}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, interactive, className }))}
      {...props}
    >
      {children}
    </div>
  )
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardHeaderVariants({ size, className }))}
      {...props}
    >
      {children}
    </div>
  )
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(cardTitleVariants({ size, className }))}
      {...props}
    >
      {children}
    </h3>
  )
);

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(cardDescriptionVariants({ size, className }))}
      {...props}
    >
      {children}
    </p>
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardContentVariants({ size, className }))}
      {...props}
    >
      {children}
    </div>
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariants({ size, className }))}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }; 