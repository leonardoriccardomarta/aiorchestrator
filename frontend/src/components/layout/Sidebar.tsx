import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
  disabled?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  onToggle,
  className,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedItems.has(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.href;

    return (
      <div key={item.href}>
        <Link
          to={item.href}
          className={cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'hover:bg-gray-100 hover:text-gray-900',
            isActive && 'bg-blue-50 text-blue-700 border-r-2 border-blue-700',
            item.disabled && 'opacity-50 cursor-not-allowed',
            level > 0 && 'ml-4',
            collapsed && 'justify-center'
          )}
          onClick={hasChildren ? (e) => {
            e.preventDefault();
            toggleExpanded(item.href);
          } : undefined}
        >
          <span className={cn('flex-shrink-0', collapsed ? 'mr-0' : 'mr-3')}>
            {item.icon}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <svg
                  className={cn(
                    'ml-2 h-4 w-4 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </>
          )}
        </Link>
        
        {hasChildren && !collapsed && (
          <div
            className={cn(
              'overflow-hidden transition-all duration-200 ease-in-out',
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => onToggle?.(true)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
          // Mobile: fixed positioning
          'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto',
          // Responsive width
          collapsed ? 'w-16' : isMobile ? 'w-64' : isTablet ? 'w-56' : 'w-64',
          // Mobile visibility
          collapsed ? 'hidden lg:flex' : 'flex',
          className
        )}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">Menu</span>
          </div>
        )}
        
        <button
          onClick={() => onToggle?.(!collapsed)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {items.map(item => renderItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-xs text-gray-500 text-center">
            AI Orchestrator v2.0
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Sidebar; 