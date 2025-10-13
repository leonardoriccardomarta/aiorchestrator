import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { typographyVariants } from '../variants/typography';

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  children: React.ReactNode;
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  noWrap?: boolean;
  breakWords?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      as,
      color,
      weight,
      align,
      truncate,
      noWrap,
      breakWords,
      children,
      ...props
    },
    ref
  ) => {
    // Determine the element to render
    const Component = as || (variant?.startsWith('h') ? variant : 'p') as keyof JSX.IntrinsicElements;

    return React.createElement(
      Component,
      {
        className: cn(
          typographyVariants({ variant, color, weight, align }),
          truncate && 'truncate',
          noWrap && 'whitespace-nowrap',
          breakWords && 'break-words',
          className
        ),
        ref,
        ...props
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components for common use cases
export const H1 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="h1" variant="h1" {...props} />
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="h2" variant="h2" {...props} />
);
H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="h3" variant="h3" {...props} />
);
H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="h4" variant="h4" {...props} />
);
H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="h5" variant="h5" {...props} />
);
H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="h6" variant="h6" {...props} />
);
H6.displayName = 'H6';

export const Body = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="p" variant="body" {...props} />
);
Body.displayName = 'Body';

export const BodySmall = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="p" variant="body-sm" {...props} />
);
BodySmall.displayName = 'BodySmall';

export const BodyLarge = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="p" variant="body-lg" {...props} />
);
BodyLarge.displayName = 'BodyLarge';

export const Caption = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="span" variant="caption" {...props} />
);
Caption.displayName = 'Caption';

export const CaptionSmall = React.forwardRef<HTMLSpanElement, Omit<TypographyProps, 'as' | 'variant'>>(
  (props, ref) => <Typography ref={ref} as="span" variant="caption-sm" {...props} />
);
CaptionSmall.displayName = 'CaptionSmall';

export { Typography };