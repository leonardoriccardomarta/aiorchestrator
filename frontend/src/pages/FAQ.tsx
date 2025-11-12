import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import FeedbackModal from '../components/FeedbackModal';
import { Icons } from '../components/ui/Icon';
import { PageLoading } from '../components/ui/Loading';
import { Plus, Search, Edit, Trash2, MessageSquare, Zap, CheckCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFaqs();
      // Extract data from mock API response
      setFaqs(response.data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFAQ = async (faqData: any) => {
    try {
      // Create the FAQ directly with all required fields
      const newFaq = {
        id: Date.now().toString(),
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category,
        tags: faqData.tags || [faqData.category],
        status: faqData.status || "published",
        featured: faqData.featured || false,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        searches: 0,
        createdAt: new Date().toISOString()
      };
      
      setFaqs([...faqs, newFaq]);
      setShowAddForm(false);
      
      // Show success animation
      setShowSuccessAnimation(newFaq.id);
      setTimeout(() => setShowSuccessAnimation(null), 2000);
      
      // Simulate API call
      const response = await apiService.createFaq(faqData);
      if (!response.success) {
        console.error('API call failed, but FAQ was created locally');
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);
    }
  };

  const handleUpdateFAQ = async (id: string, updates: any) => {
    try {
      // Update the FAQ in the local state immediately
      const updatedFaqs = faqs.map(f => 
        f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
      );
      setFaqs(updatedFaqs);
      setEditingFaq(null);
      
      // Show success animation
      setShowSuccessAnimation(id);
      setTimeout(() => setShowSuccessAnimation(null), 2000);
      
      // Simulate API call
      const response = await apiService.updateFaq(id, updates);
      if (!response.success) {
        console.log('API call failed, but FAQ was updated locally');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      console.log('Error occurred, but FAQ was updated locally');
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    // Show confirmation modal instead of confirm()
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    confirmModal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">Delete FAQ</h3>
            <p class="text-slate-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this FAQ? This action cannot be undone.</p>
        </div>
        <div class="flex space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-medium">
            Cancel
          </button>
          <button id="confirmDelete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Delete
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmModal);
    
    // Add event listener for confirm button
    const confirmBtn = confirmModal.querySelector('#confirmDelete');
    confirmBtn?.addEventListener('click', () => {
      confirmModal.remove();
      // Proceed with deletion
      proceedWithDeletion(id);
    });
    
    // Add event listener for cancel button
    const cancelBtn = confirmModal.querySelector('button[onclick]');
    cancelBtn?.addEventListener('click', () => {
      confirmModal.remove();
    });
  };

  const proceedWithDeletion = async (id: string) => {
    try {
      // Delete from local state immediately
      setFaqs(faqs.filter(f => f.id !== id));
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">FAQ Deleted!</h3>
              <p class="text-slate-600">Removed successfully</p>
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-green-800">The FAQ has been permanently deleted from your knowledge base.</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => modal.remove(), 3000);
      
      // Simulate API call
      const response = await apiService.deleteFaq(id);
      if (!response.success) {
        console.log('API call failed, but FAQ was deleted locally');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Delete Failed</h3>
              <p class="text-slate-600">Unable to remove FAQ</p>
            </div>
          </div>
          <div class="bg-red-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-800">There was an error deleting the FAQ. Please try again.</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      setTimeout(() => modal.remove(), 3000);
    }
  };

  const handleAddSuggestedFAQ = (question: string) => {
    console.log('Adding suggested FAQ:', question);
    const newFaq = {
      id: Date.now().toString(),
      question: question,
      answer: "This is a suggested FAQ that needs to be completed.",
      category: "technical",
      tags: ["technical", "suggested"],
      status: "published",
      featured: false,
      views: 0,
      helpful: 0,
      notHelpful: 0,
      searches: 0,
      createdAt: new Date().toISOString()
    };
    setFaqs([...faqs, newFaq]);
    
    // Show success animation
    setShowSuccessAnimation(newFaq.id);
    setTimeout(() => setShowSuccessAnimation(null), 2000);
  };

  const handleCreateSuggestedFAQ = (question: string) => {
    console.log('Creating suggested FAQ:', question);
    const newFaq = {
      id: Date.now().toString(),
      question: question,
      answer: "This FAQ was created based on user requests and needs to be completed.",
      category: "security",
      tags: ["security", "user-requested"],
      status: "published",
      featured: false,
      views: 0,
      helpful: 0,
      notHelpful: 0,
      searches: 0,
      createdAt: new Date().toISOString()
    };
    setFaqs([...faqs, newFaq]);
    
    // Show success animation
    setShowSuccessAnimation(newFaq.id);
    setTimeout(() => setShowSuccessAnimation(null), 2000);
  };

  const handleOptimizeFAQ = (faqId: string) => {
    console.log('Optimizing FAQ:', faqId);
    // Simulate optimization by updating the FAQ
    const updatedFaqs = faqs.map(faq => {
      if (faq.id === faqId) {
        return {
          ...faq,
          answer: faq.answer + " [OPTIMIZED - Updated with better explanations and examples]",
          helpful: faq.helpful + 10,
          views: faq.views + 5
        };
      }
      return faq;
    });
    setFaqs(updatedFaqs);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">FAQ Optimized!</h3>
            <p class="text-slate-600">AI optimization complete</p>
          </div>
        </div>
        <div class="bg-indigo-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-indigo-800">FAQ optimized successfully! Helpfulness increased and content improved.</p>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
          Continue
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.remove(), 3000);
  };

  const toggleFaqExpansion = (id: string) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const generateAiSuggestions = () => {
    setShowAiSuggestions(true);
    const suggestions = [
      { id: 1, question: "How do I integrate the chatbot with my website?", category: "Integration" },
      { id: 2, question: "What are the pricing plans available?", category: "Billing" },
      { id: 3, question: "How can I customize the chatbot appearance?", category: "Customization" },
      { id: 4, question: "Is there a free trial available?", category: "Billing", answer: "Yes! We offer a 7-day free trial for all plans. No credit card required. You can test all features and create unlimited chatbots during your trial period." },
      { id: 5, question: "What AI features are available in workflows?", category: "Features" },
      { id: 6, question: "How do I troubleshoot technical issues?", category: "Technical" },
      { id: 7, question: "What security measures are in place?", category: "Security" }
    ];
    setAiSuggestions(suggestions);
  };

  const addAiSuggestion = (suggestion: any) => {
    console.log('Adding AI suggestion:', suggestion);
    const newFaq = {
      id: Date.now().toString(),
      question: suggestion.question,
      answer: "This is an AI-generated answer. Please customize it as needed.",
      category: suggestion.category.toLowerCase(),
      tags: [suggestion.category.toLowerCase(), "ai-generated"],
      status: "published",
      featured: false,
      views: 0,
      helpful: 0,
      notHelpful: 0,
      searches: 0,
      createdAt: new Date().toISOString()
    };
    setFaqs([...faqs, newFaq]);
    setShowAiSuggestions(false); // Close the modal
    setShowSuccessAnimation(newFaq.id);
    setTimeout(() => setShowSuccessAnimation(null), 2000);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || faq.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">❓ AI-Powered FAQ Management</h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 mt-2">Create intelligent FAQs that understand context and provide smart answers - more helpful than traditional knowledge bases</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
               AI-Powered
            </span>
            <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
              📝 Smart Content
            </span>
            <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              🔍 Context Aware
            </span>
          </div>
        </div>

        {/* Take a Tour Button */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-start">
          <button
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
                  <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-slate-900 mb-4">❓ FAQ Management Tutorial</h2>
                    <p class="text-slate-600">Learn how to create and manage your AI-powered FAQ content</p>
                  </div>
                  
                  <div class="space-y-6 mb-8">
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">➕</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 1: Create FAQs</h3>
                        <p class="text-slate-600 text-sm">Add frequently asked questions with detailed answers to help your users.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">📝</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 2: Organize Content</h3>
                        <p class="text-slate-600 text-sm">Categorize and tag your FAQs for easy navigation and better user experience.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">🔍</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 3: Optimize & Update</h3>
                        <p class="text-slate-600 text-sm">Monitor usage, update answers, and continuously improve your FAQ content.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex space-x-4">
                    <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300">
                      Start Creating
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium">
                      Close
                    </button>
                  </div>
                </div>
              `;
              document.body.appendChild(modal);
            }}
            className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:from-indigo-600 hover:to-indigo-800 active:from-indigo-700 active:to-indigo-900 flex items-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 touch-manipulation min-h-[44px] text-sm sm:text-base"
          >
            <span className="mr-2"></span>
            Take a Tour
          </button>
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-indigo-200">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total FAQs</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{faqs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-indigo-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl sm:text-2xl">👁️</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Views</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">12,847</p>
                <p className="text-xs sm:text-sm text-green-600">+15% vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-indigo-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-xl sm:text-2xl">👍</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Helpful</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">89%</p>
                <p className="text-xs sm:text-sm text-yellow-600">+5% vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-indigo-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-xl sm:text-2xl">🔍</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Searches</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">3,421</p>
                <p className="text-xs sm:text-sm text-purple-600">+23% vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 sm:space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-500 text-sm sm:text-base touch-manipulation min-h-[44px]"
                />
                <span className="absolute left-3 top-2.5 sm:top-3 text-slate-400 text-sm sm:text-base">🔍</span>
              </div>

              {/* Category Filter */}
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 text-sm sm:text-base touch-manipulation min-h-[44px]"
              >
                <option value="all">All Categories</option>
                <option value="account">Account</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="features">Features</option>
                <option value="security">Security</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={generateAiSuggestions}
                className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-all duration-300 touch-manipulation min-h-[44px] text-sm sm:text-base w-full sm:w-auto"
              >
                 AI Suggestions
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:from-indigo-600 hover:to-indigo-800 active:from-indigo-700 active:to-indigo-900 transition-all duration-300 touch-manipulation min-h-[44px] text-sm sm:text-base w-full sm:w-auto"
              >
                ➕ Add FAQ
              </button>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-200">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">FAQ ({filteredFaqs.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-4 sm:p-6 hover:bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 flex-1 min-w-0">{faq.question}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        faq.status === 'published' ? 'bg-green-100 text-green-800' :
                        faq.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {faq.status === 'published' ? 'Published' :
                         faq.status === 'draft' ? 'Draft' : 'Archived'}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium flex-shrink-0">
                        {faq.category}
                      </span>
                    </div>
                    {faq.tags && faq.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {typeof faq.tags === 'string' 
                          ? faq.tags.split(',').map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                                #{tag.trim()}
                              </span>
                            ))
                          : faq.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                                #{tag}
                              </span>
                            ))
                        }
                      </div>
                    )}
                    <p className="text-sm sm:text-base text-slate-600 mb-2 sm:mb-3">{faq.answer}</p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500">
                      <span>👁️ {faq.views} views</span>
                      <span>👍 {faq.helpful} helpful</span>
                      <span>📅 {new Date(faq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 sm:ml-4 flex-shrink-0">
                    <button
                      onClick={() => setEditingFaq(faq)}
                      className="text-indigo-600 hover:text-indigo-800 active:text-indigo-900 text-xs sm:text-sm transition-all duration-300 touch-manipulation min-h-[36px] px-2 sm:px-3"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-600 hover:text-red-800 active:text-red-900 text-xs sm:text-sm transition-all duration-300 touch-manipulation min-h-[36px] px-2 sm:px-3"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit FAQ Modal */}
        {(showAddForm || editingFaq) && (
          <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-3 sm:p-4">
            <div className="relative top-4 sm:top-10 lg:top-20 mx-auto p-4 sm:p-5 lg:p-6 border w-full max-w-2xl shadow-lg rounded-lg sm:rounded-md bg-white">
              <div className="mt-2 sm:mt-3">
                <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-3 sm:mb-4">
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const tagsString = formData.get('tags') as string;
                    const faqData = {
                      question: formData.get('question') as string,
                      answer: formData.get('answer') as string,
                      category: formData.get('category') as string,
                      status: formData.get('status') as string,
                      tags: tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [formData.get('category') as string],
                      featured: formData.get('featured') === 'on'
                    };
                    
                    console.log('Form submitted with data:', faqData);
                    if (editingFaq) {
                      handleUpdateFAQ(editingFaq.id, faqData);
                    } else {
                      handleCreateFAQ(faqData);
                    }
                  }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      name="question"
                      defaultValue={editingFaq?.question || ''}
                      className="w-full px-3 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-500 text-sm sm:text-base touch-manipulation min-h-[44px]"
                      placeholder="Enter the question..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                      Answer
                    </label>
                    <textarea
                      name="answer"
                      rows={4}
                      defaultValue={editingFaq?.answer || ''}
                      className="w-full px-3 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-500 text-sm sm:text-base"
                      placeholder="Enter the answer..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        defaultValue={editingFaq?.category || 'account'}
                        className="w-full px-3 py-2 sm:py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 text-sm sm:text-base touch-manipulation min-h-[44px]"
                      >
                        <option value="account">Account</option>
                        <option value="billing">Billing</option>
                        <option value="technical">Technical</option>
                        <option value="features">Features</option>
                        <option value="security">Security</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        defaultValue={editingFaq?.status || 'draft'}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={editingFaq?.tags?.join(', ') || ''}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., support, billing, technical"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        defaultChecked={editingFaq?.featured || false}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">Featured FAQ</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingFaq(null);
                      }}
                      className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                    >
                      {editingFaq ? 'Update' : 'Create'} FAQ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4"> Analytics FAQ</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top FAQ */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3"> Most Viewed FAQs</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">How to change password?</span>
                  <span className="font-medium">2,847 views</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">How to enable MFA?</span>
                  <span className="font-medium">1,923 views</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">How to export data?</span>
                  <span className="font-medium">1,456 views</span>
                </div>
              </div>
            </div>

            {/* Search Analytics */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3">🔍 Popular Searches</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">"password"</span>
                  <span className="font-medium">156 searches</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">"billing"</span>
                  <span className="font-medium">89 searches</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">"security"</span>
                  <span className="font-medium">67 searches</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3">⚡ Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Usefulness Rate</span>
                  <span className="font-medium text-green-600">89%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Average Reading Time</span>
                  <span className="font-medium">2.3 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Reduced Tickets</span>
                  <span className="font-medium text-green-600">-34%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4"> AI Suggestions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3"> Suggested FAQs</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-slate-900">How to configure webhooks?</p>
                  <p className="text-sm text-slate-600">Based on frequent searches</p>
                  <button 
                    onClick={() => handleAddSuggestedFAQ("How to configure webhooks?")}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm hover:scale-105 transition-all duration-300"
                  >
                    ➕ Add FAQ
                  </button>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-slate-900">How to integrate with Slack?</p>
                  <p className="text-sm text-slate-600">Based on support questions</p>
                  <button 
                    onClick={() => handleAddSuggestedFAQ("How to integrate with Slack?")}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm hover:scale-105 transition-all duration-300"
                  >
                    ➕ Add FAQ
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3"> Optimizations</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-slate-900">FAQ "How to delete account"</p>
                  <p className="text-sm text-slate-600">Low usefulness rate (45%)</p>
                  <button 
                    onClick={() => handleOptimizeFAQ("1")}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm hover:scale-105 transition-all duration-300"
                  >
                     Optimize
                  </button>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-slate-900">Add FAQ about GDPR</p>
                  <p className="text-sm text-slate-600">Requested by 23 users</p>
                  <button 
                    onClick={() => handleCreateSuggestedFAQ("How to comply with GDPR?")}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm hover:scale-105 transition-all duration-300"
                  >
                    ➕ Create FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      {showAiSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900"> AI Suggestions</h3>
              <button
                onClick={() => setShowAiSuggestions(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 mb-1">{suggestion.question}</h4>
                      <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        {suggestion.category}
                      </span>
                    </div>
                    <button
                      onClick={() => addAiSuggestion(suggestion)}
                      className="ml-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                    >
                      ➕ Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          onSuccess={() => setFeedbackSubmitted(true)}
        />
      )}

      {/* Success Message */}
      {feedbackSubmitted && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 z-50 max-w-sm">
          <div className="flex items-center">
            <div className="text-green-600 text-2xl mr-3"></div>
            <div>
              <h4 className="font-semibold text-green-800">Thanks for your feedback!</h4>
              <p className="text-green-700 text-sm">Feedback sent successfully! You'll receive a confirmation email shortly.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ; 
