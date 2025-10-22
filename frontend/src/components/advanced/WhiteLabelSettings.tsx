import React, { useState } from 'react';
import { Globe, Settings, Download, Eye, Save } from 'lucide-react';
import PlanLimitations from '../PlanLimitations';

const WhiteLabelSettings: React.FC = () => {
  const [whiteLabel, setWhiteLabel] = useState({
    companyName: '',
    domain: '',
    customDomain: '',
    removeBranding: true,
    customFooter: '',
    apiEndpoint: ''
  });

  const handleSave = () => {
    alert('White-label settings saved! Your chatbot will now be fully branded to your company.');
  };

  const handlePreview = () => {
    alert('Preview feature coming soon! You\'ll be able to see how your white-label chatbot looks.');
  };

  const generateEmbedCode = () => {
    const embedCode = `<!-- AI Orchestrator White-Label Chatbot -->
<script src="https://${whiteLabel.domain || 'your-domain.com'}/widget.js" 
        data-chatbot-id="your-chatbot-id"
        data-company="${whiteLabel.companyName}"
        data-white-label="true">
</script>
<div id="ai-chatbot-widget"></div>`;
    
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  return (
    <PlanLimitations feature="White-Label Solution" requiredPlan="business">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">White-Label Solution</h3>
            <p className="text-sm text-gray-600">Fully brand your chatbot as your own</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Company Branding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={whiteLabel.companyName}
                onChange={(e) => setWhiteLabel(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your Company Inc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Domain
              </label>
              <input
                type="text"
                value={whiteLabel.customDomain}
                onChange={(e) => setWhiteLabel(prev => ({ ...prev, customDomain: e.target.value }))}
                placeholder="chat.yourcompany.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* API Endpoint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint
            </label>
            <input
              type="text"
              value={whiteLabel.apiEndpoint}
              onChange={(e) => setWhiteLabel(prev => ({ ...prev, apiEndpoint: e.target.value }))}
              placeholder="https://api.yourcompany.com/chatbot"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Branding Options */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Branding Options</h4>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="remove-branding"
                checked={whiteLabel.removeBranding}
                onChange={(e) => setWhiteLabel(prev => ({ ...prev, removeBranding: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remove-branding" className="text-sm text-gray-700">
                Remove "Powered by AI Orchestrator" branding
              </label>
            </div>
          </div>

          {/* Custom Footer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Footer Text
            </label>
            <textarea
              value={whiteLabel.customFooter}
              onChange={(e) => setWhiteLabel(prev => ({ ...prev, customFooter: e.target.value }))}
              placeholder="© 2024 Your Company. All rights reserved."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Embed Code */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Embed Code</h4>
            <div className="relative">
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`<!-- AI Orchestrator White-Label Chatbot -->
<script src="https://${whiteLabel.domain || 'your-domain.com'}/widget.js" 
        data-chatbot-id="your-chatbot-id"
        data-company="${whiteLabel.companyName}"
        data-white-label="true">
</script>
<div id="ai-chatbot-widget"></div>`}</code>
              </pre>
              <button
                onClick={generateEmbedCode}
                className="absolute top-2 right-2 bg-gray-700 text-gray-300 p-1 rounded hover:bg-gray-600"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center mb-4">
                <h5 className="font-semibold text-gray-900">{whiteLabel.companyName || 'Your Company'}</h5>
                <p className="text-sm text-gray-600">AI Assistant</p>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Hello! I'm your AI assistant. How can I help you today?
              </div>
              {whiteLabel.customFooter && (
                <div className="text-xs text-gray-500 text-center border-t pt-2">
                  {whiteLabel.customFooter}
                </div>
              )}
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

export default WhiteLabelSettings;












