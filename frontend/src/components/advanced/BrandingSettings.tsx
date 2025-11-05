import React, { useState, useEffect } from 'react';
import { Palette, Upload, Save, Eye, Download, RotateCcw, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useChatbot } from '../../contexts/ChatbotContext';

const BrandingSettings: React.FC = () => {
  const { user } = useUser();
  const { selectedChatbot, updateChatbot } = useChatbot();
  
  const [branding, setBranding] = useState({
    logo: '',
    fontFamily: 'Inter'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // White Label state (only for Business plan)
  const [whiteLabelExpanded, setWhiteLabelExpanded] = useState(false);
  const [whiteLabel, setWhiteLabel] = useState({
    removeBranding: true
  });

  // Load existing branding settings from chatbot (only when selectedChatbot ID changes)
  const previousChatbotIdRef = React.useRef<string | null>(null);
  
  useEffect(() => {
    const currentChatbotId = selectedChatbot?.id;
    const previousChatbotId = previousChatbotIdRef.current;
    
    // Only reload branding if the chatbot ID actually changed
    if (currentChatbotId && currentChatbotId !== previousChatbotId) {
      if (selectedChatbot?.settings) {
        const settings = typeof selectedChatbot.settings === 'string' 
          ? JSON.parse(selectedChatbot.settings) 
          : selectedChatbot.settings;
        
        if (settings.branding) {
          console.log('🔄 BrandingSettings: Loading branding from database for new chatbot');
          setBranding(settings.branding);
        }
        
        // Load white-label settings (Business plan only)
        if (user?.planId === 'business' && settings.whiteLabel) {
          console.log('🔄 BrandingSettings: Loading white-label from database for new chatbot');
          setWhiteLabel(settings.whiteLabel);
        }
      }
      previousChatbotIdRef.current = currentChatbotId;
    }
  }, [selectedChatbot, user?.planId]);

  // Listen for custom branding updates from embed section
  useEffect(() => {
    const handleEmbedBrandingUpdate = (event: CustomEvent) => {
      const newBranding = event.detail;
      console.log('🔄 BrandingSettings: Received branding update from embed:', newBranding);
      // Only update if the branding is actually different to prevent loops
      setBranding(prev => {
        const isDifferent = JSON.stringify(prev) !== JSON.stringify(newBranding);
        if (isDifferent) {
          console.log('✅ BrandingSettings: Updating branding from embed');
          return newBranding;
        }
        return prev;
      });
    };

    window.addEventListener('embedBrandingUpdated', handleEmbedBrandingUpdate as EventListener);
    
    return () => {
      window.removeEventListener('embedBrandingUpdated', handleEmbedBrandingUpdate as EventListener);
    };
  }, []);

  const handleColorChange = (field: string, color: string) => {
    setBranding(prev => ({ ...prev, [field]: color }));
  };

  // Reset branding to defaults
  const resetBranding = () => {
    setBranding({
      logo: '',
      fontFamily: 'Inter'
    });
  };

  const handleSave = async () => {
    if (!selectedChatbot) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      console.log('💾 BrandingSettings: Saving branding:', branding);
      
      // Update chatbot settings with branding
      const currentSettings = typeof selectedChatbot.settings === 'string' 
        ? JSON.parse(selectedChatbot.settings) 
        : selectedChatbot.settings || {};
      
      const updatedSettings = {
        ...currentSettings,
        branding: branding,
        ...(user?.planId === 'business' && {
          whiteLabel: whiteLabel
        })
      };
      
      console.log('💾 BrandingSettings: Updated settings:', updatedSettings);
      
      await updateChatbot(selectedChatbot.id, {
        settings: JSON.stringify(updatedSettings)
      });
      
      setSaveStatus('success');
      
      // Update global config for live preview (only fontFamily, colors from theme)
      if (window.AIOrchestratorConfig) {
        window.AIOrchestratorConfig.fontFamily = branding.fontFamily;
      }
      
      // Sync with embed section
      window.dispatchEvent(new CustomEvent('embedBrandingUpdated', { detail: branding }));
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving branding:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Update global config for live preview (only fontFamily, colors from theme)
    if (window.AIOrchestratorConfig) {
      window.AIOrchestratorConfig.fontFamily = branding.fontFamily;
    }
    
    // Trigger a custom event for live preview update
    window.dispatchEvent(new CustomEvent('brandingUpdated', { detail: branding }));
  };

  // Auto-preview when branding changes (with debounce to prevent excessive updates)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handlePreview();
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [branding]);

  // Only show for Professional+ plans
  if (user?.planId === 'starter') {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Custom Branding</h3>
              <p className="text-sm text-gray-600">Customize your chatbot's appearance</p>
            </div>
          </div>
          <button
            onClick={resetBranding}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
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
              <p className="text-xs text-blue-600 mt-1 mb-3">
                💡 Recommended: minimum 200x200px (square) for optimal quality
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Convert file to base64
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBranding(prev => ({ ...prev, logo: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
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


          {/* White Label Section (Business only) - Minimized */}
          {user?.planId === 'business' && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <button
                onClick={() => setWhiteLabelExpanded(!whiteLabelExpanded)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-gray-900">White-Label Solution</h4>
                    <p className="text-xs text-gray-600">Remove "Powered by" branding</p>
                  </div>
                </div>
                {whiteLabelExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {whiteLabelExpanded && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="remove-branding"
                      checked={whiteLabel.removeBranding}
                      onChange={(e) => setWhiteLabel(prev => ({ ...prev, removeBranding: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remove-branding" className="text-sm text-gray-700 flex-1">
                      Remove "Powered by AI Orchestrator" branding
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    With white-label enabled, your chatbot will appear completely branded to your company without any AI Orchestrator attribution.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div 
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              style={{
                fontFamily: branding.fontFamily
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                {branding.logo && (
                  <img src={branding.logo} alt="Logo" className="w-8 h-8 rounded" />
                )}
                <div className="text-sm font-medium text-gray-900">
                  Your Chatbot
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Hello! How can I help you today?
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                saveStatus === 'success' 
                  ? 'bg-green-600 text-white' 
                  : saveStatus === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="w-4 h-4" />
              <span>
                {isSaving ? 'Saving...' : 
                 saveStatus === 'success' ? 'Saved!' :
                 saveStatus === 'error' ? 'Error' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default BrandingSettings;












