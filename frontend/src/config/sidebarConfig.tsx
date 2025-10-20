import React from 'react';
import { 
  Home, 
  Bot, 
  Workflow, 
  BarChart3, 
  ShoppingCart, 
  Settings, 
  HelpCircle, 
  CreditCard, 
  User, 
  Zap,
  Globe,
  Database,
  TrendingUp,
  MessageSquare,
  FileText,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

export const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'My Chatbot',
    href: '/chatbot',
    icon: <Bot className="w-5 h-5" />,
    badge: 'LIVE'
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    label: 'Store Connections',
    href: '/connections',
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: 'Pricing',
    href: '/pricing',
    icon: <DollarSign className="w-5 h-5" />,
  },
];

export const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="w-4 h-4" />,
  },
  {
    label: 'My Chatbot',
    href: '/chatbot',
    icon: <Bot className="w-4 h-4" />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: 'Store Connections',
    href: '/connections',
    icon: <ShoppingCart className="w-4 h-4" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-4 h-4" />,
  },
  {
    label: 'Pricing',
    href: '/pricing',
    icon: <DollarSign className="w-4 h-4" />,
  },
];

