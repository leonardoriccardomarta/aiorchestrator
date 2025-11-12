import React from 'react';

const TestQuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2"> Quick Actions</h2>
        <p className="text-slate-600">Get started with these common tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2"></div>
          <h3 className="font-semibold text-slate-900 mb-1">Create Chatbot</h3>
          <p className="text-sm text-slate-600">Build your first AI assistant</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2"></div>
          <h3 className="font-semibold text-slate-900 mb-1">Connect WhatsApp</h3>
          <p className="text-sm text-slate-600">Integrate with WhatsApp Business</p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2"></div>
          <h3 className="font-semibold text-slate-900 mb-1">View Analytics</h3>
          <p className="text-sm text-slate-600">Check your chatbot performance</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-slate-900 mb-1">Setup Workflows</h3>
          <p className="text-sm text-slate-600">Automate your processes</p>
        </div>
      </div>
    </div>
  );
};

export default TestQuickActions;

