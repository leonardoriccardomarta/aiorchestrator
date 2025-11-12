import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  return (
    <div className="text-center p-8">
      {icon && <div className="mb-4">{icon}</div>}
      <h2 className="text-xl font-semibold text-slate-600 mb-2">{title}</h2>
      <p className="text-slate-500 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export const EmptyChatbots: React.FC = () => (
  <EmptyState
    title="No chatbots yet"
    description="Create your first chatbot to get started with AI-powered customer support."
  />
);

export const EmptyConnections: React.FC = () => (
  <EmptyState
    title="No connections"
    description="Connect your store to start syncing data and enabling AI features."
  />
);

export const EmptyAnalytics: React.FC = () => (
  <EmptyState
    title="No analytics data"
    description="Analytics will appear here once you start using your chatbots."
  />
);

export const EmptyMessages: React.FC = () => (
  <EmptyState
    title="No messages yet"
    description="Messages will appear here once customers start chatting with your bot."
  />
);

export default EmptyState;
