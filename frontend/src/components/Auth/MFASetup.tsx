import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface MFASetupProps {
  onSetup: (secret: string, token: string) => Promise<void>;
  onVerify: (token: string) => Promise<boolean>;
  qrCode?: string;
  secret?: string;
  isEnabled?: boolean;
}

const MFASetup: React.FC<MFASetupProps> = ({
  onSetup,
  onVerify,
  qrCode: initialQrCode,
  secret: initialSecret,
  isEnabled = false
}) => {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [qrCode, setQrCode] = useState<string>(initialQrCode || '');
  const [secret, setSecret] = useState<string>(initialSecret || '');
  const [verificationToken, setVerificationToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!isEnabled && !qrCode && !secret) {
      generateMFASecret();
    }
  }, [isEnabled, qrCode, secret]);

  const generateMFASecret = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate MFA secret');
      }

      const data = await response.json();
      setSecret(data.secret);
      
      // Generate QR code from the secret
      const qrCodeData = await QRCode.toDataURL(data.qrCodeUrl);
      setQrCode(qrCodeData);
      setBackupCodes(data.backupCodes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      setError('Please enter a valid 6-digit token');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const isValid = await onVerify(verificationToken);
      
      if (isValid) {
        await onSetup(secret, verificationToken);
        setStep('complete');
      } else {
        setError('Invalid verification token. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to disable MFA');
      }

      window.location.reload(); // Refresh to update MFA status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable MFA');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnabled) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6" data-testid="mfa-enabled">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">MFA is Enabled</h3>
          <p className="text-sm text-gray-500 mb-6">
            Your account is protected with two-factor authentication
          </p>
          <button
            onClick={handleDisableMFA}
            disabled={isLoading}
            data-testid="disable-mfa-button"
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            {isLoading ? 'Disabling...' : 'Disable MFA'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6" data-testid="mfa-setup">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" data-testid="mfa-error">
          {error}
        </div>
      )}

      {step === 'setup' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Set Up Two-Factor Authentication</h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Generating QR code...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                {qrCode && (
                  <img 
                    src={qrCode} 
                    alt="MFA QR Code" 
                    className="mx-auto mb-4"
                    data-testid="qr-code"
                  />
                )}
                <p className="text-sm text-gray-600 mb-2">
                  Scan this QR code with your authenticator app
                </p>
                {secret && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Manual entry key:</p>
                    <code className="text-sm font-mono break-all" data-testid="manual-key">
                      {secret}
                    </code>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="verification-token" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter verification code
                  </label>
                  <input
                    id="verification-token"
                    type="text"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    data-testid="verification-token-input"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={() => setStep('verify')}
                  disabled={verificationToken.length !== 6}
                  data-testid="verify-token-button"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Verify and Enable MFA
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p className="mb-2">Recommended authenticator apps:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                  <li>1Password</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {step === 'verify' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Setup</h3>
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Please confirm the 6-digit code from your authenticator app:
              </p>
              <p className="text-2xl font-mono font-bold text-gray-900 mt-2">
                {verificationToken}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleVerifyToken}
                disabled={isLoading}
                data-testid="confirm-verification-button"
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Confirm and Enable MFA'}
              </button>

              <button
                onClick={() => setStep('setup')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Back to Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">MFA Successfully Enabled!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your account is now protected with two-factor authentication
            </p>

            {backupCodes.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Backup Codes</h4>
                <p className="text-xs text-yellow-700 mb-3">
                  Save these codes in a safe place. You can use them to access your account if you lose your device.
                </p>
                <div className="grid grid-cols-2 gap-2" data-testid="backup-codes">
                  {backupCodes.map((code, index) => (
                    <code key={index} className="text-xs bg-yellow-100 p-2 rounded text-center">
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              data-testid="complete-setup-button"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFASetup;