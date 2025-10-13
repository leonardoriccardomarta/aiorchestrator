import React from 'react';
import Joyride, { Step } from 'react-joyride';

interface AnalyticsTourProps {
  run: boolean;
  onClose: () => void;
}

const AnalyticsTour: React.FC<AnalyticsTourProps> = ({ run, onClose }) => {
  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to Analytics! Here you can track your chatbot performance in real-time.',
      placement: 'center',
    },
    {
      target: '[data-tour="overview"]',
      content: 'View key metrics like total messages, active users, response time, and satisfaction scores.',
    },
    {
      target: '[data-tour="charts"]',
      content: 'Visualize your data over time with interactive charts showing messages and language distribution.',
    },
    {
      target: '[data-tour="ai-insights"]',
      content: 'Get AI-powered insights and recommendations to improve your chatbot performance (Professional plan).',
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

export default AnalyticsTour;








