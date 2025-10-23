import React, { useState } from 'react';
import { X, Bot, Plus, Sparkles } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

interface AddChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddChatbotModal: React.FC<AddChatbotModalProps> = ({ isOpen, onClose }) => {
  const { createChatbot } = useChatbot();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: 'professional',
    language: 'auto'
  });

  const personalities = [
    { id: 'professional', name: 'Professional', description: 'Formal and business-focused' },
    { id: 'friendly', name: 'Friendly', description: 'Warm and approachable' },
    { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
    { id: 'expert', name: 'Expert', description: 'Technical and knowledgeable' }
  ];

  const languages = [
    { id: 'auto', name: 'Auto-detect', description: 'Automatically detect user language' },
    { id: 'en', name: 'English', description: 'English only' },
    { id: 'it', name: 'Italian', description: 'Italian only' },
    { id: 'es', name: 'Spanish', description: 'Spanish only' },
    { id: 'fr', name: 'French', description: 'French only' },
    { id: 'de', name: 'German', description: 'German only' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const newChatbot = await createChatbot({
        name: formData.name.trim(),
        description: formData.description.trim() || `Your ${formData.personality} AI assistant`,
        settings: {
          language: formData.language,
          personality: formData.personality,
          welcomeMessage: `Hello! I'm your ${formData.personality} AI assistant. How can I help you today?`
        }
      });

      if (newChatbot) {
        // Reset form
        setFormData({
          name: '',
          description: '',
          personality: 'professional',
          language: 'auto'
        });
        onClose();
      }
    } catch (error) {
      console.error('Error creating chatbot:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFormData({
        name: '',
        description: '',
        personality: 'professional',
        language: 'auto'
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Chatbot</h2>
              <p className="text-sm text-gray-600">Build your AI assistant</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chatbot Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Customer Support Bot"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
              disabled={isCreating}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What will this chatbot help with?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              disabled={isCreating}
            />
          </div>

          {/* Personality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Personality
            </label>
            <div className="grid grid-cols-2 gap-3">
              {personalities.map((personality) => (
                <button
                  key={personality.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, personality: personality.id }))}
                  disabled={isCreating}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.personality === personality.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  <div className="font-medium text-sm text-gray-900">{personality.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{personality.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Language
            </label>
            <div className="space-y-2">
              {languages.map((language) => (
                <button
                  key={language.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, language: language.id }))}
                  disabled={isCreating}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    formData.language === language.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  <div className="font-medium text-sm text-gray-900">{language.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{language.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || isCreating}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Chatbot
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChatbotModal;
