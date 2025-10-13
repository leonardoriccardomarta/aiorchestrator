import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  lastUpdated: Date;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const FAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/faqs'),
          fetch('/api/faqs/categories')
        ]);

        const [faqsData, categoriesData] = await Promise.all([
          faqsResponse.json(),
          categoriesResponse.json()
        ]);

        setFaqs(faqsData);
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveFAQ = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/faqs/${faq.id}`, {
        method: faq.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });

      if (response.ok) {
        const updatedFaq = await response.json();
        setFaqs(prev => 
          faq.id 
            ? prev.map(f => f.id === faq.id ? updatedFaq : f)
            : [...prev, updatedFaq]
        );
        setEditingFaq(null);
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleTogglePublish = async (faq: FAQ) => {
    try {
      const response = await fetch(`/api/faqs/${faq.id}/toggle-publish`, {
        method: 'PUT',
      });

      if (response.ok) {
        setFaqs(prev =>
          prev.map(f => f.id === faq.id ? { ...f, isPublished: !f.isPublished } : f)
        );
      }
    } catch (error) {
      console.error('Error toggling FAQ publish status:', error);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(n => (
          <div key={n} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
          <button
            onClick={() => setEditingFaq({ id: '', question: '', answer: '', category: '', isPublished: false, lastUpdated: new Date() })}
            className="btn btn-primary"
          >
            Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map(faq => (
          <motion.div
            key={faq.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    Category: {categories.find(c => c.id === faq.category)?.name}
                  </span>
                  <span className="text-gray-500">
                    Updated: {new Date(faq.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePublish(faq)}
                  className={`status-badge ${faq.isPublished ? 'status-active' : 'status-inactive'}`}
                >
                  {faq.isPublished ? 'Published' : 'Draft'}
                </button>
                <button
                  onClick={() => setEditingFaq(faq)}
                  className="btn btn-outline"
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingFaq && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editingFaq.id ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveFAQ(editingFaq);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Question</label>
                    <input
                      type="text"
                      value={editingFaq.question}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Answer</label>
                    <textarea
                      value={editingFaq.answer}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      className="form-input min-h-[100px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      value={editingFaq.category}
                      onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                      className="form-input"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingFaq(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQManager; 