import React from 'react';
import { Volume2, Sun, Moon, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../types';

export const LanguageOnboarding: React.FC = () => {
  const {
    language,
    setLanguage,
    setShowOnboarding,
    speak,
    themeMode,
    toggleTheme,
    t,
  } = useLanguage();

  const languageOptions: Array<{
    code: Language;
    nativeText: string;
    englishText: string;
    audioPronunciation: string;
  }> = [
    {
      code: 'en',
      nativeText: 'English',
      englishText: 'English',
      audioPronunciation: 'English language. Tap continue to begin.',
    },
    {
      code: 'kn',
      nativeText: 'ಕನ್ನಡ',
      englishText: 'Kannada',
      audioPronunciation: 'ಕನ್ನಡ ಭಾಷೆ. ಮುಂದುವರಿಯಲು ಕಂಟಿನ್ಯೂ ಬಟನ್ ಒತ್ತಿ.',
    },
    {
      code: 'hi',
      nativeText: 'हिंदी',
      englishText: 'Hindi',
      audioPronunciation: 'हिन्दी भाषा। आगे बढ़ने के लिए कंटिन्यू बटन दबाएं।',
    },
    {
      code: 'te',
      nativeText: 'తెలుగు',
      englishText: 'Telugu',
      audioPronunciation: 'తెలుగు భాష. కొనసాగడానికి కంటిన్యూ బటన్ నొక్కండి.',
    },
  ];

  const handleSelectLanguage = (langCode: Language, audioText: string) => {
    setLanguage(langCode);
    speak(audioText, `onboard-lang-${langCode}`);
  };

  const handleContinue = () => {
    setShowOnboarding(false);
    speak(
      language === 'kn'
        ? 'ಆಸರೆಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಮೊಬೈಲ್ ಅನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಳಸಿ.'
        : language === 'hi'
        ? 'आसरा में आपका स्वागत है। आत्मविश्वास के साथ अपने फोन का उपयोग करें।'
        : language === 'te'
        ? 'ఆసరాకు స్వాగతం. మీ ఫోన్‌ను సురక్షితంగా ఉపయోగించండి.'
        : 'Welcome to Aasara! Use your phone with confidence.',
      'welcome-home'
    );
  };

  return (
    <div className="min-h-screen bg-[#1c110a] text-amber-50 flex flex-col justify-between p-4 sm:p-8 select-none transition-colors duration-300">
      {/* Top right theme toggle */}
      <div className="max-w-4xl mx-auto w-full flex justify-end">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-3 rounded-full bg-[#2a1a10] border border-amber-600/50 text-amber-400 hover:text-amber-200 hover:bg-[#382316] transition-all cursor-pointer shadow"
        >
          {themeMode === 'light' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto text-center">
        {/* Header with uploaded logo */}
        <div className="space-y-3 flex flex-col items-center">
          <img
            src="/aasara-logo.png"
            alt="Aasara Logo"
            className="w-20 h-20 object-contain rounded-3xl shadow-xl border-2 border-amber-500/50 bg-[#2b1910] p-1.5"
          />
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-500">
            Aasara
          </h1>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-200/90">
            ಆಸರೆ
          </p>
          <p className="text-base sm:text-lg font-medium text-stone-300">
            {t.tagline[language]}
          </p>
        </div>

        {/* Welcome Instructions Card with border & Read Button */}
        <div className="bg-[#2a1910] border-2 border-amber-600/70 rounded-3xl p-5 sm:p-7 text-left shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
                <Volume2 className="w-7 h-7" />
              </div>
              <p className="text-base sm:text-lg text-stone-200 font-medium leading-relaxed">
                {t.onboarding.welcomeText[language]}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                speak(t.onboarding.welcomeText[language], 'onboarding-instruction')
              }
              className="self-end sm:self-center shrink-0 flex items-center gap-2 py-3 px-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-base shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Read</span>
            </button>
          </div>
        </div>

        {/* Language Chooser Section */}
        <div className="space-y-5 pt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
            {t.onboarding.choosePrompt[language]}
          </h2>

          {/* 4 Language Buttons matching Image 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            {languageOptions.map((opt) => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() =>
                    handleSelectLanguage(opt.code, opt.audioPronunciation)
                  }
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-orange-500 bg-[#351e12] ring-4 ring-orange-500/30 text-orange-400 shadow-xl'
                      : 'border-stone-800 bg-[#251710] hover:bg-[#2e1d14] text-stone-300'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-xl sm:text-2xl font-black">{opt.nativeText}</p>
                    <p className="text-xs sm:text-sm font-semibold opacity-75">
                      {opt.englishText}
                    </p>
                  </div>
                  <Volume2
                    className={`w-6 h-6 shrink-0 ${
                      isSelected ? 'text-orange-400 animate-pulse' : 'text-stone-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-stone-400 italic">
            {t.onboarding.changeNotice[language]}
          </p>
        </div>

        {/* Large Continue Button matching Image 1 */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center justify-center gap-3 py-4 px-10 rounded-2xl font-black text-xl text-white bg-orange-600 hover:bg-orange-500 active:scale-95 shadow-xl shadow-orange-600/30 transition-all cursor-pointer"
          >
            <span>{t.nextStep[language]}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-stone-500 pb-2">
        Aasara Elder Safety Platform • Accessible Voice Companion
      </div>
    </div>
  );
};
