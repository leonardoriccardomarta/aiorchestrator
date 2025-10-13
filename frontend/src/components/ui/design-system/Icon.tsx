import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { iconVariants } from '../variants/icon';

export interface IconProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof iconVariants> {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'white' | 'black';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  decorative?: boolean;
  title?: string;
  description?: string;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      className,
      icon: IconComponent,
      size,
      color,
      weight,
      decorative = false,
      title,
      description,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Determine accessibility attributes
    const accessibilityProps = decorative
      ? { 'aria-hidden': true }
      : {
          role: 'img',
          'aria-label': ariaLabel || title,
          'aria-describedby': description ? `${props.id || 'icon'}-description` : undefined,
        };

    return (
      <>
        <IconComponent
          className={cn(iconVariants({ size, color, weight, className }))}
          ref={ref}
          {...accessibilityProps}
          {...props}
        />
        {description && (
          <span id={`${props.id || 'icon'}-description`} className="sr-only">
            {description}
          </span>
        )}
      </>
    );
  }
);

Icon.displayName = 'Icon';

export { Icon };