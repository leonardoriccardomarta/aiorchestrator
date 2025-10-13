import React, { createContext, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, spacing, shadows, animations } from '../../design-system/DesignSystem';

// Accessibility Context
interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  screenReader: boolean;
  toggleHighContrast: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleReducedMotion: () => void;
  toggleScreenReader: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Accessibility Provider Component
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large' || 'medium';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedScreenReader = localStorage.getItem('screenReader') === 'true';

    setHighContrast(savedHighContrast);
    setFontSizeState(savedFontSize);
    setReducedMotion(savedReducedMotion);
    setScreenReader(savedScreenReader);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('reducedMotion', reducedMotion.toString());
    localStorage.setItem('screenReader', screenReader.toString());
  }, [highContrast, fontSize, reducedMotion, screenReader]);

  // Apply accessibility styles to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (highContrast) {
      root.style.setProperty('--high-contrast', 'true');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--border-color', '#000000');
    } else {
      root.style.setProperty('--high-contrast', 'false');
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--background-color');
      root.style.removeProperty('--border-color');
    }

    // Font size
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[fontSize]);

    // Reduced motion
    if (reducedMotion) {
      root.style.setProperty('--reduced-motion', 'true');
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.setProperty('--reduced-motion', 'false');
      root.style.removeProperty('--animation-duration');
    }
  }, [highContrast, fontSize, reducedMotion]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const setFontSize = (size: 'small' | 'medium' | 'large') => setFontSizeState(size);
  const toggleReducedMotion = () => setReducedMotion(!reducedMotion);
  const toggleScreenReader = () => setScreenReader(!screenReader);

  const value: AccessibilityContextType = {
    highContrast,
    fontSize,
    reducedMotion,
    screenReader,
    toggleHighContrast,
    setFontSize,
    toggleReducedMotion,
    toggleScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook to use accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Accessibility Panel Component
const AccessibilityPanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${colors.neutral.white};
  border-radius: 12px;
  box-shadow: ${shadows.xl};
  padding: ${spacing[4]};
  z-index: 1000;
  min-width: 280px;
  ${animations.fadeIn}
`;

const AccessibilityToggle = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  margin-bottom: ${spacing[2]};
  border: 2px solid ${({ active }) => active ? colors.primary[500] : colors.secondary[300]};
  border-radius: 8px;
  background: ${({ active }) => active ? colors.primary[50] : colors.neutral.white};
  color: ${({ active }) => active ? colors.primary[700] : colors.secondary[700]};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: ${colors.primary[400]};
    background: ${colors.primary[50]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary[200]};
  }
`;

const FontSizeSelector = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[4]};
`;

const FontSizeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${spacing[2]} ${spacing[3]};
  border: 2px solid ${({ active }) => active ? colors.primary[500] : colors.secondary[300]};
  border-radius: 6px;
  background: ${({ active }) => active ? colors.primary[500] : colors.neutral.white};
  color: ${({ active }) => active ? colors.neutral.white : colors.secondary[700]};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: ${colors.primary[400]};
    background: ${({ active }) => active ? colors.primary[600] : colors.primary[50]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary[200]};
  }
`;

const AccessibilityLabel = styled.div`
  font-weight: 600;
  margin-bottom: ${spacing[3]};
  color: ${colors.secondary[900]};
  font-size: 1.1rem;
`;

export const AccessibilityPanel: React.FC = () => {
  const {
    highContrast,
    fontSize,
    reducedMotion,
    screenReader,
    toggleHighContrast,
    setFontSize,
    toggleReducedMotion,
    toggleScreenReader,
  } = useAccessibility();

  return (
    <AccessibilityPanelContainer>
      <AccessibilityLabel>Accessibility Settings</AccessibilityLabel>
      
      <AccessibilityToggle
        active={highContrast}
        onClick={toggleHighContrast}
        aria-label="Toggle high contrast mode"
      >
        <span>High Contrast</span>
        <span>{highContrast ? '✓' : '○'}</span>
      </AccessibilityToggle>

      <AccessibilityToggle
        active={reducedMotion}
        onClick={toggleReducedMotion}
        aria-label="Toggle reduced motion"
      >
        <span>Reduced Motion</span>
        <span>{reducedMotion ? '✓' : '○'}</span>
      </AccessibilityToggle>

      <AccessibilityToggle
        active={screenReader}
        onClick={toggleScreenReader}
        aria-label="Toggle screen reader mode"
      >
        <span>Screen Reader Mode</span>
        <span>{screenReader ? '✓' : '○'}</span>
      </AccessibilityToggle>

      <div style={{ marginBottom: spacing[3] }}>
        <div style={{ marginBottom: spacing[2], fontWeight: 500 }}>Font Size</div>
        <FontSizeSelector>
          <FontSizeButton
            active={fontSize === 'small'}
            onClick={() => setFontSize('small')}
            aria-label="Small font size"
          >
            A
          </FontSizeButton>
          <FontSizeButton
            active={fontSize === 'medium'}
            onClick={() => setFontSize('medium')}
            aria-label="Medium font size"
          >
            A
          </FontSizeButton>
          <FontSizeButton
            active={fontSize === 'large'}
            onClick={() => setFontSize('large')}
            aria-label="Large font size"
          >
            A
          </FontSizeButton>
        </FontSizeSelector>
      </div>
    </AccessibilityPanelContainer>
  );
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [items, setItems] = useState<HTMLElement[]>([]);

  const registerItem = (element: HTMLElement | null) => {
    if (element && !items.includes(element)) {
      setItems(prev => [...prev, element]);
    }
  };

  const unregisterItem = (element: HTMLElement | null) => {
    if (element) {
      setItems(prev => prev.filter(item => item !== element));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  useEffect(() => {
    if (items[focusedIndex]) {
      items[focusedIndex].focus();
    }
  }, [focusedIndex, items]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items]);

  return { registerItem, unregisterItem, focusedIndex };
};

// Screen Reader Announcement Component
export const ScreenReaderAnnouncement: React.FC<{ message: string }> = ({ message }) => {
  const { screenReader } = useAccessibility();

  if (!screenReader) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    >
      {message}
    </div>
  );
};

// Focus Trap Component
export const FocusTrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

// Skip Link Component
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  return (
    <a
      href={href}
      style={{
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: colors.primary[600],
        color: colors.neutral.white,
        padding: '8px',
        textDecoration: 'none',
        borderRadius: '4px',
        zIndex: 1001,
        transition: 'top 0.3s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

// High Contrast Styles
export const HighContrastStyles = styled.div`
  --text-color: #000000;
  --background-color: #ffffff;
  --border-color: #000000;
  --link-color: #0000ee;
  --visited-color: #551a8b;
  --focus-color: #000000;
  
  color: var(--text-color);
  background-color: var(--background-color);
  
  * {
    border-color: var(--border-color) !important;
  }
  
  a {
    color: var(--link-color) !important;
    
    &:visited {
      color: var(--visited-color) !important;
    }
    
    &:focus {
      outline: 2px solid var(--focus-color) !important;
      outline-offset: 2px !important;
    }
  }
  
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--focus-color) !important;
    outline-offset: 2px !important;
  }
`;

// Reduced Motion Styles
export const ReducedMotionStyles = styled.div`
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
`; 