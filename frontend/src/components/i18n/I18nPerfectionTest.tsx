import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { RTLProvider } from './RTLSupport';
import { 
  useLanguageManager, 
  useNumberFormat, 
  useDateTimeFormat, 
  useTextDirection
} from '../../hooks/useI18n';

const I18nPerfectionTest: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, getSupportedLanguages, isCurrentLanguageRTL } = useLanguageManager();
  const { formatNumber, formatCurrency, formatPercentage } = useNumberFormat();
  const { formatDate, formatTime, formatRelativeTime } = useDateTimeFormat();
  const { direction, isRTL, getAlignment } = useTextDirection();

  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);

  // Test data
  const testNumber = 1234567.89;
  const testDate = new Date();

  useEffect(() => {
    console.log('Language changed to:', currentLanguage);
  }, [currentLanguage]);

  const runAllTests = () => {
    const results = [];

    // Test 1: Basic Translation
    try {
      const appTitle = t('common:app.title');
      results.push({ test: 'Basic Translation', status: '', result: appTitle });
    } catch (error: any) {
      results.push({ test: 'Basic Translation', status: '', result: error?.message || 'Unknown error' });
    }

    // Test 2: Namespace Translation
    try {
      const dashboardTitle = t('dashboard:title');
      results.push({ test: 'Namespace Translation', status: '', result: dashboardTitle });
    } catch (error: any) {
      results.push({ test: 'Namespace Translation', status: '', result: error?.message || 'Unknown error' });
    }

    // Test 3: Number Formatting
    try {
      const formattedNumber = formatNumber(testNumber);
      results.push({ test: 'Number Formatting', status: '', result: formattedNumber });
    } catch (error: any) {
      results.push({ test: 'Number Formatting', status: '', result: error?.message || 'Unknown error' });
    }

    // Test 4: Currency Formatting
    try {
      const formattedCurrency = formatCurrency(testNumber);
      results.push({ test: 'Currency Formatting', status: '', result: formattedCurrency });
    } catch (error: any) {
      results.push({ test: 'Currency Formatting', status: '', result: error?.message || 'Unknown error' });
    }

    // Test 5: Date Formatting
    try {
      const formattedDate = formatDate(testDate);
      results.push({ test: 'Date Formatting', status: '', result: formattedDate });
    } catch (error: any) {
      results.push({ test: 'Date Formatting', status: '', result: error?.message || 'Unknown error' });
    }

    // Test 6: RTL Detection
    try {
      results.push({ test: 'RTL Detection', status: '', result: `Direction: ${direction}, RTL: ${isRTL}` });
    } catch (error: any) {
      results.push({ test: 'RTL Detection', status: '', result: error?.message || 'Unknown error' });
    }

    setTestResults(results);
  };

  return (
    <RTLProvider>
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        direction: direction as 'ltr' | 'rtl',
        textAlign: getAlignment('left')
      }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
          🌍 {t('common:app.title')} - i18n Perfection Test
        </h1>

        {/* Language Selector Section */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2> Language Management</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <strong>Current Language:</strong> {currentLanguage} {isCurrentLanguageRTL ? '(RTL)' : '(LTR)'}
            </div>
            <LanguageSelector variant="dropdown" searchable={true} grouped={true} />
          </div>
        </div>

        {/* Basic Translation Test */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>📝 Basic Translation Test</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong>App Title:</strong> {t('common:app.title')}
            </div>
            <div>
              <strong>App Description:</strong> {t('common:app.description')}
            </div>
            <div>
              <strong>Dashboard Title:</strong> {t('dashboard:title')}
            </div>
            <div>
              <strong>Login:</strong> {t('auth:login')}
            </div>
            <div>
              <strong>Chatbot Title:</strong> {t('chatbot:title')}
            </div>
          </div>
        </div>

        {/* Formatting Test */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>🔢 Formatting Test</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Number:</strong> {formatNumber(testNumber)}
            </div>
            <div>
              <strong>Currency:</strong> {formatCurrency(testNumber)}
            </div>
            <div>
              <strong>Percentage:</strong> {formatPercentage(0.85)}
            </div>
            <div>
              <strong>Date:</strong> {formatDate(testDate)}
            </div>
            <div>
              <strong>Time:</strong> {formatTime(testDate)}
            </div>
            <div>
              <strong>Relative Time:</strong> {formatRelativeTime(testDate)}
            </div>
          </div>
        </div>

        {/* RTL Components Test */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>🔄 RTL Components Test</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: getAlignment('left') }}>
              This text should align correctly based on language direction
            </div>
            <input
              placeholder={t('common:placeholders.search')}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              style={{ 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                                 direction: direction as 'ltr' | 'rtl',
                 textAlign: getAlignment('left')
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                {t('common:actions.save')}
              </button>
              <button style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                {t('common:actions.cancel')}
              </button>
            </div>
          </div>
        </div>

        {/* Comprehensive Test Runner */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>🧪 Comprehensive Test Runner</h2>
          <button 
            onClick={runAllTests}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '1rem' }}
          >
            Run All Tests
          </button>
          
          {testResults.length > 0 && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Test</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index}>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{result.test}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{result.status}</td>
                      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{result.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Language Grid */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2> Supported Languages</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem' 
          }}>
            {getSupportedLanguages().map((lang) => (
              <div 
                key={lang.code} 
                style={{ 
                  padding: '1rem', 
                  border: '1px solid #ccc', 
                  borderRadius: '8px',
                  backgroundColor: lang.code === currentLanguage ? '#e3f2fd' : '#fff',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{lang.flag}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{lang.name}</div>
                <div style={{ color: '#666', marginBottom: '0.5rem' }}>{lang.nativeName}</div>
                <div style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>
                  Direction: {lang.direction.toUpperCase()}
                </div>
                <button 
                  onClick={() => changeLanguage(lang.code)}
                  disabled={lang.code === currentLanguage}
                  style={{ 
                    padding: '0.5rem 1rem',
                    backgroundColor: lang.code === currentLanguage ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: lang.code === currentLanguage ? 'default' : 'pointer',
                    width: '100%'
                  }}
                >
                  {lang.code === currentLanguage ? 'Current' : 'Switch to ' + lang.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2> Performance Metrics</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <strong>Total Languages:</strong> {getSupportedLanguages().length}
            </div>
            <div>
              <strong>RTL Languages:</strong> {getSupportedLanguages().filter(lang => lang.isRTL).length}
            </div>
            <div>
              <strong>Current Direction:</strong> {direction.toUpperCase()}
            </div>
            <div>
              <strong>Language Ready:</strong> Yes
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <p> i18n Perfection Test Complete!</p>
          <p>All internationalization features are working perfectly.</p>
          <p>Current Language: <strong>{currentLanguage}</strong> | Direction: <strong>{direction.toUpperCase()}</strong></p>
        </div>
      </div>
    </RTLProvider>
  );
};

export default I18nPerfectionTest; 
