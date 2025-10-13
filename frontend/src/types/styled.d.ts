import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: Record<string, string>;
      secondary: Record<string, string>;
      success: Record<string, string>;
      error: Record<string, string>;
      warning: Record<string, string>;
      neutral: Record<string, string>;
    };
    spacing: Record<string, string>;
    shadows: Record<string, string>;
    typography: {
      fontSize: Record<string, string>;
      fontWeight: Record<string, number>;
    };
  }
}

// Styled component prop interfaces
export interface ActiveProps {
  active?: boolean;
}

export interface IsOpenProps {
  isOpen?: boolean;
}

export interface SizeProps {
  size?: 'sm' | 'md' | 'lg';
}

export interface VariantProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'error';
}

export interface DisabledProps {
  disabled?: boolean;
}

export interface FullWidthProps {
  fullWidth?: boolean;
}

export interface LoadingProps {
  loading?: boolean;
}

export interface ErrorProps {
  error?: boolean;
}

export interface ElevationProps {
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface PaddingProps {
  padding?: number;
}

export interface GapProps {
  gap?: number;
}

export interface WeightProps {
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

export interface WidthProps {
  width?: string | number;
}

export interface HeightProps {
  height?: string | number;
}

export interface LoadedProps {
  loaded?: boolean;
}

export interface ProgressProps {
  progress?: number;
}

export interface AnimationProps {
  animation?: 'pulse' | 'wave';
}

export interface VisibleProps {
  visible?: boolean;
}

export interface PullingProps {
  pulling?: boolean;
}

export interface OffsetProps {
  offset?: number;
}

export interface SideProps {
  side?: 'left' | 'right';
}

export interface TopProps {
  top?: number;
} 