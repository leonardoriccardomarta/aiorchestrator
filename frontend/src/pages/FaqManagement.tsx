import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { MockApiService } from '../services/mockApi';
import FeedbackModal from '../components/FeedbackModal';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const FaqManagement = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [modalData, setModalData] = useState({
    question: '',
    answer: '',
    category: 'Integration',
    tags: ''
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const categories = ['All', 'Integration', 'Billing', 'Customization', 'Support', 'Features'];

  // Fetch FAQs from backend
  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MockApiService.getFAQs();
      setFaqs(data);
    } catch (err: unknown) {
      console.error('Failed to fetch FAQs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFaq = () => {
    setEditingFaq(null);
    setModalData({ question: '', answer: '', category: 'Integration', tags: '' });
    setShowAddModal(true);
    setModalError(null);
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setModalData({ question: faq.question, answer: faq.answer, category: faq.category, tags: faq.tags.join(',') });
    setShowAddModal(true);
    setModalError(null);
  };

  const handleDeleteFaq = async (id: string) => {
    // Show custom confirmation modal
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
            <h3 class="text-lg font-semibold text-gray-900">Delete FAQ</h3>
            <p class="text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        <div class="bg-red-50 rounded-lg p-3 mb-4">
          <p class="text-sm text-red-800">Are you sure you want to delete this FAQ? This action cannot be undone.</p>
        </div>
        <div class="flex space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium">
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
    confirmBtn?.addEventListener('click', async () => {
      confirmModal.remove();
      try {
        await MockApiService.deleteFAQ(id);
        setFaqs(faqs.filter(faq => faq.id !== id));
        
        // Show success modal
        const successModal = document.createElement('div');
        successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        successModal.innerHTML = `
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">FAQ Deleted!</h3>
                <p class="text-gray-600">Removed successfully</p>
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
        document.body.appendChild(successModal);
        setTimeout(() => successModal.remove(), 3000);
      } catch (err: unknown) {
        const errorModal = document.createElement('div');
        errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        errorModal.innerHTML = `
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Delete Failed</h3>
                <p class="text-gray-600">Unable to remove FAQ</p>
              </div>
            </div>
            <div class="bg-red-50 rounded-lg p-3 mb-4">
              <p class="text-sm text-red-800">${err instanceof Error ? err.message : 'Failed to delete FAQ'}</p>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Continue
            </button>
          </div>
        `;
        document.body.appendChild(errorModal);
        setTimeout(() => errorModal.remove(), 3000);
      }
    });
    
    // Add event listener for cancel button
    const cancelBtn = confirmModal.querySelector('button[onclick]');
    cancelBtn?.addEventListener('click', () => {
      confirmModal.remove();
    });
  };

  const handleTogglePublish = async (id: string) => {
    const faq = faqs.find(f => f.id === id);
    if (!faq) return;
    try {
      const updated = await MockApiService.updateFAQ(id, { ...faq, isActive: !faq.isActive });
      setFaqs(faqs.map(f => (f.id === id ? updated : f)));
    } catch (err: unknown) {
      const errorModal = document.createElement('div');
      errorModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      errorModal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Update Failed</h3>
              <p class="text-gray-600">Unable to save changes</p>
            </div>
          </div>
          <div class="bg-red-50 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-800">${err instanceof Error ? err.message : 'Failed to update FAQ'}</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Continue
          </button>
        </div>
      `;
      document.body.appendChild(errorModal);
      setTimeout(() => errorModal.remove(), 3000);
    }
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      if (editingFaq) {
        const tags = typeof modalData.tags === 'string' ? modalData.tags.split(',').map(t => t.trim()) : modalData.tags;
        const updated = await MockApiService.updateFAQ(editingFaq.id, { 
          ...editingFaq, 
          ...modalData,
          tags 
        });
        setFaqs(faqs.map(f => (f.id === editingFaq.id ? updated : f)));
      } else {
        const tags = typeof modalData.tags === 'string' ? modalData.tags.split(',').map(t => t.trim()) : modalData.tags || [];
        const created = await MockApiService.createFAQ({ 
          ...modalData, 
          tags 
        });
        setFaqs([created, ...faqs]);
      }
      setShowAddModal(false);
    } catch (err: unknown) {
      console.error('Failed to save FAQ:', err);
      setModalError(err instanceof Error ? err.message : 'Failed to save FAQ');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unable to load FAQs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => loadFaqs()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans">❓ AI-Powered FAQ Management</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 font-normal max-w-3xl">
                Create intelligent FAQs that understand context and provide smart answers - more helpful than traditional knowledge bases
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                   AI-Powered
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                  📝 Smart Content
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  🔍 Context Aware
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                  modal.innerHTML = `
                    <div class="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
                      <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">❓ FAQ Management Tutorial</h2>
                        <p class="text-gray-600">Learn how to create and manage your FAQ content</p>
                      </div>
                      
                      <div class="space-y-6 mb-8">
                        <div class="flex items-start space-x-4">
                          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span class="text-2xl">➕</span>
                          </div>
                          <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Step 1: Create FAQs</h3>
                            <p class="text-gray-600 text-sm">Add frequently asked questions with detailed answers to help your users.</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start space-x-4">
                          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span class="text-2xl">📝</span>
                          </div>
                          <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Step 2: Organize Content</h3>
                            <p class="text-gray-600 text-sm">Categorize and tag your FAQs for easy navigation and better user experience.</p>
                          </div>
                        </div>
                        
                        <div class="flex items-start space-x-4">
                          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span class="text-2xl">🔍</span>
                          </div>
                          <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Step 3: Optimize & Update</h3>
                            <p class="text-gray-600 text-sm">Monitor usage, update answers, and continuously improve your FAQ content.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex space-x-4">
                        <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                          Start Creating
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                          Close
                        </button>
                      </div>
                    </div>
                  `;
                  document.body.appendChild(modal);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="mr-2"></span>
                Take a Tour
              </button>
              
              <button
                onClick={() => setShowFeedback(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 ml-2"
              >
                <span className="mr-2">💬</span>
                <span className="text-sm sm:text-base">Give Feedback</span>
              </button>
              <button
                onClick={handleAddFaq}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">❓</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{faqs.length}</div>
                <div className="text-sm font-medium text-gray-500">Total FAQs</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl"></span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{faqs.filter(f => f.isActive).length}</div>
                <div className="text-sm font-medium text-gray-500">Published</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{faqs.filter(f => !f.isActive).length}</div>
                <div className="text-sm font-medium text-gray-500">Drafts</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📂</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{categories.filter(c => c !== 'All').length}</div>
                <div className="text-sm font-medium text-gray-500">Categories</div>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              FAQs ({filteredFaqs.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by creating your first FAQ'}
                </p>
                {!searchTerm && selectedCategory === 'All' && (
                  <button
                    onClick={handleAddFaq}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New FAQ
                  </button>
                )}
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          faq.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{faq.answer}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {faq.createdAt}</span>
                        <span>Updated: {faq.updatedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleTogglePublish(faq.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-md ${
                          faq.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {faq.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEditFaq(faq)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <form onSubmit={handleModalSubmit}>
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        name="question"
                        value={modalData.question}
                        onChange={handleModalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the question..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        name="answer"
                        value={modalData.answer}
                        onChange={handleModalChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the answer..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={modalData.category}
                        onChange={handleModalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {categories.filter(cat => cat !== 'All').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                      <input
                        type="text"
                        name="tags"
                        value={modalData.tags}
                        onChange={handleModalChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>
                  {modalError && <div className="text-red-500 text-sm mt-2">{modalError}</div>}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      disabled={modalLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      disabled={modalLoading}
                    >
                      {modalLoading ? 'Saving...' : editingFaq ? 'Update' : 'Create'}
                    </button>
                  </div>
                </div>
              </form>
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
    </div>
  );
};

export default FaqManagement; 