import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/constants';
import { Code, Copy, Check, ExternalLink, BookOpen, ChevronDown } from 'lucide-react';
import { useChatbot } from '../../contexts/ChatbotContext';

interface WidgetInstructionsProps {
  connectionId: string;
}

const WidgetInstructions: React.FC<WidgetInstructionsProps> = ({ connectionId }) => {
  const { selectedChatbotId: globalChatbotId, chatbots: globalChatbots } = useChatbot();
  const [widgetData, setWidgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [selectedChatbotId, setSelectedChatbotId] = useState<string>('');
  const [showChatbotSelector, setShowChatbotSelector] = useState(false);

  useEffect(() => {
    // Use global chatbots if available, otherwise fetch them
    if (globalChatbots && globalChatbots.length > 0) {
      setChatbots(globalChatbots);
      // Set the global chatbot as selected
      if (globalChatbotId) {
        setSelectedChatbotId(globalChatbotId);
      } else if (globalChatbots.length > 0) {
        setSelectedChatbotId(globalChatbots[0].id);
      }
    } else {
      fetchChatbots();
    }
  }, [globalChatbots, globalChatbotId]);

  useEffect(() => {
    fetchWidgetCode();
  }, [connectionId, selectedChatbotId]);

  useEffect(() => {
    if (selectedChatbotId) {
      fetchWidgetCode();
    }
  }, [selectedChatbotId]);

  const fetchChatbots = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/chatbots`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setChatbots(data.data || []);
        // Set first chatbot as default if none selected
        if (data.data && data.data.length > 0 && !selectedChatbotId) {
          setSelectedChatbotId(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch chatbots:', error);
    }
  };

  const fetchWidgetCode = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const chatbotId = selectedChatbotId || globalChatbotId || localStorage.getItem('selectedChatbotId');
      console.log('🔍 Fetching widget code for connection:', connectionId, 'chatbot:', chatbotId);
      
      if (!chatbotId) {
        console.error('❌ No chatbot ID available');
        setLoading(false);
        return;
      }
      
      const url = `${API_URL}/api/connections/${connectionId}/widget?chatbotId=${chatbotId}`;
      console.log('📡 Widget API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📊 Widget API response status:', response.status);
      const data = await response.json();
      console.log('📊 Widget API response data:', data);
      
      if (data.success) {
        setWidgetData(data.data);
      } else {
        console.error('❌ Widget API error:', data.error);
      }
    } catch (error) {
      console.error('❌ Failed to fetch widget code:', error);
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
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!widgetData) {
    return null;
  }

  const { connection, widgetCode, instructions, chatbot } = widgetData;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-50 rounded-xl border-2 border-indigo-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Add Chatbot to Your Store
            </h3>
            <p className="text-sm text-slate-600">
              Copy the code below and add it to your {connection.platform === 'shopify' ? 'Shopify' : 'WooCommerce'} store
            </p>
            {chatbot && (
              <div className="mt-2 p-3 bg-white/50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">Selected Chatbot:</span>
                  <span className="text-sm text-slate-900">{chatbot.name}</span>
                </div>
                {chatbot.description && (
                  <p className="text-xs text-slate-600 mt-1">{chatbot.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot Selection - Only show if multiple chatbots */}
      {chatbots.length > 1 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Select Chatbot</label>
          <div className="relative">
            <button
              onClick={() => setShowChatbotSelector(!showChatbotSelector)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-900">
                {chatbots.find(c => c.id === selectedChatbotId)?.name || 'Select a chatbot'}
              </span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showChatbotSelector ? 'rotate-180' : ''}`} />
            </button>
            
            {showChatbotSelector && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10">
                {chatbots.map((chatbot) => (
                  <button
                    key={chatbot.id}
                    onClick={() => {
                      setSelectedChatbotId(chatbot.id);
                      setShowChatbotSelector(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                      selectedChatbotId === chatbot.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-900'
                    }`}
                  >
                    <div className="font-medium">{chatbot.name}</div>
                    <div className="text-sm text-slate-500">{chatbot.description || 'No description'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Widget Code */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Widget Code</label>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
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
          <pre className="bg-slate-900 text-green-400 rounded-lg p-4 overflow-x-auto text-xs font-mono">
            <code>{widgetCode}</code>
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h4 className="font-semibold text-slate-900">Installation Instructions</h4>
        </div>
        
        <ol className="space-y-3">
          {(instructions?.shopify || instructions?.woocommerce || instructions || []).map((instruction: string, index: number) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-slate-700 pt-0.5">{instruction}</span>
            </li>
          ))}
        </ol>
        
        {/* Additional Help */}
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h5 className="font-semibold text-indigo-900 mb-2">💡 Pro Tips:</h5>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• The widget will appear in the bottom-right corner of your store</li>
            <li>• It's mobile-responsive and works on all devices</li>
            <li>• You can customize colors and text from your AI Orchestrator dashboard</li>
            <li>• Changes are applied instantly without touching the code again</li>
          </ul>
        </div>
      </div>

      {/* Help Links */}
      <div className="pt-4 border-t border-indigo-200">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600">Need help?</span>
          <a
            href={connection.platform === 'shopify' 
              ? 'https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code'
              : 'https://wordpress.org/support/article/editing-files/'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
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

