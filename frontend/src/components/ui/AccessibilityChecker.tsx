import React from 'react';
import { ColorConfig } from './ColorPicker';

interface AccessibilityCheckerProps {
  config: {
    colors: ColorConfig;
    theme: 'light' | 'dark';
    font: {
      size: string;
    };
  };
}

interface ContrastResult {
  ratio: number;
  passes: {
    AA: boolean;
    AAA: boolean;
  };
}

const defaultConfig = {
  colors: {
    gradientStart: '#007AFF',
    gradientEnd: '#00C6FF',
    opacity: 100,
    primary: '#007AFF',
    secondary: '#00C6FF',
    background: '#FFFFFF',
    text: '#1F2937'
  },
  theme: 'light' as const,
  font: {
    size: '1rem'
  }
};

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ config = defaultConfig }) => {
  // Helper function to calculate relative luminance
  const getLuminance = (hex: string) => {
    try {
      const rgb = parseInt(hex.slice(1), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;

      const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    } catch (error) {
      return 0;
    }
  };

  // Calculate contrast ratio
  const getContrastRatio = (l1: number, l2: number): ContrastResult => {
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return {
      ratio,
      passes: {
        AA: ratio >= 4.5,
        AAA: ratio >= 7
      }
    };
  };

  const headerLuminance = getLuminance(config?.colors?.gradientStart || defaultConfig.colors.gradientStart);
  const textLuminance = config?.theme === 'dark' ? 1 : 0;
  const contrastResult = getContrastRatio(headerLuminance, textLuminance);

  const getFontSizeInPx = (remValue: string) => {
    const baseSize = 16;
    return parseFloat(remValue) * baseSize;
  };

  const fontSize = config?.font?.size || defaultConfig.font.size;
  const isLargeText = getFontSizeInPx(fontSize) >= 18;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Accessibility Check</h3>

        {/* Contrast Ratio */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Contrast Ratio:</span>
            <span className="font-medium">{contrastResult.ratio.toFixed(2)}:1</span>
          </div>

          {/* WCAG Compliance Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">WCAG AA</span>
                <span className={`text-sm ${contrastResult.passes.AA ? 'text-green-600' : 'text-red-600'}`}>
                  {contrastResult.passes.AA ? '✓ Pass' : '× Fail'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {isLargeText ? 'Min. 3:1 for large text' : 'Min. 4.5:1 for normal text'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">WCAG AAA</span>
                <span className={`text-sm ${contrastResult.passes.AAA ? 'text-green-600' : 'text-red-600'}`}>
                  {contrastResult.passes.AAA ? '✓ Pass' : '× Fail'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {isLargeText ? 'Min. 4.5:1 for large text' : 'Min. 7:1 for normal text'}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
          <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            {!contrastResult.passes.AA && (
              <li>Increase contrast between header and text colors</li>
            )}
            {getFontSizeInPx(fontSize) < 16 && (
              <li>Consider increasing base font size for better readability</li>
            )}
            <li>Ensure keyboard navigation is possible for all interactive elements</li>
            <li>Add ARIA labels for custom interactive components</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityChecker; 