import React, { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useResponsiveContext } from './ResponsiveProvider';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  margin?: 'none' | 'sm' | 'md' | 'lg';
  fluid?: boolean;
  center?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
  margin = 'none',
  fluid = false,
  center = true,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsiveContext();

  // Responsive max width
  const getMaxWidth = () => {
    if (fluid) return 'max-w-none';
    
    switch (maxWidth) {
      case 'sm': return 'max-w-2xl';
      case 'md': return 'max-w-4xl';
      case 'lg': return 'max-w-6xl';
      case 'xl': return 'max-w-7xl';
      case '2xl': return 'max-w-8xl';
      case 'full': return 'max-w-none';
      default: return 'max-w-7xl';
    }
  };

  // Responsive padding
  const getPadding = () => {
    if (padding === 'none') return '';
    
    if (isMobile) {
      switch (padding) {
        case 'sm': return 'px-2 py-2';
        case 'md': return 'px-4 py-4';
        case 'lg': return 'px-6 py-6';
        default: return 'px-4 py-4';
      }
    }
    
    if (isTablet) {
      switch (padding) {
        case 'sm': return 'px-4 py-4';
        case 'md': return 'px-6 py-6';
        case 'lg': return 'px-8 py-8';
        default: return 'px-6 py-6';
      }
    }
    
    // Desktop
    switch (padding) {
      case 'sm': return 'px-6 py-6';
      case 'md': return 'px-8 py-8';
      case 'lg': return 'px-12 py-12';
      default: return 'px-8 py-8';
    }
  };

  // Responsive margin
  const getMargin = () => {
    if (margin === 'none') return '';
    
    if (isMobile) {
      switch (margin) {
        case 'sm': return 'mx-2 my-2';
        case 'md': return 'mx-4 my-4';
        case 'lg': return 'mx-6 my-6';
        default: return 'mx-4 my-4';
      }
    }
    
    if (isTablet) {
      switch (margin) {
        case 'sm': return 'mx-4 my-4';
        case 'md': return 'mx-6 my-6';
        case 'lg': return 'mx-8 my-8';
        default: return 'mx-6 my-6';
      }
    }
    
    // Desktop
    switch (margin) {
      case 'sm': return 'mx-6 my-6';
      case 'md': return 'mx-8 my-8';
      case 'lg': return 'mx-12 my-12';
      default: return 'mx-8 my-8';
    }
  };

  return (
    <div
      className={cn(
        'w-full',
        getMaxWidth(),
        getPadding(),
        getMargin(),
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid component for responsive layouts
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3;
    desktop?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  gap?: 'sm' | 'md' | 'lg';
  equalHeight?: boolean;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  equalHeight = false,
}) => {
  const { isMobile, isTablet } = useResponsiveContext();

  const getGridCols = () => {
    if (isMobile) {
      switch (cols.mobile) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        default: return 'grid-cols-1';
      }
    }
    
    if (isTablet) {
      switch (cols.tablet) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        default: return 'grid-cols-2';
      }
    }
    
    // Desktop
    switch (cols.desktop) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-3';
    }
  };

  const getGap = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div
      className={cn(
        'grid',
        getGridCols(),
        getGap(),
        equalHeight && 'items-stretch',
        className
      )}
    >
      {children}
    </div>
  );
};

// Flex component for responsive layouts
interface ResponsiveFlexProps {
  children: ReactNode;
  className?: string;
  direction?: {
    mobile?: 'row' | 'col';
    tablet?: 'row' | 'col';
    desktop?: 'row' | 'col';
  };
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg';
}

export const ResponsiveFlex: React.FC<ResponsiveFlexProps> = ({
  children,
  className,
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' },
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 'md',
}) => {
  const { isMobile, isTablet } = useResponsiveContext();

  const getDirection = () => {
    if (isMobile) {
      return direction.mobile === 'col' ? 'flex-col' : 'flex-row';
    }
    
    if (isTablet) {
      return direction.tablet === 'col' ? 'flex-col' : 'flex-row';
    }
    
    // Desktop
    return direction.desktop === 'col' ? 'flex-col' : 'flex-row';
  };

  const getJustify = () => {
    switch (justify) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
      case 'between': return 'justify-between';
      case 'around': return 'justify-around';
      default: return 'justify-start';
    }
  };

  const getAlign = () => {
    switch (align) {
      case 'start': return 'items-start';
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      case 'stretch': return 'items-stretch';
      default: return 'items-start';
    }
  };

  const getGap = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div
      className={cn(
        'flex',
        getDirection(),
        getJustify(),
        getAlign(),
        getGap(),
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
};
