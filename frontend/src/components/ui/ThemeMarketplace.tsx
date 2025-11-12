import React, { useState } from 'react';
import { ColorConfig } from './ColorPicker';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  config: ChatbotConfig;
  author: {
    name: string;
    avatar: string;
  };
  downloads: number;
  rating: number;
}

interface ChatbotConfig {
  colors: ColorConfig;
  font: {
    family: string;
    size: string;
    weight: number;
  };
  theme: 'light' | 'dark';
  customCSS: string;
}

interface ThemeMarketplaceProps {
  onApplyTheme: (config: ChatbotConfig) => void;
}

const sampleThemes: Theme[] = [
  {
    id: '1',
    name: 'Modern Minimal',
    description: 'Clean and professional design with high contrast',
    preview: '/themes/modern-minimal.png',
    config: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        background: '#FFFFFF',
        text: '#1F2937',
        gradientStart: '#3B82F6',
        gradientEnd: '#8B5CF6',
        opacity: 0.9
      },
      font: {
        family: 'Inter',
        size: '1rem',
        weight: 500
      },
      theme: 'light',
      customCSS: ''
    },
    author: {
      name: 'Sarah Designer',
      avatar: '/avatars/sarah.jpg'
    },
    downloads: 2547,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Dark Mode Pro',
    description: 'Sleek dark theme with vibrant accents',
    preview: '/themes/dark-mode.png',
    config: {
      colors: {
        primary: '#10B981',
        secondary: '#059669',
        background: '#FFFFFF',
        text: '#1F2937',
        gradientStart: '#10B981',
        gradientEnd: '#059669',
        opacity: 0.9
      },
      font: {
        family: 'Roboto',
        size: '0.875rem',
        weight: 400
      },
      theme: 'dark',
      customCSS: ''
    },
    author: {
      name: 'Alex Dev',
      avatar: '/avatars/alex.jpg'
    },
    downloads: 1893,
    rating: 4.6
  },
];

const ThemeMarketplace: React.FC<ThemeMarketplaceProps> = ({ onApplyTheme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Themes' },
    { id: 'popular', name: 'Popular' },
    { id: 'new', name: 'New' },
    { id: 'professional', name: 'Professional' },
    { id: 'playful', name: 'Playful' },
  ];

  const filteredThemes = sampleThemes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Theme Marketplace</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700">
          Submit Your Theme
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredThemes.map(theme => (
          <div key={theme.id} className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="aspect-video bg-slate-100 relative">
              {/* Theme Preview */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-slate-500">Preview Image</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-slate-900">{theme.name}</h4>
                <p className="text-sm text-slate-600">{theme.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                  <span className="text-slate-600">{theme.author.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">{theme.downloads} downloads</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-slate-600 ml-1">{theme.rating}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onApplyTheme(theme.config)}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Apply Theme
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeMarketplace; 
