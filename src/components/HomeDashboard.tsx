import React from 'react';
import {
  ShieldAlert,
  CreditCard,
  AlertCircle,
  Users,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HomeDashboardProps {
  onSelectFeature: (feature: 'checker' | 'payment' | 'emergency' | 'tutor' | 'lessons') => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onSelectFeature }) => {
  const { language, t, speak } = useLanguage();

  const cards = [
    {
      id: 'checker' as const,
      title: t.home.cards.checkMessage.title[language],
      desc: t.home.cards.checkMessage.desc[language],
      icon: ShieldAlert,
      bgColor: 'bg-[#d9531e]',
      hoverBg: 'hover:bg-[#ea580c]',
      audioText: `${t.home.cards.checkMessage.title[language]}. ${t.home.cards.checkMessage.desc[language]}`,
    },
    {
      id: 'payment' as const,
      title: t.home.cards.paySafely.title[language],
      desc: t.home.cards.paySafely.desc[language],
      icon: CreditCard,
      bgColor: 'bg-[#15803d]',
      hoverBg: 'hover:bg-[#16a34a]',
      audioText: `${t.home.cards.paySafely.title[language]}. ${t.home.cards.paySafely.desc[language]}`,
    },
    {
      id: 'emergency' as const,
      title: t.home.cards.urgentHelp.title[language],
      desc: t.home.cards.urgentHelp.desc[language],
      icon: AlertCircle,
      bgColor: 'bg-[#b91c1c]',
      hoverBg: 'hover:bg-[#dc2626]',
      audioText: `${t.home.cards.urgentHelp.title[language]}. ${t.home.cards.urgentHelp.desc[language]}`,
    },
    {
      id: 'tutor' as const,
      title: t.home.cards.findTutor.title[language],
      desc: t.home.cards.findTutor.desc[language],
      icon: Users,
      bgColor: 'bg-[#c27803]',
      hoverBg: 'hover:bg-[#d97706]',
      audioText: `${t.home.cards.findTutor.title[language]}. ${t.home.cards.findTutor.desc[language]}`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Title matching Image 2 */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black text-amber-50 tracking-tight">
          {t.home.welcomeTitle[language]}
        </h1>
        <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto font-medium leading-relaxed">
          {t.home.welcomeSubtitle[language]}
        </p>
        <p className="text-sm sm:text-base text-amber-400 font-semibold pt-1">
          {t.home.welcomeHint[language]}
        </p>
      </div>

      {/* 4 Giant Action Cards in 2x2 Grid matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectFeature(card.id)}
              className={`${card.bgColor} ${card.hoverBg} text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between gap-4 cursor-pointer shadow-xl transition-all duration-200 active:scale-98 select-none group border border-white/10`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-black/20 rounded-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {card.title}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 font-medium line-clamp-2">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Speaker Button on Right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(card.audioText, `home-card-${card.id}`);
                }}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-90"
                title="Hear description"
                aria-label={`Hear ${card.title}`}
              >
                <Volume2 className="w-6 h-6 text-white" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
