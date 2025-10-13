import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC = () => {
  // Sample sidebar items
  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>
    },
    {
      label: 'Chat',
      href: '/chat',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 