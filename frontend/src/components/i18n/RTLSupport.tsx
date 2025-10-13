import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';

import { isRTL, getCurrentLanguage } from '../../i18n/config';
import { colors, spacing } from '../../design-system/DesignSystem';

// RTL Container
const RTLContainer = styled.div<{ isRTL: boolean }>`
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  
  /* RTL-specific styles */
  ${({ isRTL }) => isRTL && css`
    /* Flip margins and paddings */
    .rtl-flip {
      margin-left: 0 !important;
      margin-right: auto !important;
    }
    
    /* Flip flexbox order */
    .rtl-flex {
      flex-direction: row-reverse;
    }
    
    /* Flip grid order */
    .rtl-grid {
      direction: rtl;
    }
    
    /* Flip transform origins */
    .rtl-transform {
      transform-origin: right center;
    }
    
    /* Flip animations */
    .rtl-animate {
      animation-direction: reverse;
    }
    
    /* Flip icons */
    .rtl-icon {
      transform: scaleX(-1);
    }
    
    /* Flip borders */
    .rtl-border {
      border-left: none;
      border-right: 2px solid ${colors.primary[500]};
    }
    
    /* Flip shadows */
    .rtl-shadow {
      box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* Flip gradients */
    .rtl-gradient {
      background: linear-gradient(to left, ${colors.primary[500]}, ${colors.primary[600]});
    }
    
    /* Flip text alignment */
    .rtl-text {
      text-align: right;
    }
    
    /* Flip float */
    .rtl-float {
      float: right;
    }
    
    /* Flip position */
    .rtl-position {
      left: auto;
      right: 0;
    }
    
    /* Flip scroll */
    .rtl-scroll {
      direction: rtl;
    }
    
    /* Flip table */
    .rtl-table {
      direction: rtl;
    }
    
    /* Flip form elements */
    .rtl-form {
      text-align: right;
    }
    
    /* Flip input padding */
    .rtl-input {
      padding-left: ${spacing[3]};
      padding-right: ${spacing[4]};
    }
    
    /* Flip button icons */
    .rtl-button-icon {
      margin-left: 0;
      margin-right: ${spacing[2]};
    }
    
    /* Flip dropdown */
    .rtl-dropdown {
      right: auto;
      left: 0;
    }
    
    /* Flip tooltip */
    .rtl-tooltip {
      right: auto;
      left: 0;
    }
    
    /* Flip modal */
    .rtl-modal {
      text-align: right;
    }
    
    /* Flip navigation */
    .rtl-nav {
      flex-direction: row-reverse;
    }
    
    /* Flip breadcrumb */
    .rtl-breadcrumb {
      flex-direction: row-reverse;
    }
    
    /* Flip pagination */
    .rtl-pagination {
      flex-direction: row-reverse;
    }
    
    /* Flip tabs */
    .rtl-tabs {
      flex-direction: row-reverse;
    }
    
    /* Flip accordion */
    .rtl-accordion {
      text-align: right;
    }
    
    /* Flip carousel */
    .rtl-carousel {
      direction: rtl;
    }
    
    /* Flip timeline */
    .rtl-timeline {
      flex-direction: row-reverse;
    }
    
    /* Flip chat */
    .rtl-chat {
      flex-direction: row-reverse;
    }
    
    /* Flip notification */
    .rtl-notification {
      text-align: right;
    }
    
    /* Flip progress */
    .rtl-progress {
      direction: rtl;
    }
    
    /* Flip slider */
    .rtl-slider {
      direction: rtl;
    }
    
    /* Flip switch */
    .rtl-switch {
      flex-direction: row-reverse;
    }
    
    /* Flip checkbox */
    .rtl-checkbox {
      margin-left: 0;
      margin-right: ${spacing[2]};
    }
    
    /* Flip radio */
    .rtl-radio {
      margin-left: 0;
      margin-right: ${spacing[2]};
    }
    
    /* Flip select */
    .rtl-select {
      text-align: right;
    }
    
    /* Flip textarea */
    .rtl-textarea {
      text-align: right;
    }
    
    /* Flip label */
    .rtl-label {
      text-align: right;
    }
    
    /* Flip help text */
    .rtl-help {
      text-align: right;
    }
    
    /* Flip error text */
    .rtl-error {
      text-align: right;
    }
    
    /* Flip success text */
    .rtl-success {
      text-align: right;
    }
    
    /* Flip warning text */
    .rtl-warning {
      text-align: right;
    }
    
    /* Flip info text */
    .rtl-info {
      text-align: right;
    }
  `}
`;

// RTL Provider Component
interface RTLProviderProps {
  children: React.ReactNode;
  forceRTL?: boolean;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ 
  children, 
  forceRTL 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = forceRTL !== undefined ? forceRTL : isRTL(currentLanguage);

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = isRTLLanguage ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Add RTL class to body
    if (isRTLLanguage) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Update CSS custom properties for RTL
    const root = document.documentElement;
    if (isRTLLanguage) {
      root.style.setProperty('--direction', 'rtl');
      root.style.setProperty('--text-align', 'right');
      root.style.setProperty('--float', 'right');
      root.style.setProperty('--margin-start', '0');
      root.style.setProperty('--margin-end', 'auto');
      root.style.setProperty('--padding-start', '0');
      root.style.setProperty('--padding-end', 'auto');
      root.style.setProperty('--border-start', 'none');
      root.style.setProperty('--border-end', '2px solid');
      root.style.setProperty('--transform-origin', 'right center');
      root.style.setProperty('--animation-direction', 'reverse');
    } else {
      root.style.setProperty('--direction', 'ltr');
      root.style.setProperty('--text-align', 'left');
      root.style.setProperty('--float', 'left');
      root.style.setProperty('--margin-start', 'auto');
      root.style.setProperty('--margin-end', '0');
      root.style.setProperty('--padding-start', 'auto');
      root.style.setProperty('--padding-end', '0');
      root.style.setProperty('--border-start', '2px solid');
      root.style.setProperty('--border-end', 'none');
      root.style.setProperty('--transform-origin', 'left center');
      root.style.setProperty('--animation-direction', 'normal');
    }
  }, [isRTLLanguage, currentLanguage]);

  return (
    <RTLContainer isRTL={isRTLLanguage}>
      {children}
    </RTLContainer>
  );
};

