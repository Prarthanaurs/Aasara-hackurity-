import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, FontSize, TrustedContact } from '../types';
import { translations } from '../i18n/translations';
import { VoiceService } from '../services/voiceService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  t: typeof translations;
  isSpeaking: boolean;
  speakingId: string | null;
  speak: (text: string, id?: string) => void;
  stopSpeaking: () => void;
  trustedContact: TrustedContact;
  setTrustedContact: (contact: TrustedContact) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
}

const defaultContact: TrustedContact = {
  name: 'Ramesh (Son)',
  phone: '9876543210',
  relation: 'Family Member',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('aasara_lang') as Language) || 'kn'; // Default to Kannada or English/Hindi
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('aasara_fontsize') as FontSize) || 'large';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('aasara_highcontrast') === 'true';
  });

  const [trustedContact, setTrustedContactState] = useState<TrustedContact>(() => {
    const saved = localStorage.getItem('aasara_contact');
    return saved ? JSON.parse(saved) : defaultContact;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Sync high contrast and font size classes on document body
  useEffect(() => {
    document.body.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.body.classList.add(`font-${fontSize}`);
    localStorage.setItem('aasara_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('aasara_highcontrast', String(highContrast));
  }, [highContrast]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aasara_lang', lang);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
  };

  const setTrustedContact = (contact: TrustedContact) => {
    setTrustedContactState(contact);
    localStorage.setItem('aasara_contact', JSON.stringify(contact));
  };

  const speak = (text: string, id?: string) => {
    if (isSpeaking && speakingId === id) {
      // Toggle off if tapping same speaker
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
        console.warn('Speech synthesis error:', err);
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
        highContrast,
        setHighContrast,
        t: translations,
        isSpeaking,
        speakingId,
        speak,
        stopSpeaking,
        trustedContact,
        setTrustedContact,
        isHelpModalOpen,
        setIsHelpModalOpen,
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
