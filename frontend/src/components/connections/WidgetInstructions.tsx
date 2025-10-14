import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/constants';
import { Code, Copy, Check, ExternalLink, BookOpen } from 'lucide-react';

interface WidgetInstructionsProps {
  connectionId: string;
}

const WidgetInstructions: React.FC<WidgetInstructionsProps> = ({ connectionId }) => {
  const [widgetData, setWidgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchWidgetCode();
  }, [connectionId]);

  const fetchWidgetCode = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const selectedChatbotId = localStorage.getItem('selectedChatbotId');
      const url = selectedChatbotId 
        ? `${API_URL}/api/connections/${connectionId}/widget?chatbotId=${selectedChatbotId}`
        : `${API_URL}/api/connections/${connectionId}/widget`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setWidgetData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch widget code:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (widgetData?.widgetCode) {
      navigator.clipboard.writeText(widgetData.widgetCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!widgetData) {
    return null;
  }

  const { connection, widgetCode, instructions } = widgetData;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Add Chatbot to Your Store
            </h3>
            <p className="text-sm text-gray-600">
              Copy the code below and add it to your {connection.platform === 'shopify' ? 'Shopify' : 'WooCommerce'} store
            </p>
          </div>
        </div>
      </div>

      {/* Widget Code */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Widget Code</label>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
        
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto text-xs font-mono">
            <code>{widgetCode}</code>
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Installation Instructions</h4>
        </div>
        
        <ol className="space-y-2">
          {instructions?.map((instruction: string, index: number) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-gray-700 pt-0.5">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Help Links */}
      <div className="pt-4 border-t border-blue-200">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Need help?</span>
          <a
            href={connection.platform === 'shopify' 
              ? 'https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code'
              : 'https://wordpress.org/support/article/editing-files/'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View Official Documentation
          </a>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>✓ Connection Successful!</strong> Your chatbot is ready to be embedded. 
          Once you add the code to your store, your customers will see the chatbot widget.
        </p>
      </div>
    </div>
  );
};

export default WidgetInstructions;

