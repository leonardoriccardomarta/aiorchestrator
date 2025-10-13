import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useBodyScroll } from '../../hooks/useBodyScroll';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: SidebarItem[];
  className?: string;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  items,
  className,
}) => {
  const location = useLocation();
  
  // Prevent body scroll when mobile menu is open
  useBodyScroll(isOpen);

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const isActive = location.pathname === item.href;
    
    return (
      <div key={item.href}>
        <Link
          to={item.href}
          onClick={onClose}
          className={cn(
            'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
            level > 0 && 'ml-4',
            isActive
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className="text-gray-400">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </div>
          
          {item.badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.badge}
            </span>
          )}
        </Link>

        {item.children && item.children.length > 0 && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={cn(
              'fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50 lg:hidden flex flex-col',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Menu</span>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {items.map(item => renderItem(item))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                AI Orchestrator v2.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
