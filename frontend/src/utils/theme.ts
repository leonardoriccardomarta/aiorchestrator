export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export const lightTheme: ThemeColors = {
  primary: '#0070f3',
  secondary: '#7928ca',
  accent: '#f81ce5',
  background: '#ffffff',
  surface: '#f7f7f7',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  error: '#dc2626',
  warning: '#ea580c',
  success: '#16a34a',
  info: '#0284c7',
};

export const darkTheme: ThemeColors = {
  primary: '#0070f3',
  secondary: '#7928ca',
  accent: '#f81ce5',
  background: '#000000',
  surface: '#111111',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#333333',
  error: '#ef4444',
  warning: '#f97316',
  success: '#22c55e',
  info: '#0ea5e9',
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export const adjustBrightness = (color: string, amount: number): string => {
  const { r, g, b } = hexToRGB(color);
  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));
  return rgbToHex(newR, newG, newB);
};

export const getContrastColor = (hexcolor: string): string => {
  const { r, g, b } = hexToRGB(hexcolor);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

export const generatePalette = (baseColor: string): Record<number, string> => {
  const palette: Record<number, string> = {};

  for (let i = 1; i <= 9; i++) {
    const amount = (i - 5) * 40;
    palette[i * 100] = adjustBrightness(baseColor, amount);
  }

  return palette;
};

export const generateThemeFromColor = (primaryColor: string): ThemeColors => {
  const isDark = getContrastColor(primaryColor) === '#ffffff';

  return {
    primary: primaryColor,
    secondary: adjustBrightness(primaryColor, isDark ? 40 : -40),
    accent: adjustBrightness(primaryColor, isDark ? 80 : -80),
    background: isDark ? '#000000' : '#ffffff',
    surface: isDark ? '#111111' : '#f7f7f7',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#999999' : '#666666',
    border: isDark ? '#333333' : '#e0e0e0',
    error: '#ff0000',
    warning: '#f5a623',
    success: '#28a745',
    info: '#17a2b8',
  };
};

export const applyTheme = (theme: ThemeColors): void => {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

export const getThemeValue = (
  mode: ThemeMode
): ThemeColors => {
  if (mode === 'system') {
    return getSystemTheme() === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
}; 