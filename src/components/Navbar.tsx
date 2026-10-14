import React from 'react';
import { Shield, PhoneCall, Volume2, UserCheck, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language, FontSize } from '../types';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    t,
    speak,
    setIsHelpModalOpen,
  } = useLanguage();

  const languages: Array<{ code: Language; label: string; nativeName: string; audioText: string }> = [
    {
      code: 'kn',
      label: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      audioText: 'ಕನ್ನಡ ಭಾಷೆ. ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.',
    },
    {
      code: 'hi',
      label: 'Hindi',
      nativeName: 'हिन्दी',
      audioText: 'हिन्दी भाषा। यहाँ क्लिक करें।',
    },
    {
      code: 'en',
      label: 'English',
      nativeName: 'English',
      audioText: 'English language. Click here.',
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-colors duration-200">
      {/* Top emergency strip */}
      <div className="bg-red-700 text-white px-3 py-1.5 flex flex-wrap items-center justify-between text-sm sm:text-base font-semibold">
        <a
          href="tel:1930"
          className="flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
          aria-label={t.emergencyBadge[language]}
        >
          <PhoneCall className="w-5 h-5 animate-pulse text-amber-300" />
          <span>{t.emergencyBadge[language]}</span>
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center gap-1.5 bg-red-800 hover:bg-red-900 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-red-500 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>{t.needHelp[language]}</span>
          </button>
        </div>
      </div>

      {/* Main app bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md">
              <Shield className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-blue-900">
                  {t.appName[language]}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  Elder Safe
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 line-clamp-1">
                {t.tagline[language]}
              </p>
            </div>
          </div>

          {/* Quick speech guidance button for seniors */}
          <button
            onClick={() =>
              speak(
                language === 'kn'
                  ? 'ಆಸರಾ ಆ್ಯಪ್‌ಗೆ ಸುಸ್ವಾಗತ. ಇದು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಭದ್ರತೆಯ ಆಪ್ತ ಸ್ನೇಹಿತ.'
                  : language === 'hi'
                  ? 'आसरा ऐप में आपका स्वागत है। यह आपकी डिजिटल सुरक्षा का सच्चा साथी है।'
                  : 'Welcome to Aasara. Your companion for safe digital payments and cyber safety.',
                'nav-welcome'
              )
            }
            aria-label="Welcome audio guidance"
            className="md:hidden p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Accessibility & Language Bar */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
          {/* Trilingual Selector with preview speaker buttons */}
          <div
            role="group"
            aria-label={t.languageSelection.title[language]}
            className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-300"
          >
            {languages.map((langItem) => {
              const isSelected = language === langItem.code;
              return (
                <div key={langItem.code} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(langItem.code);
                      speak(langItem.audioText, `lang-${langItem.code}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-400'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {langItem.nativeName}
                  </button>

                  {/* Speaker icon beside each language choice to hear option */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(langItem.audioText, `audio-preview-${langItem.code}`);
                    }}
                    title={`Hear ${langItem.label}`}
                    aria-label={`Hear ${langItem.label} audio`}
                    className="p-1 text-slate-500 hover:text-blue-700 hover:bg-slate-200 rounded-lg mr-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Accessibility controls: Font Scale & High Contrast */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-300">
            {/* Font scaling */}
            <div className="flex items-center gap-0.5" title={t.textSize[language]}>
              {(['normal', 'large', 'xlarge'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer ${
                    fontSize === size
                      ? 'bg-indigo-700 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                  aria-label={`Set text size ${size}`}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            <div className="h-5 w-px bg-slate-300 mx-0.5" />

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                highContrast
                  ? 'bg-amber-400 text-black ring-2 ring-amber-500'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
              title={t.highContrast[language]}
              aria-label={t.highContrast[language]}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{t.highContrast[language]}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
