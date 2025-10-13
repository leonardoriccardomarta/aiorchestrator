import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What is a chatbot?',
    answer: 'A chatbot is an AI-powered software that can simulate conversation with users.',
    category: 'General',
  },
  {
    id: '2',
    question: 'How do I create a new chatbot?',
    answer: 'You can create a new chatbot by clicking the "Create Chatbot" button in the chatbots section.',
    category: 'Getting Started',
  },
];

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);
  const [_editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add New FAQ
        </button>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <motion.div
            key={faq.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <span className="text-sm text-gray-500">{faq.category}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(faq.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQManagement; 