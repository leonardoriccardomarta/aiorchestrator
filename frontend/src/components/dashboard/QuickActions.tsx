import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Create Chatbot',
      description: 'Build your first AI assistant',
      icon: '',
      link: '/chatbot/new',
      color: 'from-indigo-500 to-indigo-600',
      gradient: 'from-indigo-400 to-indigo-500'
    },
    {
      title: 'Connect WhatsApp',
      description: 'Integrate with WhatsApp Business',
      icon: '',
      link: '/integrations/whatsapp',
      color: 'from-green-500 to-green-600',
      gradient: 'from-green-400 to-green-500'
    },
    {
      title: 'View Analytics',
      description: 'Check your chatbot performance',
      icon: '',
      link: '/analytics',
      color: 'from-purple-500 to-purple-600',
      gradient: 'from-purple-400 to-purple-500'
    },
    {
      title: 'Setup Workflows',
      description: 'Automate your processes',
      icon: '⚡',
      link: '/workflows',
      color: 'from-orange-500 to-orange-600',
      gradient: 'from-orange-400 to-orange-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Quick Actions</h2>
        <p className="text-slate-600">Get started with these common tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.link}
              className="block group"
            >
              <div className="relative overflow-hidden rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
                
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{action.icon}</div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-white transition-colors duration-200 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-200">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Getting Started Section */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">New to AI Chatbots?</h3>
            <p className="text-slate-600">Follow our step-by-step guide to get started</p>
          </div>
          <Link
            to="/onboarding"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span>Get Started Guide</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;

