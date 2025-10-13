import React from 'react';

interface FontConfig {
  family: string;
  size: string;
  weight: number;
}

interface FontCustomizerProps {
  font: FontConfig;
  onChange: (font: FontConfig) => void;
}

const fontFamilies = [
  { name: 'System Default', value: 'system-ui' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Poppins', value: 'Poppins' },
];

const fontSizes = [
  { name: 'Small', value: '0.875rem' },
  { name: 'Medium', value: '1rem' },
  { name: 'Large', value: '1.125rem' },
];

const fontWeights = [
  { name: 'Regular', value: 400 },
  { name: 'Medium', value: 500 },
  { name: 'Semi Bold', value: 600 },
  { name: 'Bold', value: 700 },
];

const defaultFont: FontConfig = {
  family: 'system-ui',
  size: '1rem',
  weight: 400
};

const FontCustomizer: React.FC<FontCustomizerProps> = ({ font = defaultFont, onChange }) => {
  const handleChange = (field: keyof FontConfig, newValue: string | number) => {
    onChange({
      ...font,
      [field]: newValue
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Font Customization</h3>
      
      {/* Font Family */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Font Family</label>
        <select
          value={font.family}
          onChange={(e) => handleChange('family', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {fontFamilies.map((fontOption) => (
            <option key={fontOption.value} value={fontOption.value}>
              {fontOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Font Size</label>
        <select
          value={font.size}
          onChange={(e) => handleChange('size', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.name}
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Font Weight</label>
        <select
          value={font.weight}
          onChange={(e) => handleChange('weight', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {fontWeights.map((weight) => (
            <option key={weight.value} value={weight.value}>
              {weight.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-md">
        <p className="mb-2 text-sm text-gray-600">Preview:</p>
        <p style={{
          fontFamily: font.family,
          fontSize: font.size,
          fontWeight: font.weight,
        }} className="text-gray-900">
          Hello! How can I help you today?
        </p>
      </div>
    </div>
  );
};

export default FontCustomizer; 