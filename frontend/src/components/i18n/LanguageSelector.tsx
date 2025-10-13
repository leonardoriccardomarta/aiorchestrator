import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage, 
  setLanguage, 
  getCurrentLanguage,
  isRTL 
} from '../../i18n/config';
import { Button, Card, Text, colors, spacing, animations } from '../../design-system/DesignSystem';

// Language Selector Container
const LanguageSelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Language Button
const LanguageButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[2]} ${spacing[3]};
  background: ${colors.neutral.white};
  border: 2px solid ${colors.secondary[300]};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    border-color: ${colors.primary[400]};
    background: ${colors.primary[50]};
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[200]};
  }
  
  ${({ isOpen }) => isOpen && `
    border-color: ${colors.primary[500]};
    background: ${colors.primary[50]};
  `}
`;

// Language Flag
const LanguageFlag = styled.span`
  font-size: 1.25rem;
`;

// Language Name
const LanguageName = styled.span`
  color: ${colors.secondary[700]};
`;

// Dropdown Arrow
const DropdownArrow = styled.span<{ isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${({ isOpen }) => isOpen ? '180deg' : '0deg'});
`;

// Language Dropdown
const LanguageDropdown = styled(Card)<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: ${spacing[1]};
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: translateY(${({ isOpen }) => isOpen ? '0' : '-10px'});
  transition: all 0.2s ease;
  ${animations.fadeIn}
`;

// Language Option
const LanguageOption = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  background: ${({ isActive }) => isActive ? colors.primary[50] : colors.neutral.white};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: ${({ isActive }) => isActive ? colors.primary[100] : colors.secondary[50]};
  }
  
  &:focus {
    outline: none;
    background: ${colors.primary[100]};
  }
  
  ${({ isActive }) => isActive && `
    color: ${colors.primary[700]};
    font-weight: 600;
  `}
`;

// Language Flag in Option
const LanguageOptionFlag = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

// Language Info
const LanguageInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

// Language Native Name
const LanguageNativeName = styled(Text)`
  font-weight: 600;
  margin-bottom: ${spacing[1]};
  color: inherit;
`;

// Language English Name
const LanguageEnglishName = styled(Text)`
  font-size: 0.75rem;
  color: ${colors.secondary[500]};
`;

// RTL Indicator
const RTLIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  font-size: 0.75rem;
  color: ${colors.secondary[500]};
  margin-top: ${spacing[1]};
`;

// Search Input
const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing[2]} ${spacing[3]};
  border: 1px solid ${colors.secondary[300]};
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: ${spacing[2]};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 2px ${colors.primary[200]};
  }
  
  &::placeholder {
    color: ${colors.secondary[400]};
  }
`;

// No Results
const NoResults = styled.div`
  padding: ${spacing[4]};
  text-align: center;
  color: ${colors.secondary[500]};
  font-style: italic;
`;

// Language Group
const LanguageGroup = styled.div`
  margin-bottom: ${spacing[3]};
`;

