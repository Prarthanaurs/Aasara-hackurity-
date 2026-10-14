import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, FontSize, TrustedContact, ThemeMode } from '../types';
import { translations } from '../i18n/translations';
import { VoiceService } from '../services/voiceService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: typeof translations;
  isSpeaking: boolean;
  speakingId: string | null;
  speak: (text: string, id?: string) => void;
  stopSpeaking: () => void;
  trustedContact: TrustedContact;
  setTrustedContact: (contact: TrustedContact) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

const defaultContact: TrustedContact = {
  name: 'Ramesh (Son)',
  phone: '9876543210',
  relation: 'Family Member',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('aasara_lang') as Language) || 'en';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('aasara_fontsize') as FontSize) || 'large';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('aasara_theme') as ThemeMode) || 'dark'; // Warm dark theme as default
  });

  const [showOnboarding, setShowOnboardingState] = useState<boolean>(() => {
    // If not previously completed, show onboarding
    return localStorage.getItem('aasara_onboarding_done') !== 'true';
  });

  const [trustedContact, setTrustedContactState] = useState<TrustedContact>(() => {
    const saved = localStorage.getItem('aasara_contact');
    return saved ? JSON.parse(saved) : defaultContact;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Sync font size
  useEffect(() => {
    document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${fontSize}`);
    localStorage.setItem('aasara_fontsize', fontSize);
  }, [fontSize]);

  // Sync theme
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast');
    if (themeMode === 'light') {
      document.body.classList.add('theme-light');
    } else if (themeMode === 'contrast') {
      document.body.classList.add('theme-high-contrast');
    } else {
      document.body.classList.add('theme-dark');
    }
    localStorage.setItem('aasara_theme', themeMode);
  }, [themeMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aasara_lang', lang);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'contrast' : 'dark'));
  };

  const setShowOnboarding = (show: boolean) => {
    setShowOnboardingState(show);
    if (!show) {
      localStorage.setItem('aasara_onboarding_done', 'true');
    }
  };

  const setTrustedContact = (contact: TrustedContact) => {
    setTrustedContactState(contact);
    localStorage.setItem('aasara_contact', JSON.stringify(contact));
  };

  const speak = (text: string, id?: string) => {
    if (!text) return;
    if (isSpeaking && speakingId === id) {
      VoiceService.stopSpeaking();
      setIsSpeaking(false);
      setSpeakingId(null);
      return;
    }

    setIsSpeaking(true);
    setSpeakingId(id || 'global');

    VoiceService.speak(
      text,
      language,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        setSpeakingId(null);
      },
      (err) => {
        console.warn('Speech synthesis notice:', err);
        setIsSpeaking(false);
        setSpeakingId(null);
      }
    );
  };

  const stopSpeaking = () => {
    VoiceService.stopSpeaking();
    setIsSpeaking(false);
    setSpeakingId(null);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        fontSize,
        setFontSize,
        themeMode,
        setThemeMode,
        toggleTheme,
        t: translations,
        isSpeaking,
        speakingId,
        speak,
        stopSpeaking,
        trustedContact,
        setTrustedContact,
        isHelpModalOpen,
        setIsHelpModalOpen,
        showOnboarding,
        setShowOnboarding,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
