import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Bot, Zap, BarChart3, Settings, CreditCard } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage or context
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || 'User');
    }
  }, []);

  const steps = [
    {
      title: "Benvenuto in AI Orchestrator! 🚀",
      description: `Ciao ${userName}! La tua piattaforma AI è pronta. Iniziamo con una rapida configurazione.`,
      icon: <Bot className="w-16 h-16 text-indigo-600" />,
      features: [
        "50+ lingue supportate automaticamente",
        "Machine Learning integrato",
        "95% margini di guadagno",
        "Integrazione e-commerce completa"
      ]
    },
    {
      title: "Configura il tuo primo chatbot 🤖",
      description: "Crea il tuo assistente AI personalizzato in pochi minuti.",
      icon: <Zap className="w-16 h-16 text-green-600" />,
      features: [
        "Personalizza la personalità",
        "Imposta le risposte automatiche",
        "Configura le integrazioni",
        "Testa in tempo reale"
      ]
    },
    {
      title: "Monitora le performance 📊",
      description: "Analizza i dati con il nostro sistema ML avanzato.",
      icon: <BarChart3 className="w-16 h-16 text-purple-600" />,
      features: [
        "Analisi sentiment in tempo reale",
        "Classificazione intent automatica",
        "Predizione churn clienti",
        "Raccomandazioni intelligenti"
      ]
    },
    {
      title: "Gestisci il tuo account ⚙️",
      description: "Configura le impostazioni e monitora l'utilizzo.",
      icon: <Settings className="w-16 h-16 text-orange-600" />,
      features: [
        "Piano attuale: Starter (€29/mese)",
        "1 chatbot incluso",
        "14 giorni di trial gratuito",
        "Supporto 24/7 incluso"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboardingCompleted', 'true');
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              Passo {currentStep + 1} di {steps.length}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Step Content */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16">
                  {currentStepData.icon}
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">
                {currentStepData.title}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-4 sm:mb-6 lg:mb-8">
                {currentStepData.description}
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-2 touch-manipulation min-h-[44px] text-sm sm:text-base"
              >
                <span>
                  {currentStep === steps.length - 1 ? 'Completa Setup' : 'Avanti'}
                </span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={handleSkip}
                className="bg-slate-100 text-slate-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-slate-200 active:bg-slate-300 transition-all duration-200 touch-manipulation min-h-[44px] text-sm sm:text-base"
              >
                Salta per ora
              </button>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div 
              onClick={() => navigate('/dashboard')}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl active:shadow-md transition-all duration-200 border border-slate-100 touch-manipulation"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                <h3 className="font-semibold text-sm sm:text-base text-slate-900">Dashboard</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Vedi le tue statistiche e performance</p>
            </div>

            <div 
              onClick={() => navigate('/settings')}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl active:shadow-md transition-all duration-200 border border-slate-100 touch-manipulation"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <h3 className="font-semibold text-sm sm:text-base text-slate-900">Impostazioni</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Gestisci il tuo piano e account</p>
            </div>

            <div 
              onClick={() => navigate('/payments')}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 cursor-pointer hover:shadow-xl active:shadow-md transition-all duration-200 border border-slate-100 touch-manipulation sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <h3 className="font-semibold text-sm sm:text-base text-slate-900">Piano</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Visualizza e gestisci il tuo piano</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
