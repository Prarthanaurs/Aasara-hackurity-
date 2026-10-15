import React, { useState } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  Volume2,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language, FontSize } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const {
    language,
    setLanguage,
    fontSize,
    setFontSize,
    themeMode,
    toggleTheme,
    t,
    speak,
    setIsHelpModalOpen,
    setShowOnboarding,
  } = useLanguage();

  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);

  const languages: Array<{
    code: Language;
    label: string;
    nativeName: string;
    audioText: string;
  }> = [
    { code: 'en', label: 'English', nativeName: 'English', audioText: 'English' },
    { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', audioText: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', audioText: 'हिन्दी' },
    { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', audioText: 'తెలుగు' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-50 bg-[#1f140e]/95 backdrop-blur border-b border-amber-900/40 shadow-md">
      {/* Top 1930 Emergency Strip */}
      <div className="bg-[#991b1b] text-white px-4 py-1.5 flex items-center justify-between text-xs sm:text-sm font-bold">
        <a
          href="tel:1930"
          className="flex items-center gap-2 hover:underline"
          title="National Cyber Crime Helpline"
        >
          <PhoneCall className="w-4 h-4 animate-pulse text-amber-300" />
          <span>{t.emergencyBadge[language]}</span>
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.needHelp[language]}</span>
          </button>
        </div>
      </div>

      {/* Main Bar with user-uploaded Logo */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand with User's Uploaded Logo (contains both emblem and title) */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center cursor-pointer group select-none"
          title="Aasara Home"
        >
          <div className="bg-white/95 dark:bg-white/95 rounded-2xl px-2.5 py-1 border border-amber-500/40 shadow-md group-hover:scale-105 transition-transform flex items-center">
            <img
              src="/aasara-logo.png"
              alt="Aasara"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-stone-300">
          <button
            onClick={() => onTabChange('home')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'text-amber-400 bg-amber-500/10 underline underline-offset-8 decoration-2'
                : 'hover:text-amber-200'
            }`}
          >
            {t.nav.home[language]}
          </button>

          <button
            onClick={() => onTabChange('checker')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'checker'
                ? 'text-amber-400 bg-amber-500/10 underline underline-offset-8 decoration-2'
                : 'hover:text-amber-200'
            }`}
          >
            {t.nav.checkMessage[language]}
          </button>

          <button
            onClick={() => onTabChange('payment')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'payment'
                ? 'text-amber-400 bg-amber-500/10 underline underline-offset-8 decoration-2'
                : 'hover:text-amber-200'
            }`}
          >
            {t.nav.paySafely[language]}
          </button>

          <button
            onClick={() => onTabChange('emergency')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'emergency'
                ? 'text-red-400 bg-red-500/10 underline underline-offset-8 decoration-2'
                : 'hover:text-red-300'
            }`}
          >
            {t.nav.urgentHelp[language]}
          </button>

          <button
            onClick={() => onTabChange('tutor')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'tutor'
                ? 'text-amber-400 bg-amber-500/10 underline underline-offset-8 decoration-2'
                : 'hover:text-amber-200'
            }`}
          >
            {t.nav.tutor[language]}
          </button>

          <button
            onClick={() => onTabChange('lessons')}
            className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
              currentTab === 'lessons'
                ? 'text-amber-400 bg-amber-500/10 underline underline-offset-8 decoration-2'
                : 'hover:text-amber-200'
            }`}
          >
            {t.nav.lessons[language]}
          </button>
        </nav>

        {/* Right side controls: Font Size Switcher (A, A+, A++) + Language + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Size Accessibility Controls: A, A+, A++ */}
          <div
            className="flex items-center gap-0.5 bg-[#2a1a11] border border-amber-600/40 rounded-xl p-1"
            title="Text Size (A, A+, A++)"
            aria-label="Text Size Selector"
          >
            {(['normal', 'large', 'xlarge'] as FontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-all ${
                  fontSize === size
                    ? 'bg-orange-600 text-white shadow ring-2 ring-orange-400/50'
                    : 'text-amber-200/80 hover:text-white hover:bg-white/10'
                }`}
                title={`Font Size ${size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Extra Large'}`}
                aria-label={`Set font size to ${size}`}
              >
                {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2a1a11] border border-amber-600/40 text-amber-200 text-sm font-bold hover:bg-[#382317] transition-all cursor-pointer"
            >
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#251710] border-2 border-amber-600/60 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-xs font-bold text-amber-500 border-b border-white/10 mb-1">
                  Choose Language / ಭಾಷೆ
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                      speak(l.audioText, `nav-lang-${l.code}`);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-bold flex items-center justify-between hover:bg-[#382317] cursor-pointer ${
                      language === l.code ? 'text-orange-400 bg-amber-500/10' : 'text-stone-200'
                    }`}
                  >
                    <span>{l.nativeName} ({l.label})</span>
                    <Volume2 className="w-4 h-4 opacity-60" />
                  </button>
                ))}

                {/* Button to open the full onboarding screen */}
                <div className="pt-1 mt-1 border-t border-white/10 px-2">
                  <button
                    onClick={() => {
                      setShowOnboarding(true);
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-xs font-semibold py-1.5 px-2 text-center text-amber-400 hover:underline cursor-pointer"
                  >
                    Open Language Screen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Dark and Light) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-[#2a1a11] border border-amber-600/40 text-amber-400 hover:text-amber-200 hover:bg-[#382317] flex items-center justify-center transition-all cursor-pointer shadow"
            title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {themeMode === 'light' ? (
              <Moon className="w-5 h-5 text-indigo-900" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
