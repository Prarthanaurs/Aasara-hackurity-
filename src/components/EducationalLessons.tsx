import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Award,
  Video,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { EDUCATIONAL_LESSONS } from '../services/lessonService';
import { SpeakerButton } from './SpeakerButton';
import { VoiceService } from '../services/voiceService';
import { getLangText } from '../utils/langHelper';

export const EducationalLessons: React.FC = () => {
  const { language, t, speak } = useLanguage();

  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [quizAnswers, setQuizAnswers] = useState<{ [lessonId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [lessonId: string]: boolean }>({});

  // Video state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<number>(0);

  // Video script scenes with trilingual subtitles
  const videoScenes = [
    {
      start: 0,
      end: 4,
      title: {
        en: 'Scene 1: An unexpected panic call arrives',
        kn: 'ದೃಶ್ಯ ೧: ಆತಂಕದ ಅನಿರೀಕ್ಷಿತ ಕರೆ ಬರುತ್ತದೆ',
        hi: 'दृश्य १: अचानक घबराहट भरी कॉल आती है',
        te: 'దృశ్యం 1: అకస్మాత్తుగా కంగారు పెట్టే కాల్ వస్తుంది',
      },
      subtitle: {
        en: 'A voice says: "Your electricity will be cut off in 30 minutes! Pay ₹10 now!"',
        kn: 'ಕರೆ ಮಾಡಿದವನು ಹೇಳುತ್ತಾನೆ: "30 ನಿಮಿಷದಲ್ಲಿ ನಿಮ್ಮ ಕರೆಂಟ್ ಕಟ್ ಆಗುತ್ತದೆ! ಈಗಲೇ ₹10 ಕಟ್ಟಿ!"',
        hi: 'एक आवाज़ कहती है: "30 मिनट में बिजली कट जाएगी! अभी ₹10 भरें!"',
        te: 'ఒక గొంతు అంటుంది: "30 నిమిషాల్లో మీ కరెంట్ కట్ అవుతుంది! ఇప్పుడే ₹10 చెల్లించండి!"',
      },
      visual: '⚡📞',
    },
    {
      start: 4,
      end: 9,
      title: {
        en: 'Scene 2: The Golden Rule kicks in',
        kn: 'ದೃಶ್ಯ ೨: ಸುವರ್ಣ ನಿಯಮವನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ',
        hi: 'दृश्य २: स्वर्णिम नियम याद आता है',
        te: 'దృశ్యం 2: గోల్డెన్ రూల్ గుర్తుకు వస్తుంది',
      },
      subtitle: {
        en: 'Pause. Take a deep breath. Utility boards never disconnect power without physical legal notice.',
        kn: 'ಶಾಂತರಾಗಿ. ದೀರ್ಘ ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳಿ. ವಿದ್ಯುತ್ ಇಲಾಖೆ ಲಿಖಿತ ನೋಟಿಸ್ ನೀಡದೆ ರಾತ್ರಿ ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸುವುದಿಲ್ಲ.',
        hi: 'रुकें। गहरी सांस लें। बिजली विभाग बिना लिखित नोटिस के कभी फोन पर लाइन नहीं काटता।',
        te: 'ఆగండి. ప్రశాంతంగా ఉండండి. విద్యుత్ బోర్డులు నోటీసు లేకుండా రాత్రికి రాత్రే విద్యుత్‌ను కట్ చేయవు.',
      },
      visual: '🧘‍♂️🛑',
    },
    {
      start: 9,
      end: 14,
      title: {
        en: 'Scene 3: Never share OTP or PIN to receive money',
        kn: 'ದೃಶ್ಯ ೩: ಹಣ ಪಡೆಯಲು ಒಟಿಪಿ ಅಥವಾ ಪಿನ್ ಎಂದಿಗೂ ಹಾಕಬೇಡಿ',
        hi: 'दृश्य ३: पैसे पाने के लिए कभी ओटीपी या पिन न दें',
        te: 'దృశ్యం 3: డబ్బు పొందడానికి ఓటీపీ లేదా పిన్ ఎప్పుడూ ఇవ్వవద్దు',
      },
      subtitle: {
        en: 'Entering UPI PIN ALWAYS transfers money out of your bank. You are in control.',
        kn: 'ಯುಪಿಐ ಪಿನ್ ಹಾಕಿದರೆ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತವಾಗುತ್ತದೆ! ನಿಮ್ಮ ಹಣವನ್ನು ನೀವೇ ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
        hi: 'यूपीआई पिन डालने से हमेशा आपके खाते से पैसे कटते हैं। नियंत्रण आपके हाथ में है।',
        te: 'యూపీఐ పిన్ నమోదు చేస్తే మీ ఖాతా నుండి డబ్బు కట్ అవుతుంది. నియంత్రణ మీ చేతుల్లోనే ఉంది.',
      },
      visual: '🔒🛡️',
    },
    {
      start: 14,
      end: 18,
      title: {
        en: 'Scene 4: Financial Emergency? Dial 1930',
        kn: 'ದೃಶ್ಯ ೪: ತುರ್ತು ವಂಚನೆಯಾದರೆ? 1930 ಗೆ ಕರೆ ಮಾಡಿ',
        hi: 'दृश्य ४: धोखाधड़ी होने पर? 1930 डायल करें',
        te: 'దృశ్యం 4: అత్యవసర మోసం జరిగితే? 1930 కు కాల్ చేయండి',
      },
      subtitle: {
        en: 'Dial 1930 within the Golden 2 Hours to freeze the scammer account. Stay safe with Aasara!',
        kn: 'ಮೊದಲ 2 ಗಂಟೆಯೊಳಗೆ 1930 ಗೆ ಕರೆ ಮಾಡಿ ವಂಚಕರ ಖಾತೆ ಸ್ಥಗಿತಗೊಳಿಸಿ. ಆಸರಾದೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿರಿ!',
        hi: 'पहले 2 घंटों में 1930 पर कॉल करें ताकि ठग का खाता फ्रीज हो सके। आसरा के साथ सुरक्षित रहें!',
        te: 'గోల్డెన్ 2 గంటల్లోపు 1930 కు కాల్ చేసి మోసగాడి ఖాతాను ఫ్రీజ్ చేయండి. ఆసరాతో సురక్షితంగా ఉండండి!',
      },
      visual: '🚨🎉',
    },
  ];

  // Video timer effect
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoTime((prev) => {
          if (prev >= 18) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentScene =
    videoScenes.find((s) => videoTime >= s.start && videoTime < s.end) || videoScenes[0];

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      VoiceService.stopSpeaking();
    } else {
      setIsPlaying(true);
      speak(currentScene.subtitle[language], 'video-sub-speak');
    }
  };

  const handleRestartVideo = () => {
    setVideoTime(0);
    setIsPlaying(true);
    speak(videoScenes[0].subtitle[language], 'video-sub-speak');
  };

  const activeLesson =
    EDUCATIONAL_LESSONS.find((l) => l.id === activeLessonId) || EDUCATIONAL_LESSONS[0];

  const handleQuizOption = (optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [activeLesson.id]: optionIndex }));
    setQuizSubmitted((prev) => ({ ...prev, [activeLesson.id]: true }));

    const isCorrect = optionIndex === activeLesson.quizQuestion.correctIndex;
    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      speak(
        `${language === 'kn' ? 'ಅದ್ಭುತ! ಸರಿಯಾದ ಉತ್ತರ.' : language === 'hi' ? 'शाबाश! बिल्कुल सही जवाब।' : 'Brilliant! Correct answer.'} ${activeLesson.quizQuestion.explanation[language]}`,
        'quiz-correct'
      );
    } else {
      speak(
        `${language === 'kn' ? 'ಎಚ್ಚರಿಕೆಯಿಂದ ಗಮನಿಸಿ.' : language === 'hi' ? 'ध्यान से देखें।' : 'Take another look.'} ${activeLesson.quizQuestion.explanation[language]}`,
        'quiz-incorrect'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.lessons.title[language]}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-1">
              {t.lessons.subtitle[language]}
            </p>
          </div>

          <SpeakerButton
            textToSpeak={`${t.lessons.title[language]}. ${t.lessons.subtitle[language]}`}
            id="lessons-header-speak"
            size="lg"
            label={t.listen[language]}
          />
        </div>
      </div>

      {/* FEATURE F: EDUCATIONAL VIDEO PLAYER WITH CAPTIONS & TRANSCRIPT */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black">
              {t.lessons.watchVideo[language]}
            </h2>
          </div>

          <span className="text-xs font-mono bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700">
            0:{videoTime < 10 ? `0${videoTime}` : videoTime} / 0:18
          </span>
        </div>

        {/* Video Simulation Canvas Screen */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-950 to-indigo-950 rounded-2xl border border-slate-700 flex flex-col items-center justify-center p-6 text-center overflow-hidden shadow-2xl">
          {/* Animated Visual Emoji */}
          <div className="text-7xl sm:text-8xl mb-4 animate-bounce">
            {currentScene.visual}
          </div>

          <p className="text-lg sm:text-2xl font-black text-amber-300">
            {currentScene.title[language]}
          </p>

          {/* Subtitle / Closed Caption Bar (High contrast for seniors) */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/90 px-4 py-3 rounded-xl border border-white/20 text-white font-bold text-base sm:text-xl leading-snug">
            {currentScene.subtitle[language]}
          </div>
        </div>

        {/* Video Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-slate-950" />
                  <span>
                    {language === 'kn' ? 'ವಿರಾಮ' : language === 'hi' ? 'रोकें' : 'Pause'}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>
                    {language === 'kn' ? 'ವೀಡಿಯೊ ಪ್ಲೇ ಮಾಡಿ' : language === 'hi' ? 'वीडियो चलाएं' : 'Play Video'}
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleRestartVideo}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Speak Subtitle Button */}
          <SpeakerButton
            textToSpeak={currentScene.subtitle[language]}
            id="current-video-subtitle-audio"
            size="md"
            className="bg-slate-800 text-white border-slate-700"
            label={
              language === 'kn'
                ? 'ವಿವರಣೆ ಆಲಿಸಿ'
                : language === 'hi'
                ? 'विवरण सुनें'
                : 'Hear Caption'
            }
          />
        </div>
      </div>

      {/* 2-MINUTE MICRO-LESSONS & QUIZ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-teal-600" />
            <span>
              {language === 'kn'
                ? 'ಸುಲಭ ಪಾಠಗಳು (೨ ನಿಮಿಷ):'
                : language === 'hi'
                ? 'सरल सुरक्षा पाठ (२ मिनट):'
                : 'Interactive 2-Minute Micro-Lessons:'}
            </span>
          </h2>
        </div>

        {/* Lesson selector tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {EDUCATIONAL_LESSONS.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLessonId(lesson.id);
                VoiceService.stopSpeaking();
              }}
              className={`p-4 rounded-2xl border-2 text-left font-bold transition-all cursor-pointer ${
                activeLessonId === lesson.id
                  ? 'bg-teal-700 text-white border-teal-800 shadow-md'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-xs uppercase opacity-80 block">
                {getLangText(lesson.category, language)}
              </span>
              <span className="text-base sm:text-lg line-clamp-1">
                {getLangText(lesson.title, language)}
              </span>
            </button>
          ))}
        </div>

        {/* Active Lesson Content */}
        <div className="p-6 bg-teal-50/60 rounded-3xl border-2 border-teal-200 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-teal-950">
              {getLangText(activeLesson.title, language)}
            </h3>
            <SpeakerButton
              textToSpeak={`${getLangText(activeLesson.title, language)}. ${getLangText(activeLesson.summary, language)}. ${activeLesson.keyRules
                .map((r) => getLangText(r, language))
                .join('. ')}`}
              id={`lesson-speak-${activeLesson.id}`}
              size="md"
            />
          </div>

          <p className="text-lg font-semibold text-slate-800">
            {getLangText(activeLesson.summary, language)}
          </p>

          {/* Key Rules Cards */}
          <div className="space-y-3 pt-2">
            <h4 className="text-base font-extrabold uppercase text-slate-900 tracking-wide">
              {language === 'kn'
                ? 'ಮುಖ್ಯ ನಿಯಮಗಳು:'
                : language === 'hi'
                ? 'मुख्य सुरक्षा नियम:'
                : language === 'te'
                ? 'ముఖ్యమైన భద్రతా నియమాలు:'
                : 'Key Safety Rules to Remember:'}
            </h4>

            <div className="grid gap-2.5">
              {activeLesson.keyRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-teal-200 flex items-start gap-3 shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    ✓
                  </span>
                  <p className="text-base sm:text-lg font-medium text-slate-900">
                    {getLangText(rule, language)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Check Your Knowledge Quiz (Feature F) */}
          <div className="p-6 bg-white rounded-3xl border-2 border-teal-300 space-y-4 mt-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <h4 className="text-xl font-black text-slate-900">
                {t.lessons.quizTitle[language]}
              </h4>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-800">
              {getLangText(activeLesson.quizQuestion.question, language)}
            </p>

            <div className="grid gap-2.5">
              {activeLesson.quizQuestion.options.map((opt, oIdx) => {
                const isSelected = quizAnswers[activeLesson.id] === oIdx;
                const isSubmitted = !!quizSubmitted[activeLesson.id];
                const isCorrect = oIdx === activeLesson.quizQuestion.correctIndex;

                let optClass = 'bg-slate-50 border-slate-300 text-slate-800';
                if (isSubmitted) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black';
                  } else if (isSelected) {
                    optClass = 'bg-red-100 border-red-500 text-red-950';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleQuizOption(oIdx)}
                    className={`p-4 rounded-2xl border-2 text-left text-base sm:text-lg font-bold transition-all cursor-pointer ${optClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{getLangText(opt, language)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {quizSubmitted[activeLesson.id] && (
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-300 text-teal-950 font-bold text-base animate-fadeIn">
                <p>💡 {getLangText(activeLesson.quizQuestion.explanation, language)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
