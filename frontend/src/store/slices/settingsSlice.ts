import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    shareAnalytics: boolean;
    shareUsageData: boolean;
  };
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    sidebarPosition: 'left' | 'right';
    menuLayout: 'vertical' | 'horizontal';
  };
}

const initialState: SettingsState = {
  notifications: {
    email: true,
    push: true,
    desktop: false,
  },
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD',
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
  },
  privacy: {
    shareAnalytics: true,
    shareUsageData: true,
  },
  display: {
    density: 'comfortable',
    sidebarPosition: 'left',
    menuLayout: 'vertical',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<SettingsState['notifications']>>
    ) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    setDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    updateAccessibilitySettings: (
      state,
      action: PayloadAction<Partial<SettingsState['accessibility']>>
    ) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    updatePrivacySettings: (
      state,
      action: PayloadAction<Partial<SettingsState['privacy']>>
    ) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    updateDisplaySettings: (
      state,
      action: PayloadAction<Partial<SettingsState['display']>>
    ) => {
      state.display = { ...state.display, ...action.payload };
    },
    resetSettings: () => {
      return initialState;
    },
  },
});

export const {
  updateNotificationSettings,
  setLanguage,
  setTimezone,
  setDateFormat,
  setCurrency,
  updateAccessibilitySettings,
  updatePrivacySettings,
  updateDisplaySettings,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 