// RTL-aware Flex Container
const RTLFlexContainer = styled.div<{ isRTL: boolean; direction?: string }>`
  display: flex;
  flex-direction: ${({ isRTL, direction }) => {
    if (direction) return direction;
    return isRTL ? 'row-reverse' : 'row';
  }};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
`;

interface RTLFlexProps {
  children: React.ReactNode;
  direction?: string;
  className?: string;
}

export const RTLFlex: React.FC<RTLFlexProps> = ({ 
  children, 
  direction, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLFlexContainer 
      isRTL={isRTLLanguage} 
      direction={direction}
      className={className}
    >
      {children}
    </RTLFlexContainer>
  );
};

// RTL-aware Grid Container
const RTLGridContainer = styled.div<{ isRTL: boolean }>`
  display: grid;
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
`;

interface RTLGridProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLGrid: React.FC<RTLGridProps> = ({ children, className }) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLGridContainer isRTL={isRTLLanguage} className={className}>
      {children}
    </RTLGridContainer>
  );
};

// RTL-aware Text Component
const RTLTextContainer = styled.div<{ isRTL: boolean; align?: string }>`
  text-align: ${({ isRTL, align }) => {
    if (align) return align;
    return isRTL ? 'right' : 'left';
  }};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
`;

interface RTLTextProps {
  children: React.ReactNode;
  align?: string;
  className?: string;
}

export const RTLText: React.FC<RTLTextProps> = ({ 
  children, 
  align, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLTextContainer 
      isRTL={isRTLLanguage} 
      align={align}
      className={className}
    >
      {children}
    </RTLTextContainer>
  );
};

// RTL-aware Icon Component
const RTLIconContainer = styled.span<{ isRTL: boolean; flip?: boolean }>`
  display: inline-block;
  transform: ${({ isRTL, flip }) => {
    if (flip || isRTL) return 'scaleX(-1)';
    return 'none';
  }};
`;

interface RTLIconProps {
  children: React.ReactNode;
  flip?: boolean;
  className?: string;
}

export const RTLIcon: React.FC<RTLIconProps> = ({ 
  children, 
  flip, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLIconContainer 
      isRTL={isRTLLanguage} 
      flip={flip}
      className={className}
    >
      {children}
    </RTLIconContainer>
  );
};

// RTL-aware Button Component
const RTLButtonContainer = styled.button<{ isRTL: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  flex-direction: ${({ isRTL }) => isRTL ? 'row-reverse' : 'row'};
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
`;

interface RTLButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const RTLButton: React.FC<RTLButtonProps> = ({ 
  children, 
  onClick, 
  className,
  disabled 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLButtonContainer 
      isRTL={isRTLLanguage}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </RTLButtonContainer>
  );
};

// RTL-aware Input Component
const RTLInputContainer = styled.input<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  padding-left: ${({ isRTL }) => isRTL ? spacing[3] : spacing[4]};
  padding-right: ${({ isRTL }) => isRTL ? spacing[4] : spacing[3]};
`;

interface RTLInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const RTLInput: React.FC<RTLInputProps> = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  disabled 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLInputContainer 
      isRTL={isRTLLanguage}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
    />
  );
};

