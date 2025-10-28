import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import PlanStatusNotification from '../PlanStatusNotification';
import { useResponsive } from '../../hooks/useResponsive';
import { sidebarItems, navigationItems } from '../../config/sidebarConfig';

export interface LayoutProps {
  children: React.ReactNode;
  navigationItems?: any[];
  sidebarItems?: any[];
  user?: any;
  breadcrumbs?: any[];
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  className?: string;
  showSidebar?: boolean;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  navigationItems: customNavigationItems = [],
  sidebarItems: customSidebarItems = [],
  user,
  breadcrumbs,
  onLogout,
  onSearch,
  className,
  showSidebar = true,
  showNavigation = true,
}) => {
  const finalNavigationItems = customNavigationItems.length > 0 ? customNavigationItems : navigationItems;
  const finalSidebarItems = customSidebarItems.length > 0 ? customSidebarItems : sidebarItems;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Navigation */}
      {showNavigation && (
        <Navigation
          items={finalNavigationItems}
          breadcrumbs={breadcrumbs}
          sidebarItems={finalSidebarItems}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            items={finalSidebarItems}
            collapsed={isMobile ? true : sidebarCollapsed}
            onToggle={setSidebarCollapsed}
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            'flex-1 transition-all duration-300 ease-in-out',
            // Desktop sidebar spacing
            showSidebar && isDesktop && (sidebarCollapsed ? 'ml-16' : 'ml-64'),
            // Tablet: smaller margin
            showSidebar && isTablet && (sidebarCollapsed ? 'ml-12' : 'ml-48'),
            // Mobile: no left margin
            isMobile && 'ml-0'
          )}
        >
          <div className={cn(
            'transition-all duration-300 min-h-screen',
            // Responsive padding with centering
            isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6',
            // Center content on desktop always
            isDesktop && 'max-w-7xl mx-auto'
          )}>
            {children}
          </div>
        </main>
      </div>
      
      {/* Plan Status Notifications */}
      <PlanStatusNotification />
    </div>
  );
};

export default Layout;