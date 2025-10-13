import React from 'react';
import { cn } from '../../utils/cn';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const DashboardIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const ChatbotIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export const WorkflowIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const RevenueIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const SecurityIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export const PerformanceIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const AuditIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const FAQIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PaymentsIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export const SupportIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export const TriggerIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const StepsIcon: React.FC<IconProps> = ({ size = 'md', className, ...props }) => (
  <svg className={cn(sizeClasses[size], className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

export const ProfessionalIcons = {
  Dashboard: DashboardIcon,
  Chatbot: ChatbotIcon,
  Workflow: WorkflowIcon,
  Analytics: AnalyticsIcon,
  Revenue: RevenueIcon,
  Users: UsersIcon,
  Security: SecurityIcon,
  Performance: PerformanceIcon,
  Audit: AuditIcon,
  FAQ: FAQIcon,
  Payments: PaymentsIcon,
  Support: SupportIcon,
  Settings: SettingsIcon,
  Search: SearchIcon,
  Bell: BellIcon,
  Menu: MenuIcon,
  Close: CloseIcon,
  ChevronDown: ChevronDownIcon,
  ChevronRight: ChevronRightIcon,
  Code: CodeIcon,
  Trigger: TriggerIcon,
  Steps: StepsIcon,
};

export default ProfessionalIcons;
