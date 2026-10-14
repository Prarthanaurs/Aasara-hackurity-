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
import type { Language } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const {
    language,
    setLanguage,
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
      <div className="bg-[#991b1b] text-white px-4 py-1 flex items-center justify-between text-xs sm:text-sm font-bold">
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
            className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-3 py-0.5 rounded-full text-xs font-semibold cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.needHelp[language]}</span>
          </button>
        </div>
      </div>

      {/* Main Bar matching Image 2 */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand with Grandmother Avatar */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Grandmother Avatar */}
          <div className="w-11 h-11 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center overflow-hidden shrink-0 shadow">
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 transform scale-110"
              aria-label="Aasara Grandmother Mascot"
            >
              {/* Saree/Shawl background */}
              <circle cx="50" cy="50" r="48" fill="#f59e0b" />
              {/* Saree Drape */}
              <path d="M15 88 Q50 68 85 88" fill="#ea580c" />
              {/* Face */}
              <circle cx="50" cy="46" r="28" fill="#fed7aa" />
              {/* Silver hair bun */}
              <ellipse cx="50" cy="24" rx="26" ry="16" fill="#e2e8f0" />
              <circle cx="50" cy="12" r="10" fill="#cbd5e1" />
              {/* Spectacles */}
              <circle cx="42" cy="45" r="7" fill="none" stroke="#78350f" strokeWidth="2.5" />
              <circle cx="58" cy="45" r="7" fill="none" stroke="#78350f" strokeWidth="2.5" />
              <line x1="49" y1="45" x2="51" y2="45" stroke="#78350f" strokeWidth="2.5" />
              {/* Eyes */}
              <circle cx="42" cy="45" r="2.5" fill="#451a03" />
              <circle cx="58" cy="45" r="2.5" fill="#451a03" />
              {/* Red Bindi */}
              <circle cx="50" cy="36" r="2.5" fill="#dc2626" />
              {/* Kind Smile */}
              <path d="M43 56 Q50 63 57 56" fill="none" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight group-hover:text-amber-400 transition-colors">
              Aasara
            </span>
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

        {/* Right side controls: Language Dropdown + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Theme Toggle Sun Icon Button matching Image 2 */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-[#2a1a11] border border-amber-600/40 text-amber-400 hover:text-amber-200 hover:bg-[#382317] flex items-center justify-center transition-all cursor-pointer shadow"
            title="Toggle Theme"
          >
            {themeMode === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
