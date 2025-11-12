import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TestChatbotWizard: React.FC = () => {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Name and description' },
    { id: 2, title: 'Personality', description: 'AI behavior and style' },
    { id: 3, title: 'Integrations', description: 'Connect channels' },
    { id: 4, title: 'Branding', description: 'Visual identity' },
    { id: 5, title: 'Review', description: 'Final check' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2"> Create Your AI Chatbot</h1>
          <p className="text-slate-600">Build a powerful AI assistant in minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s.id <= step
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {s.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.description}</div>
                </div>
                {s.id < steps.length && (
                  <div className={`w-12 h-1 mx-4 ${
                    s.id < step ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {steps[step - 1].title}
            </h2>
            <p className="text-slate-600">{steps[step - 1].description}</p>
          </div>
          
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Step 1: Basic Information</h3>
                  <p className="text-slate-600">Enter your chatbot's name and description</p>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Step 2: Personality</h3>
                  <p className="text-slate-600">Choose your chatbot's personality and response style</p>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Step 3: Integrations</h3>
                  <p className="text-slate-600">Connect your chatbot to messaging platforms</p>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Step 4: Branding</h3>
                  <p className="text-slate-600">Customize colors and avatar</p>
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Step 5: Review</h3>
                  <p className="text-slate-600">Review and create your chatbot</p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-8 border-t border-slate-200">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={() => setStep(Math.min(5, step + 1))}
              disabled={step === 5}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {step === 5 ? 'Create Chatbot' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChatbotWizard;


