import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SpeakerButtonProps {
  textToSpeak: string;
  id: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  textToSpeak,
  id,
  size = 'md',
  label,
  className = '',
}) => {
  const { speak, stopSpeaking, isSpeaking, speakingId, language, t } = useLanguage();
  const isThisSpeaking = isSpeaking && speakingId === id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThisSpeaking) {
      stopSpeaking();
    } else {
      speak(textToSpeak, id);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-sm',
    md: 'p-2.5 text-base',
    lg: 'px-4 py-3 text-lg font-semibold',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isThisSpeaking ? t.stopReading[language] : t.readAloud[language]}
      title={isThisSpeaking ? t.stopReading[language] : t.readAloud[language]}
      className={`inline-flex items-center gap-2 rounded-xl transition-all border shadow-sm select-none cursor-pointer active:scale-95 ${
        isThisSpeaking
          ? 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-300 animate-pulse'
          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
      } ${sizeClasses[size]} ${className}`}
    >
      {isThisSpeaking ? (
        <>
          <VolumeX className="w-5 h-5 shrink-0 animate-bounce" />
          <span>{label || t.stopReading[language]}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 shrink-0" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
};
