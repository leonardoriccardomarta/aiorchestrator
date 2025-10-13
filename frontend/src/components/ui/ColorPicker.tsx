import React, { useState } from 'react';
import { Input } from './Input';

export interface ColorConfig {
  gradientStart: string;
  gradientEnd: string;
  opacity: number;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

interface ColorPickerProps {
  colors: ColorConfig;
  onChange: (colors: ColorConfig) => void;
}

const presetGradients = [
  { name: 'Ocean', start: '#007AFF', end: '#00C6FF', primary: '#007AFF', secondary: '#00C6FF', background: '#FFFFFF', text: '#1F2937' },
  { name: 'Sunset', start: '#FF512F', end: '#F09819', primary: '#FF512F', secondary: '#F09819', background: '#FFFFFF', text: '#1F2937' },
  { name: 'Forest', start: '#134E5E', end: '#71B280', primary: '#134E5E', secondary: '#71B280', background: '#FFFFFF', text: '#1F2937' },
  { name: 'Purple Rain', start: '#8E2DE2', end: '#4A00E0', primary: '#8E2DE2', secondary: '#4A00E0', background: '#FFFFFF', text: '#1F2937' },
  { name: 'Coral', start: '#FF8177', end: '#FF867A', primary: '#FF8177', secondary: '#FF867A', background: '#FFFFFF', text: '#1F2937' },
  { name: 'Dark', start: '#1F2937', end: '#374151', primary: '#1F2937', secondary: '#374151', background: '#111827', text: '#FFFFFF' },
  { name: 'Light', start: '#E5E7EB', end: '#F3F4F6', primary: '#9CA3AF', secondary: '#D1D5DB', background: '#FFFFFF', text: '#1F2937' },
];

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onChange }) => {
  const [favorites, setFavorites] = useState<Array<ColorConfig>>([]);

  const handleChange = (field: keyof ColorConfig, newValue: string | number) => {
    const updatedColors = { ...colors };
    
    if (field === 'opacity') {
      updatedColors.opacity = newValue as number;
    } else {
      (updatedColors[field] as string) = newValue as string;
      
      // Update primary/secondary colors when gradient colors change
      if (field === 'gradientStart') {
        updatedColors.primary = newValue as string;
      } else if (field === 'gradientEnd') {
        updatedColors.secondary = newValue as string;
      }

      // Ensure text color has enough contrast with background
      if (field === 'background') {
        const rgb = hexToRgb(newValue as string);
        if (rgb) {
          const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
          updatedColors.text = brightness > 128 ? '#1F2937' : '#FFFFFF';
        }
      }
    }

    onChange(updatedColors);
  };

  const handlePresetClick = (preset: typeof presetGradients[0]) => {
    onChange({
      ...colors,
      gradientStart: preset.start,
      gradientEnd: preset.end,
      primary: preset.primary,
      secondary: preset.secondary,
      background: preset.background,
      text: preset.text
    });
  };

  const addToFavorites = () => {
    setFavorites(prev => [...prev, colors]);
  };

  const gradientStyle = {
    background: `linear-gradient(to right, ${colors.gradientStart}, ${colors.gradientEnd})`,
    opacity: colors.opacity / 100
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <div className="space-y-6">
      {/* Color Inputs */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Gradient Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Color</label>
            <div className="relative">
              <Input
                type="color"
                value={colors.gradientStart}
                onChange={(e) => handleChange('gradientStart', e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white"
              />
              <div className="mt-1 text-xs font-mono text-gray-500">{colors.gradientStart}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Color</label>
            <div className="relative">
              <Input
                type="color"
                value={colors.gradientEnd}
                onChange={(e) => handleChange('gradientEnd', e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white"
              />
              <div className="mt-1 text-xs font-mono text-gray-500">{colors.gradientEnd}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Colors */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Theme Colors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <div className="relative">
              <Input
                type="color"
                value={colors.background}
                onChange={(e) => handleChange('background', e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white"
              />
              <div className="mt-1 text-xs font-mono text-gray-500">{colors.background}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <div className="relative">
              <Input
                type="color"
                value={colors.text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white"
              />
              <div className="mt-1 text-xs font-mono text-gray-500">{colors.text}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Opacity Control */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Opacity</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">Gradient Opacity</label>
            <span className="text-sm text-gray-500">{colors.opacity}%</span>
          </div>
          <Input
            type="range"
            min="20"
            max="100"
            value={colors.opacity}
            onChange={(e) => handleChange('opacity', parseInt(e.target.value))}
            className="w-full bg-white"
          />
        </div>
      </div>

      {/* Gradient Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
        <div className="h-12 w-full rounded-md shadow-sm overflow-hidden">
          <div className="h-full w-full" style={gradientStyle}></div>
        </div>
      </div>

      {/* Preset Gradients */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Preset Themes</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {presetGradients.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="group p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div 
                className="h-8 w-full rounded-md shadow-sm mb-2 group-hover:shadow-md transition-shadow overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${preset.start}, ${preset.end})`
                }}
              />
              <span className="text-xs font-medium text-gray-700">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Saved Themes</h4>
          <button
            onClick={addToFavorites}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
          >
            Save Current Theme
          </button>
        </div>
        {favorites.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {favorites.map((favorite, index) => (
              <button
                key={index}
                onClick={() => onChange(favorite)}
                className="group p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div 
                  className="h-6 w-full rounded-md shadow-sm group-hover:shadow-md transition-shadow"
                  style={{
                    background: `linear-gradient(to right, ${favorite.gradientStart}, ${favorite.gradientEnd})`,
                    opacity: favorite.opacity / 100
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker; 