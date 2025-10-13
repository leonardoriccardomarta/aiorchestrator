import React, { useState } from 'react';
import { Palette, Upload, Save, Eye, Download } from 'lucide-react';
import PlanLimitations from '../PlanLimitations';

const BrandingSettings: React.FC = () => {
  const [branding, setBranding] = useState({
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    fontFamily: 'Inter',
    customCSS: ''
  });

  const handleColorChange = (field: string, color: string) => {
    setBranding(prev => ({ ...prev, [field]: color }));
  };

  const handleSave = () => {
    alert('Branding settings saved! Your chatbot will now use these custom styles.');
  };

  const handlePreview = () => {
    alert('Preview feature coming soon! You\'ll be able to see how your chatbot looks with these settings.');
  };

  return (
    <PlanLimitations feature="Custom Branding" requiredPlan="professional">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Custom Branding</h3>
            <p className="text-sm text-gray-600">Customize your chatbot's appearance</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload your logo</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBranding(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
                  }
                }}
              />
              <label
                htmlFor="logo-upload"
                className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={branding.fontFamily}
              onChange={(e) => handleColorChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>

          {/* Custom CSS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom CSS
            </label>
            <textarea
              value={branding.customCSS}
              onChange={(e) => handleColorChange('customCSS', e.target.value)}
              placeholder="/* Add your custom CSS here */"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div 
              className="bg-white rounded-lg p-4 shadow-sm"
              style={{
                backgroundColor: branding.primaryColor + '10',
                borderColor: branding.primaryColor,
                fontFamily: branding.fontFamily
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                {branding.logo && (
                  <img src={branding.logo} alt="Logo" className="w-8 h-8 rounded" />
                )}
                <div 
                  className="text-sm font-medium"
                  style={{ color: branding.primaryColor }}
                >
                  Your Chatbot
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Hello! How can I help you today?
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>
    </PlanLimitations>
  );
};

export default BrandingSettings;












