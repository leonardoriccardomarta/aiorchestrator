import React, { useState } from 'react';
import { Layout } from './Layout';
import { NavigationItem } from './Navigation';

const SidebarTest: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample navigation items
  const navigationItems: NavigationItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Chatbots', href: '/chatbots' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Settings', href: '/settings' },
  ];

  const sidebarItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Chatbots',
      href: '/chatbots',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <Layout
      navigationItems={navigationItems}
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🧪 Sidebar Test Component
          </h1>
          <p className="text-gray-600 mb-4">
            This component tests the responsive sidebar functionality. Try resizing your browser window or viewing on mobile.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Desktop Behavior</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sidebar should be visible on the left</li>
                <li>• Content should have proper margin</li>
                <li>• Toggle button should collapse sidebar</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Mobile Behavior</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Sidebar should be hidden by default</li>
                <li>• Menu button should open mobile sidebar</li>
                <li>• Overlay should prevent body scroll</li>
                <li>• Content should take full width</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Card {i}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  This is test content to verify the layout works correctly on different screen sizes.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Browser Information</h2>
          <div className="text-sm text-gray-600">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Screen Width:</strong> {window.innerWidth}px</p>
            <p><strong>Screen Height:</strong> {window.innerHeight}px</p>
            <p><strong>Device Pixel Ratio:</strong> {window.devicePixelRatio}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SidebarTest;
