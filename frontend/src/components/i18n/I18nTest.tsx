import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { useLanguageManager, useNumberFormat, useDateTimeFormat } from '../../hooks/useI18n';

const I18nTest: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, getSupportedLanguages } = useLanguageManager();
  const { formatNumber, formatCurrency } = useNumberFormat();
  const { formatDate, formatTime } = useDateTimeFormat();

  const testNumber = 1234567.89;
  const testDate = new Date();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{t('common:app.title')}</h1>
      <p>{t('common:app.description')}</p>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Language Selector</h2>
        <LanguageSelector />
        <p>Current Language: {currentLanguage}</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Translation Test</h2>
        <div>
          <h3>Common Namespace</h3>
          <p>App Title: {t('common:app.title')}</p>
          <p>Save Action: {t('common:actions.save')}</p>
          <p>Cancel Action: {t('common:actions.cancel')}</p>
        </div>

        <div>
          <h3>Dashboard Namespace</h3>
          <p>Dashboard Title: {t('dashboard:title')}</p>
          <p>Overview: {t('dashboard:overview')}</p>
          <p>Total Chatbots: {t('dashboard:stats.totalChatbots')}</p>
        </div>

        <div>
          <h3>Auth Namespace</h3>
          <p>Login: {t('auth:login')}</p>
          <p>Register: {t('auth:register')}</p>
          <p>Email: {t('auth:email')}</p>
        </div>

        <div>
          <h3>Chatbot Namespace</h3>
          <p>Chatbot Title: {t('chatbot:title')}</p>
          <p>Create Chatbot: {t('chatbot:create')}</p>
          <p>Active Status: {t('chatbot:status.active')}</p>
        </div>

        <div>
          <h3>Settings Namespace</h3>
          <p>Settings Title: {t('settings:title')}</p>
          <p>General Settings: {t('settings:general.title')}</p>
          <p>Language Setting: {t('settings:general.language')}</p>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Formatting Test</h2>
        <div>
          <h3>Number Formatting</h3>
          <p>Number: {formatNumber(testNumber)}</p>
          <p>Currency: {formatCurrency(testNumber)}</p>
        </div>

        <div>
          <h3>Date/Time Formatting</h3>
          <p>Date: {formatDate(testDate)}</p>
          <p>Time: {formatTime(testDate)}</p>
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h2>Supported Languages</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {getSupportedLanguages().map((lang) => (
            <div key={lang.code} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <div style={{ fontSize: '20px' }}>{lang.flag}</div>
              <div><strong>{lang.name}</strong></div>
              <div>{lang.nativeName}</div>
              <div>Direction: {lang.direction}</div>
              <button 
                onClick={() => changeLanguage(lang.code)}
                disabled={lang.code === currentLanguage}
                style={{ 
                  marginTop: '5px', 
                  padding: '5px 10px',
                  backgroundColor: lang.code === currentLanguage ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: lang.code === currentLanguage ? 'default' : 'pointer'
                }}
              >
                {lang.code === currentLanguage ? 'Current' : 'Switch'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default I18nTest; 