// RTL-aware Label Component
const RTLLabelContainer = styled.label<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
`;

interface RTLLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const RTLLabel: React.FC<RTLLabelProps> = ({ 
  children, 
  htmlFor, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLLabelContainer 
      isRTL={isRTLLanguage}
      htmlFor={htmlFor}
      className={className}
    >
      {children}
    </RTLLabelContainer>
  );
};

// RTL-aware Select Component
const RTLSelectContainer = styled.select<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  padding-left: ${({ isRTL }) => isRTL ? spacing[3] : spacing[4]};
  padding-right: ${({ isRTL }) => isRTL ? spacing[4] : spacing[3]};
`;

interface RTLSelectProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const RTLSelect: React.FC<RTLSelectProps> = ({ 
  children, 
  value, 
  onChange, 
  className,
  disabled 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLSelectContainer 
      isRTL={isRTLLanguage}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
    >
      {children}
    </RTLSelectContainer>
  );
};

// RTL-aware Textarea Component
const RTLTextareaContainer = styled.textarea<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  padding-left: ${({ isRTL }) => isRTL ? spacing[3] : spacing[4]};
  padding-right: ${({ isRTL }) => isRTL ? spacing[4] : spacing[3]};
`;

interface RTLTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  rows?: number;
  cols?: number;
}

export const RTLTextarea: React.FC<RTLTextareaProps> = ({ 
  placeholder,
  value,
  onChange,
  className,
  disabled,
  rows,
  cols 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLTextareaContainer 
      isRTL={isRTLLanguage}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      rows={rows}
      cols={cols}
    />
  );
};

// RTL-aware Navigation Component
const RTLNavigationContainer = styled.nav<{ isRTL: boolean }>`
  display: flex;
  flex-direction: ${({ isRTL }) => isRTL ? 'row-reverse' : 'row'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
`;

interface RTLNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLNavigation: React.FC<RTLNavigationProps> = ({ 
  children, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLNavigationContainer 
      isRTL={isRTLLanguage}
      className={className}
    >
      {children}
    </RTLNavigationContainer>
  );
};

// RTL-aware List Component
const RTLListContainer = styled.ul<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  padding-left: ${({ isRTL }) => isRTL ? '0' : '1.5em'};
  padding-right: ${({ isRTL }) => isRTL ? '1.5em' : '0'};
`;

interface RTLListProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLList: React.FC<RTLListProps> = ({ 
  children, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLListContainer 
      isRTL={isRTLLanguage}
      className={className}
    >
      {children}
    </RTLListContainer>
  );
};

// RTL-aware Table Component
const RTLTableContainer = styled.table<{ isRTL: boolean }>`
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
`;

interface RTLTableProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLTable: React.FC<RTLTableProps> = ({ 
  children, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLTableContainer 
      isRTL={isRTLLanguage}
      className={className}
    >
      {children}
    </RTLTableContainer>
  );
};

// RTL-aware Modal Component
const RTLModalContainer = styled.div<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
`;

interface RTLModalProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLModal: React.FC<RTLModalProps> = ({ 
  children, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLModalContainer 
      isRTL={isRTLLanguage}
      className={className}
    >
      {children}
    </RTLModalContainer>
  );
};

// RTL-aware Tooltip Component
const RTLTooltipContainer = styled.div<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  right: ${({ isRTL }) => isRTL ? 'auto' : '0'};
  left: ${({ isRTL }) => isRTL ? '0' : 'auto'};
`;

interface RTLTooltipProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLTooltip: React.FC<RTLTooltipProps> = ({ 
  children, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLTooltipContainer 
      isRTL={isRTLLanguage}
      className={className}
    >
      {children}
    </RTLTooltipContainer>
  );
};

// RTL-aware Dropdown Component
const RTLDropdownContainer = styled.div<{ isRTL: boolean }>`
  text-align: ${({ isRTL }) => isRTL ? 'right' : 'left'};
  direction: ${({ isRTL }) => isRTL ? 'rtl' : 'ltr'};
  right: ${({ isRTL }) => isRTL ? 'auto' : '0'};
  left: ${({ isRTL }) => isRTL ? '0' : 'auto'};
`;

interface RTLDropdownProps {
  children: React.ReactNode;
  className?: string;
}

export const RTLDropdown: React.FC<RTLDropdownProps> = ({ 
  children, 
  className 
}) => {
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  return (
    <RTLDropdownContainer 
      isRTL={isRTLLanguage}
      className={className}
    >
      {children}
    </RTLDropdownContainer>
  );
}; 