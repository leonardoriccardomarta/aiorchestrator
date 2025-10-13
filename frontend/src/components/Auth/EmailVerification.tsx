import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VERIFY_EMAIL, RESEND_VERIFICATION } from '../../graphql/mutations/auth';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const [verifyEmail] = useMutation(VERIFY_EMAIL, {
    onCompleted: (data) => {
      setStatus('success');
      setMessage(data.verifyEmail.message);
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message);
    },
  });

  const [resendVerification] = useMutation(RESEND_VERIFICATION, {
    onCompleted: (data) => {
      setStatus('success');
      setMessage(data.resendVerificationEmail.message);
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmail({ variables: { token } });
    }
  }, [token, verifyEmail]);

  const handleResend = async () => {
    setStatus('loading');
    setMessage('');
    await resendVerification();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{message}</div>
              </div>

              <button
                onClick={handleResend}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                data-testid="resend-button"
              >
                Resend Verification Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 