// Group Title
const GroupTitle = styled(Text)`
  font-weight: 600;
  color: ${colors.secondary[600]};
  margin-bottom: ${spacing[2]};
  padding: 0 ${spacing[4]};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface LanguageSelectorProps {
  variant?: 'button' | 'dropdown' | 'modal';
  showNativeNames?: boolean;
  showFlags?: boolean;
  showRTLIndicator?: boolean;
  grouped?: boolean;
  searchable?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant: _variant = 'dropdown',
  showNativeNames = true,
  showFlags = true,
  showRTLIndicator = true,
  grouped = false,
  searchable = false,
  className,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getCurrentLanguage());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Filter languages based on search term
  const filteredLanguages = Object.entries(SUPPORTED_LANGUAGES).filter(([code, config]) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      code.toLowerCase().includes(searchLower) ||
      config.name.toLowerCase().includes(searchLower) ||
      config.nativeName.toLowerCase().includes(searchLower)
    );
  });

  // Group languages by region
  const groupedLanguages = grouped ? {
    'Western': ['en', 'de', 'fr', 'it', 'es', 'pt'],
    'Eastern': ['zh', 'ja', 'ko', 'ru'],
    'Middle Eastern': ['ar'],
    'South Asian': ['hi'],
  } : null;

  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      await setLanguage(language);
      setCurrentLanguage(language);
      setIsOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const renderLanguageOption = (code: string, config: typeof SUPPORTED_LANGUAGES[SupportedLanguage]) => {
    const isActive = code === currentLanguage;
    const isRTLLanguage = isRTL(code as SupportedLanguage);

    return (
      <LanguageOption
        key={code}
        isActive={isActive}
        onClick={() => handleLanguageChange(code as SupportedLanguage)}
        aria-label={`Select ${config.name} language`}
      >
        {showFlags && (
          <LanguageOptionFlag>{config.flag}</LanguageOptionFlag>
        )}
        
        <LanguageInfo>
          {showNativeNames ? (
            <>
              <LanguageNativeName>{config.nativeName}</LanguageNativeName>
              {config.nativeName !== config.name && (
                <LanguageEnglishName>{config.name}</LanguageEnglishName>
              )}
            </>
          ) : (
            <LanguageNativeName>{config.name}</LanguageNativeName>
          )}
          
          {showRTLIndicator && isRTLLanguage && (
            <RTLIndicator>
              <span>RTL</span>
              <span>→</span>
            </RTLIndicator>
          )}
        </LanguageInfo>
      </LanguageOption>
    );
  };

  const renderLanguageList = () => {
    if (grouped && groupedLanguages) {
      return Object.entries(groupedLanguages).map(([groupName, languageCodes]) => {
        const groupLanguages = filteredLanguages.filter(([code]) => 
          languageCodes.includes(code as SupportedLanguage)
        );
        
        if (groupLanguages.length === 0) return null;
        
        return (
          <LanguageGroup key={groupName}>
            <GroupTitle>{groupName}</GroupTitle>
            {groupLanguages.map(([code, config]) => 
              renderLanguageOption(code, config)
            )}
          </LanguageGroup>
        );
      });
    }
    
    return filteredLanguages.map(([code, config]) => 
      renderLanguageOption(code, config)
    );
  };

  const currentConfig = SUPPORTED_LANGUAGES[currentLanguage];

  return (
    <LanguageSelectorContainer className={className}>
      <LanguageButton
        ref={buttonRef}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('common:actions.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {showFlags && (
          <LanguageFlag>{currentConfig.flag}</LanguageFlag>
        )}
        
        <LanguageName>
          {showNativeNames ? currentConfig.nativeName : currentConfig.name}
        </LanguageName>
        
        <DropdownArrow isOpen={isOpen}>▼</DropdownArrow>
      </LanguageButton>

      <LanguageDropdown
        ref={dropdownRef}
        isOpen={isOpen}
        elevation="lg"
        role="listbox"
        aria-label={t('common:actions.selectLanguage')}
      >
        {searchable && (
          <SearchInput
            type="text"
            placeholder={t('common:placeholders.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={t('common:actions.search')}
          />
        )}
        
        {filteredLanguages.length === 0 ? (
          <NoResults>
            {t('common:messages.noResults')}
          </NoResults>
        ) : (
          renderLanguageList()
        )}
      </LanguageDropdown>
    </LanguageSelectorContainer>
  );
};

// Compact Language Selector
export const CompactLanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = i18n.language;
  const currentFlag = getLanguageFlag(currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="text-lg">{currentFlag}</span>
        <span>{getLanguageName(currentLanguage)}</span>
        <span className="w-4 h-4">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 ${
                currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLanguage === lang.code && (
                <span className="w-4 h-4 ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Language Switcher for RTL Support
export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  const isRTLLanguage = isRTL(currentLanguage);

  const toggleLanguage = async () => {
    const newLanguage = isRTLLanguage ? 'en' : 'ar';
    try {
      await setLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to switch language:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t('common:actions.switchLanguage')}
    >
      {isRTLLanguage ? '🇺🇸 EN' : '🇸🇦 AR'}
    </Button>
  );
}; 

// Helper functions
const getLanguageFlag = (code: string): string => {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang?.flag || '';
};

const getLanguageName = (code: string): string => {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang?.name || 'Unknown';
};

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]; 