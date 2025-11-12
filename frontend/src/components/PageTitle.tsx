import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default PageTitle; 
