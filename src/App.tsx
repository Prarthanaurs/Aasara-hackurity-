import React, { useState } from 'react';
import {
  Volume2,
  Square,
  Mic,
  Bot,
  Home,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { LanguageOnboarding } from './components/LanguageOnboarding';
import { HomeDashboard } from './components/HomeDashboard';
import { MessageChecker } from './components/MessageChecker';
import { UpiPaymentGuide } from './components/UpiPaymentGuide';
import { EmergencySupport } from './components/EmergencySupport';
import { AiTutor } from './components/AiTutor';
import { EducationalLessons } from './components/EducationalLessons';
import { HumanHelpModal } from './components/HumanHelpModal';

const MainApp: React.FC = () => {
  const {
    language,
    t,
    isSpeaking,
    stopSpeaking,
    speak,
    showOnboarding,
    pageAudioContent,
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    'home' | 'checker' | 'payment' | 'emergency' | 'tutor' | 'lessons'
  >('home');

  // If initial onboarding is active, render Image 1 layout
  if (showOnboarding) {
    return <LanguageOnboarding />;
  }

  const handleReadAloudBottom = () => {
    if (activeTab === 'payment' && pageAudioContent) {
      speak(pageAudioContent, 'bottom-read-payment');
      return;
    }

    if (activeTab === 'home') {
      speak(
        `${t.home.welcomeTitle[language]}. ${t.home.welcomeSubtitle[language]}. ${t.home.welcomeHint[language]}`,
        'bottom-read-home'
      );
    } else if (activeTab === 'checker') {
      speak(
        `${t.checker.title[language]}. ${t.checker.subtitle[language]}`,
        'bottom-read-checker'
      );
    } else if (activeTab === 'payment') {
      speak(pageAudioContent || t.upi.title[language], 'bottom-read-payment');
    } else if (activeTab === 'emergency') {
      speak(
        `${t.emergency.call1930[language]}. ${t.emergency.goldenHourDesc[language]}`,
        'bottom-read-emergency'
      );
    } else {
      speak(t.tutor.title[language], 'bottom-read-tutor');
    }
  };

  return (
    <div className="app-root-container min-h-screen bg-[#1c110a] text-amber-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white transition-colors duration-300">
      <div>
        <Navbar currentTab={activeTab} onTabChange={setActiveTab} />

        {/* Feature views navigation header when not on home */}
        {activeTab !== 'home' && (
          <div className="max-w-5xl mx-auto px-4 pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#281810] hover:bg-[#382216] border border-amber-600/30 text-amber-300 font-bold text-sm cursor-pointer transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>
                {language === 'kn'
                  ? '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'
                  : language === 'hi'
                  ? '← होम पर वापस जाएं'
                  : language === 'te'
                  ? '← హోమ్‌కు తిరిగి వెళ్లండి'
                  : '← Back to Home'}
              </span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="pb-32">
          {activeTab === 'home' && (
            <HomeDashboard onSelectFeature={(feature) => setActiveTab(feature)} />
          )}
          {activeTab === 'checker' && <MessageChecker />}
          {activeTab === 'payment' && <UpiPaymentGuide />}
          {activeTab === 'emergency' && <EmergencySupport />}
          {activeTab === 'tutor' && <AiTutor />}
          {activeTab === 'lessons' && <EducationalLessons />}
        </main>
      </div>

      {/* Floating AI Bot Assistant Avatar matching bottom-right of Image 2 */}
      <button
        onClick={() => {
          setActiveTab('tutor');
          speak(
            language === 'kn'
              ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಆಸರಾ ಎಐ ಗುರು. ಏನು ಸಹಾಯ ಬೇಕು?'
              : language === 'hi'
              ? 'नमस्ते! मैं आपका आसरा एआई साथी हूँ। क्या सहायता चाहिए?'
              : language === 'te'
              ? 'నమస్కారం! నేను మీ ఆసరా ఏఐ గైడ్‌ని. ఏమి సహాయం కావాలి?'
              : 'Hello! I am your Aasara AI Tutor. How can I help you stay safe?',
            'bot-greeting'
          );
        }}
        className="fixed bottom-24 right-5 sm:right-8 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all ring-4 ring-amber-400/40 animate-bounce"
        title="Ask AI Tutor"
        aria-label="Open AI Tutor"
      >
        <Bot className="w-8 h-8 sm:w-9 sm:h-9" />
      </button>

      {/* Fixed Bottom Accessibility Control Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#160d07]/95 backdrop-blur border-t-2 border-stone-200 dark:border-amber-900/60 py-3 px-4 shadow-2xl transition-colors duration-300">
        <div className="max-w-4xl mx-auto flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
          {/* Read Aloud Button (Orange) */}
          <button
            type="button"
            onClick={handleReadAloudBottom}
            className={`flex items-center gap-2 py-3 px-5 sm:px-6 rounded-2xl font-extrabold text-base sm:text-lg text-white transition-all cursor-pointer active:scale-95 shadow-lg ${
              isSpeaking
                ? 'bg-amber-600 ring-4 ring-amber-400/50 animate-pulse'
                : 'bg-orange-600 hover:bg-orange-500'
            }`}
          >
            <Volume2 className="w-5 h-5 shrink-0" />
            <span>{t.readAloud[language]}</span>
          </button>

          {/* Stop Button */}
          <button
            type="button"
            onClick={stopSpeaking}
            className="flex items-center gap-2 py-3 px-4 sm:px-5 rounded-2xl bg-stone-100 dark:bg-[#28170e] hover:bg-stone-200 dark:hover:bg-[#382014] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-300 dark:border-stone-700 font-bold text-base cursor-pointer active:scale-95 shadow-sm transition-colors"
          >
            <Square className="w-4 h-4 fill-stone-600 dark:fill-stone-400 text-stone-600 dark:text-stone-400" />
            <span>{t.stopReading[language]}</span>
          </button>

          {/* Listen Button (Voice input toggle) */}
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'home') {
                setActiveTab('checker');
              }
              speak(
                language === 'kn'
                  ? 'ಸಂದೇಶ ಅಥವಾ ಪ್ರಶ್ನೆಯನ್ನು ಹೇಳಿ'
                  : language === 'hi'
                  ? 'संदेश या प्रश्न बोलें'
                  : language === 'te'
                  ? 'సందేశం లేదా ప్రశ్నను చెప్పండి'
                  : 'Listening. Please speak now.',
                'listen-prompt'
              );
            }}
            className="flex items-center gap-2 py-3 px-4 sm:px-5 rounded-2xl bg-stone-100 dark:bg-[#28170e] hover:bg-stone-200 dark:hover:bg-[#382014] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-300 dark:border-stone-700 font-bold text-base cursor-pointer active:scale-95 shadow-sm transition-colors"
          >
            <Mic className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.listen[language]}</span>
          </button>
        </div>
      </footer>

      {/* Human Assistance Modal */}
      <HumanHelpModal />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
