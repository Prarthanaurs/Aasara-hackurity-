import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  PhoneCall,
  GraduationCap,
  BookOpen,
  Volume2,
  VolumeX,
  UserCheck,
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { MessageChecker } from './components/MessageChecker';
import { UpiPaymentGuide } from './components/UpiPaymentGuide';
import { EmergencySupport } from './components/EmergencySupport';
import { AiTutor } from './components/AiTutor';
import { EducationalLessons } from './components/EducationalLessons';
import { HumanHelpModal } from './components/HumanHelpModal';

const AppContent: React.FC = () => {
  const { language, t, isSpeaking, stopSpeaking, speak, setIsHelpModalOpen } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    'checker' | 'payment' | 'emergency' | 'tutor' | 'lessons'
  >('checker');

  const tabList = [
    {
      id: 'checker',
      label: t.tabs.checker[language],
      icon: ShieldAlert,
      color: 'text-blue-700',
      activeBg: 'bg-blue-700 text-white',
    },
    {
      id: 'payment',
      label: t.tabs.payment[language],
      icon: Send,
      color: 'text-emerald-700',
      activeBg: 'bg-emerald-700 text-white',
    },
    {
      id: 'emergency',
      label: t.tabs.emergency[language],
      icon: PhoneCall,
      color: 'text-red-700',
      activeBg: 'bg-red-700 text-white animate-pulse',
    },
    {
      id: 'tutor',
      label: t.tabs.tutor[language],
      icon: GraduationCap,
      color: 'text-purple-700',
      activeBg: 'bg-purple-700 text-white',
    },
    {
      id: 'lessons',
      label: t.tabs.lessons[language],
      icon: BookOpen,
      color: 'text-teal-700',
      activeBg: 'bg-teal-700 text-white',
    },
  ];

  const handleTabChange = (tabId: any) => {
    stopSpeaking();
    setActiveTab(tabId);
    const tabObj = tabList.find((x) => x.id === tabId);
    if (tabObj) {
      speak(tabObj.label, `tab-${tabId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200">
      <div>
        <Navbar />

        {/* Big accessible navigation tabs for seniors */}
        <nav
          aria-label="Main features"
          className="max-w-6xl mx-auto px-4 pt-4 pb-2"
        >
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-white p-2 rounded-3xl shadow-sm border border-slate-200">
            {tabList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:py-3.5 sm:px-4 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer select-none active:scale-95 ${
                    isActive
                      ? `${tab.activeBg} shadow-lg ring-2 ring-slate-300`
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  } ${tab.id === 'emergency' && !isActive ? 'border-red-300 bg-red-50 text-red-800' : ''}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span className="text-center sm:text-left leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Feature Component Render */}
        <main className="pb-24">
          {activeTab === 'checker' && <MessageChecker />}
          {activeTab === 'payment' && <UpiPaymentGuide />}
          {activeTab === 'emergency' && <EmergencySupport />}
          {activeTab === 'tutor' && <AiTutor />}
          {activeTab === 'lessons' && <EducationalLessons />}
        </main>
      </div>

      {/* Persistent Elder Safety Bottom Action Bar */}
      <footer className="sticky bottom-0 z-40 bg-white/95 backdrop-blur border-t-2 border-slate-300 py-3 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Audio Speaking Status / Stop Audio */}
          {isSpeaking ? (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-amber-500 text-white font-bold text-sm sm:text-base border border-amber-600 shadow cursor-pointer animate-pulse"
            >
              <VolumeX className="w-5 h-5" />
              <span>{t.stopReading[language]}</span>
            </button>
          ) : (
            <button
              onClick={() =>
                speak(
                  language === 'kn'
                    ? 'ನೀವು ಆಸರಾ ಮುಖ್ಯ ಪರದೆಯಲ್ಲಿದ್ದೀರಿ. ನಿಮಗೆ ಬೇಕಾದ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ.'
                    : language === 'hi'
                    ? 'आप आसरा ऐप में हैं। अपनी पसंद का विकल्प चुनें।'
                    : 'You are on Aasara. Tap any button to proceed safely.',
                  'bottom-guide'
                )
              }
              className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-sm sm:text-base border border-indigo-200 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>{t.repeatInstruction[language]}</span>
            </button>
          )}

          {/* Quick Human Assistance */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow cursor-pointer active:scale-95"
          >
            <UserCheck className="w-5 h-5" />
            <span>{t.needHelp[language]}</span>
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
      <AppContent />
    </LanguageProvider>
  );
}
