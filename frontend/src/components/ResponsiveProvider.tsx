import React, { createContext, useContext, ReactNode } from 'react';
import { useResponsive, ResponsiveState } from '../hooks/useResponsive';

interface ResponsiveContextType extends ResponsiveState {
  // Additional responsive utilities
  getResponsiveValue: <T>(values: Partial<Record<keyof ResponsiveState, T>>) => T | undefined;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

interface ResponsiveProviderProps {
  children: ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const responsive = useResponsive();

  const getResponsiveValue = <T,>(values: Partial<Record<keyof ResponsiveState, T>>): T | undefined => {
    // Priority order: mobile -> tablet -> desktop -> large desktop
    if (responsive.isMobile && values.isMobile !== undefined) return values.isMobile;
    if (responsive.isTablet && values.isTablet !== undefined) return values.isTablet;
    if (responsive.isLargeDesktop && values.isLargeDesktop !== undefined) return values.isLargeDesktop;
    if (responsive.isDesktop && values.isDesktop !== undefined) return values.isDesktop;
    
    return undefined;
  };

  const contextValue: ResponsiveContextType = {
    ...responsive,
    getResponsiveValue,
    isSmallScreen: responsive.isMobile,
    isMediumScreen: responsive.isTablet,
    isLargeScreen: responsive.isDesktop || responsive.isLargeDesktop,
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsiveContext = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsiveContext must be used within a ResponsiveProvider');
  }
  return context;
};

// Higher-order component for responsive props
export const withResponsive = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const ResponsiveComponent = (props: P) => {
    const responsive = useResponsiveContext();
    return <Component {...props} responsive={responsive} />;
  };

  ResponsiveComponent.displayName = `withResponsive(${Component.displayName || Component.name})`;
  return ResponsiveComponent;
};

// Hook for conditional rendering based on responsive state
export const useResponsiveRender = () => {
  const responsive = useResponsiveContext();

  return {
    mobile: (component: React.ReactNode) => responsive.isMobile ? component : null,
    tablet: (component: React.ReactNode) => responsive.isTablet ? component : null,
    desktop: (component: React.ReactNode) => responsive.isDesktop ? component : null,
    largeDesktop: (component: React.ReactNode) => responsive.isLargeDesktop ? component : null,
    
    // Combined conditions
    mobileOrTablet: (component: React.ReactNode) => (responsive.isMobile || responsive.isTablet) ? component : null,
    tabletOrDesktop: (component: React.ReactNode) => (responsive.isTablet || responsive.isDesktop) ? component : null,
    
    // Orientation
    portrait: (component: React.ReactNode) => responsive.orientation === 'portrait' ? component : null,
    landscape: (component: React.ReactNode) => responsive.orientation === 'landscape' ? component : null,
  };
};
