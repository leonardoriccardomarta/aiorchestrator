import React from 'react';
import Joyride, { Step } from 'react-joyride';

interface SettingsTourProps {
  run: boolean;
  onClose: () => void;
}

const SettingsTour: React.FC<SettingsTourProps> = ({ run, onClose }) => {
  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to Settings! Manage your account, plan, and preferences here.',
      placement: 'center',
    },
    {
      target: '[data-tour="plan-info"]',
      content: 'View your current plan details, trial status, and upgrade options.',
    },
    {
      target: '[data-tour="account-info"]',
      content: 'Manage your account information including name, email, and member since date.',
    },
    {
      target: '[data-tour="quick-actions"]',
      content: 'Quick access to notifications, security settings, and logout.',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={(data) => {
        if (data.status === 'finished' || data.status === 'skipped') {
          onClose();
        }
      }}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          zIndex: 10000,
        },
      }}
    />
  );
};

export default SettingsTour;








