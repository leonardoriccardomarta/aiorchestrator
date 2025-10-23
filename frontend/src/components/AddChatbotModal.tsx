import React, { useState } from 'react';
import { X, Bot, Plus, Sparkles } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

interface AddChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstChatbot?: boolean;
}

const AddChatbotModal: React.FC<AddChatbotModalProps> = ({ isOpen, onClose, isFirstChatbot = false }) => {
  const { createChatbot } = useChatbot();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?'
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const newChatbot = await createChatbot({
        name: formData.name.trim(),
        description: `Your AI assistant - ${formData.name}`,
        settings: {
          welcomeMessage: formData.welcomeMessage.trim()
        }
      });

      if (newChatbot) {
        // Reset form
        setFormData({
          name: '',
          welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?'
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
        welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?'
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
              <h2 className="text-xl font-semibold text-gray-900">
                {isFirstChatbot ? 'Create Your First Chatbot' : 'Create New Chatbot'}
              </h2>
              <p className="text-sm text-gray-600">Quick setup - customize later in settings</p>
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

          {/* Welcome Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Message *
            </label>
            <textarea
              value={formData.welcomeMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
              placeholder="Hello! I'm your AI assistant. How can I help you today?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              required
              disabled={isCreating}
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown when users first interact with your chatbot
            </p>
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
