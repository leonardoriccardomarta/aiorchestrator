import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('Token di verifica non trovato');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus('success');
        setMessage(data.message);
        
        // Update user data in localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          user.isVerified = true;
          localStorage.setItem('userData', JSON.stringify(user));
        }
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(data.error || 'Verifica fallita');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Errore durante la verifica');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {verificationStatus === 'loading' && (
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="w-16 h-16 text-green-600" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="w-16 h-16 text-red-600" />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {verificationStatus === 'loading' && 'Verifica in corso...'}
            {verificationStatus === 'success' && 'Account Verificato! 🎉'}
            {verificationStatus === 'error' && 'Verifica Fallita'}
          </h1>

          {/* Message */}
          <p className="text-slate-600 mb-6">
            {message}
          </p>

          {/* Success Actions */}
          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email verificata con successo!</span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Il tuo account è ora attivo. Verrai reindirizzato al dashboard tra 3 secondi...
                </p>
              </div>
              
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Vai al Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Actions */}
          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-red-800">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Verifica fallita</span>
                </div>
                <p className="text-sm text-red-700 mt-2">
                  Il link di verifica potrebbe essere scaduto o non valido.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleGoToLogin}
                  className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-all duration-200"
                >
                  Torna al Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
                >
                  Riprova
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {verificationStatus === 'loading' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-indigo-800">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">Verifica in corso...</span>
                </div>
                <p className="text-sm text-indigo-700 mt-2">
                  Stiamo verificando il tuo account, attendi un momento...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            © 2025 AI Orchestrator. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
