import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageTitle; 