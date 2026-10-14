import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TUTOR_SCENARIOS, COMMON_QUESTIONS } from '../services/tutorService';
import { SpeakerButton } from './SpeakerButton';
import { VoiceService } from '../services/voiceService';

export const AiTutor: React.FC = () => {
  const { language, t, speak } = useLanguage();

  const [activeTab, setActiveTab] = useState<'practice' | 'chat'>('practice');

  // Practice Scenario State
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Chat State
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatLog, setChatLog] = useState<
    Array<{ sender: 'user' | 'tutor'; text: string; id: string }>
  >([
    {
      id: 'welcome',
      sender: 'tutor',
      text:
        language === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಆಸರಾ ಸ್ನೇಹಿತ. ಡಿಜಿಟಲ್ ಪಾವತಿ ಅಥವಾ ಸೈಬರ್ ಭದ್ರತೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಅನುಮಾನವಿದ್ದರೂ ಮುಕ್ತವಾಗಿ ಕೇಳಿ. ಯಾವುದೇ ಪ್ರಶ್ನೆ ಚಿಕ್ಕದಲ್ಲ!'
          : language === 'hi'
          ? 'नमस्ते! मैं आपका आसरा साथी हूँ। डिजिटल भुगतान या ऑनलाइन सुरक्षा को लेकर कोई भी सवाल बेझिझक पूछें। कोई भी सवाल छोटा नहीं होता!'
          : 'Hello! I am your Aasara Saathi. Ask me any question about digital payments, phone scams, or cyber safety without hesitation!',
    },
  ]);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);

  const currentScenario = TUTOR_SCENARIOS[currentScenarioIndex];

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
    const opt = currentScenario.options[index];
    const feedbackText = opt.feedback[language];
    speak(feedbackText, `tutor-feedback-${index}`);
  };

  const handleNextScenario = () => {
    setSelectedOptionIndex(null);
    setCurrentScenarioIndex((prev) => (prev + 1) % TUTOR_SCENARIOS.length);
    VoiceService.stopSpeaking();
  };

  const handleVoiceChat = () => {
    if (isVoiceActive) {
      VoiceService.stopSpeaking();
      setIsVoiceActive(false);
      return;
    }

    VoiceService.startListening(
      language,
      (transcript) => {
        setUserQuery(transcript);
        setIsVoiceActive(false);
        handleSendQuery(transcript);
      },
      (err) => {
        console.warn(err);
        setIsVoiceActive(false);
      },
      () => setIsVoiceActive(false)
    );
    setIsVoiceActive(true);
  };

  const handleSendQuery = (queryText?: string) => {
    const textToSend = (queryText || userQuery).trim();
    if (!textToSend) return;

    const userMsgId = `user-${Date.now()}`;
    const tutorMsgId = `tutor-${Date.now()}`;

    // Add user message
    setChatLog((prev) => [
      ...prev,
      { sender: 'user', text: textToSend, id: userMsgId },
    ]);
    setUserQuery('');

    // Generate intelligent, empathetic elder safety response
    setTimeout(() => {
      let responseText = '';
      const qLower = textToSend.toLowerCase();

      if (qLower.includes('otp') || qLower.includes('ಒಟಿಪಿ') || qLower.includes('ओटीपी')) {
        responseText =
          language === 'kn'
            ? 'ಒಟಿಪಿ (OTP) ಎಂದರೆ ನಿಮ್ಮ ಖಾತೆಯ ರಹಸ್ಯ ಬೀಗದ ಕೈ. ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ ಅಥವಾ ಪೊಲೀಸ್ ಎಂದು ಹೇಳಿದವರಿಗೂ ಒಟಿಪಿ ನೀಡಬೇಡಿ. ಬ್ಯಾಂಕ್ ಸಿಬ್ಬಂದಿ ನಿಮ್ಮ ಒಟಿಪಿ ಕೇಳುವ ಅಧಿಕಾರ ಹೊಂದಿಲ್ಲ.'
            : language === 'hi'
            ? 'ओटीपी आपके बैंक खाते की गुप्त चाबी है। कोई कितना भी बड़ा अधिकारी बनकर फोन करे, ओटीपी कभी किसी को न बताएं। बैंक कर्मी भी ओटीपी नहीं मांग सकते।'
            : 'An OTP is your secret digital key. Never share it with anyone, even if they claim to be a police officer or bank manager. Genuine bank staff will NEVER ask for your OTP.';
      } else if (qLower.includes('pin') || qLower.includes('ಪಿನ್') || qLower.includes('पिन')) {
        responseText =
          language === 'kn'
            ? 'ನೆನಪಿಡಿ: ಯುಪಿಐ ಪಿನ್ ಹಾಕಿದರೆ ಹಣ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹೋಗುತ್ತದೆ! ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ. ಯಾರಾದರೂ ಹಣ ಕಳುಹಿಸಲು ಪಿನ್ ಹಾಕಿ ಎಂದರೆ ಅದು ಖಂಡಿತ ವಂಚನೆ.'
            : language === 'hi'
            ? 'याद रखें: यूपीआई पिन केवल पैसे भेजने के लिए होता है! पैसे पाने के लिए कभी पिन नहीं डालना होता। कोई कहे कि पैसे लेने के लिए पिन डालो, तो वह ठग है।'
            : 'Remember: Entering a UPI PIN always transfers money OUT of your bank account. You NEVER need to enter a PIN to receive money.';
      } else if (
        qLower.includes('electricity') ||
        qLower.includes('ವಿದ್ಯುತ್') ||
        qLower.includes('बिजली') ||
        qLower.includes('bill')
      ) {
        responseText =
          language === 'kn'
            ? 'ಕರೆಂಟ್ ಬಿಲ್ ಕಡಿತದ ಬೆದರಿಕೆ ಅತ್ಯಂತ ಸಾಮಾನ್ಯ ವಂಚನೆ! ವಿದ್ಯುತ್ ಇಲಾಖೆಯವರು ರಾತ್ರಿ ಫೋನ್ ಮಾಡಿ ಬೆದರಿಸುವುದಿಲ್ಲ. ನಿಮ್ಮ ಮನೆಯ ಬಿಲ್ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ನೇರವಾಗಿ ಕಚೇರಿಗೆ ಹೋಗಿ ಪಾವತಿಸಿ.'
            : language === 'hi'
            ? 'बिजली कटने का मैसेज सबसे आम धोखाधड़ी है! बिजली दफ्तर वाले रात को फोन करके धमकी नहीं देते। अपने घर का बिल देखें और केवल आधिकारिक दफ्तर या ऐप से भरें।'
            : 'The electricity cut-off message is an extremely common scam. Utility boards do not threaten disconnects over WhatsApp or personal calls at night. Verify directly with your local office.';
      } else {
        responseText =
          language === 'kn'
            ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬಹಳ ಮುಖ್ಯವಾದುದು. ಅಪರಿಚಿತ ಕರೆಗಳು ಅಥವಾ ಸಂದೇಶ ಬಂದಾಗ: ೧) ಗಾಬರಿಯಾಗಬೇಡಿ, ೨) ಯಾವುದೇ ಲಿಂಕ್ ಮುಟ್ಟಬೇಡಿ, ೩) ನಿಮ್ಮ ಮಕ್ಕಳೊಂದಿಗೆ ಅಥವಾ ಬ್ಯಾಂಕ್ ಶಾಖೆಯೊಂದಿಗೆ ಮೊದಲು ಚರ್ಚಿಸಿ.'
            : language === 'hi'
            ? 'आपका सवाल बहुत महत्वपूर्ण है। जब भी कोई अनजान कॉल या मैसेज आए: 1) घबराएं नहीं, 2) कोई लिंक न खोलें, 3) अपने परिवार या बैंक शाखा से सलाह जरूर लें।'
            : 'A wonderful safety question. Whenever you face an unexpected call or message: 1) Do not panic, 2) Never tap unverified links, 3) Discuss with your family or bank branch before taking action.';
      }

      setChatLog((prev) => [
        ...prev,
        { sender: 'tutor', text: responseText, id: tutorMsgId },
      ]);

      // Read aloud response
      speak(responseText, tutorMsgId);
    }, 500);
  };

  const handleQuickQuestionClick = (q: (typeof COMMON_QUESTIONS)[0]) => {
    setUserQuery(q.label[language]);
    handleSendQuery(q.label[language]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Feature E — Safe Practice & AI Guide
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 flex items-center gap-2">
              <Bot className="w-8 h-8 text-purple-600" />
              <span>{t.tutor.title[language]}</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-1">
              {t.tutor.subtitle[language]}
            </p>
          </div>

          <SpeakerButton
            textToSpeak={`${t.tutor.title[language]}. ${t.tutor.subtitle[language]}`}
            id="tutor-header-speak"
            size="lg"
            label={t.listen[language]}
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 mt-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('practice')}
            className={`pb-3 font-bold text-lg sm:text-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'practice'
                ? 'text-purple-700 border-b-4 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span>{t.tutor.practiceTab[language]}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 font-bold text-lg sm:text-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'text-purple-700 border-b-4 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>{t.tutor.chatTab[language]}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRACTICE SCENARIOS */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Scenario {currentScenarioIndex + 1} of {TUTOR_SCENARIOS.length}
            </span>

            <button
              onClick={handleNextScenario}
              className="text-sm font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {language === 'kn'
                  ? 'ಮುಂದಿನ ಸನ್ನಿವೇಶ'
                  : language === 'hi'
                  ? 'अगला परिदृश्य'
                  : 'Next Scenario'}
              </span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentScenario.title[language]}
            </h2>
          </div>

          {/* Simulated Scammer Message Card with Call Audio */}
          <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wide text-red-700 flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                {language === 'kn'
                  ? 'ನಕಲಿ ಕರೆಯ ಧ್ವನಿ / ಸಂದೇಶ:'
                  : language === 'hi'
                  ? 'फर्जी कॉल या संदेश:'
                  : 'Simulated Scammer Pitch:'}
              </span>

              <SpeakerButton
                textToSpeak={currentScenario.scammerAudioText[language]}
                id={`scammer-audio-${currentScenario.id}`}
                size="md"
                label={
                  language === 'kn'
                    ? 'ಕರೆಯನ್ನು ಆಲಿಸಿ'
                    : language === 'hi'
                    ? 'कॉल सुनें'
                    : 'Hear Call'
                }
              />
            </div>

            <p className="text-lg sm:text-xl font-medium text-red-950 italic">
              "{currentScenario.scammerMessage[language]}"
            </p>
          </div>

          {/* Options to Choose */}
          <div className="space-y-3 pt-2">
            <p className="text-base font-bold text-slate-800">
              {language === 'kn'
                ? 'ನೀವು ಏನು ಮಾಡುತ್ತೀರಿ? (ಒಂದು ಉತ್ತರವನ್ನು ಆರಿಸಿ):'
                : language === 'hi'
                ? 'आप क्या करेंगे? (एक उत्तर चुनें):'
                : 'What would you do? (Tap an option):'}
            </p>

            <div className="grid gap-3">
              {currentScenario.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`p-5 rounded-2xl border-2 text-left text-lg font-bold transition-all cursor-pointer ${
                      isSelected
                        ? option.isSafe
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md ring-4 ring-emerald-100'
                          : 'bg-red-50 border-red-500 text-red-950 shadow-md ring-4 ring-red-100'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{option.text[language]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Display */}
          {selectedOptionIndex !== null && (
            <div
              className={`p-6 rounded-3xl border-2 space-y-4 animate-fadeIn ${
                currentScenario.options[selectedOptionIndex].isSafe
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {currentScenario.options[selectedOptionIndex].isSafe ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-xl font-black">
                    {currentScenario.options[selectedOptionIndex].isSafe
                      ? language === 'kn'
                        ? 'ಅತ್ಯುತ್ತಮ ನಿರ್ಧಾರ!'
                        : language === 'hi'
                        ? 'शाबाश! सही फैसला!'
                        : 'Safe & Wise Choice!'
                      : language === 'kn'
                      ? 'ಎಚ್ಚರ! ಇದೊಂದು ವಂಚನೆಯ ಬಲೆ!'
                      : language === 'hi'
                      ? 'सावधान! यह ठगी का जाल है!'
                      : 'Watch Out! This is how they trap victims.'}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold mt-1">
                    {currentScenario.options[selectedOptionIndex].feedback[language]}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="py-3 px-6 rounded-xl font-bold text-base bg-slate-900 text-white hover:bg-slate-800 active:scale-95 cursor-pointer shadow"
                >
                  {language === 'kn'
                    ? 'ಮುಂದಿನ ಸವಾಲು ಪ್ರಯತ್ನಿಸಿ'
                    : language === 'hi'
                    ? 'अगली चुनौती आजमाएं'
                    : 'Try Next Challenge'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASK AASARA SAATHI (EMPATHETIC Q&A) */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {language === 'kn'
                ? 'ಆಸರಾ ಸ್ನೇಹಿತನೊಂದಿಗೆ ಮಾತನಾಡಿ'
                : language === 'hi'
                ? 'आसरा साथी से बातचीत'
                : 'Chat with Aasara Saathi'}
            </h2>
            <p className="text-base text-slate-600 mt-1">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ಯಾವುದೇ ಅನುಮಾನಗಳನ್ನು ಕೇಳಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳ ಮೇಲೆ ಒತ್ತಿ:'
                : language === 'hi'
                ? 'कोई भी शंका पूछें या नीचे दिए गए प्रश्नों पर टैप करें:'
                : 'Ask any question or tap one of the common elder safety questions below:'}
            </p>
          </div>

          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            {COMMON_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuickQuestionClick(q)}
                className="text-xs sm:text-sm font-semibold p-2.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 text-left cursor-pointer"
              >
                {q.label[language]}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {chatLog.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'tutor' && (
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-6 h-6" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl max-w-lg text-base sm:text-lg font-medium shadow-sm space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-900 border border-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.sender === 'tutor' && (
                    <div className="flex justify-end pt-1">
                      <SpeakerButton
                        textToSpeak={msg.text}
                        id={`chat-msg-${msg.id}`}
                        size="sm"
                      />
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleVoiceChat}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                isVoiceActive
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title={t.speak[language]}
            >
              {isVoiceActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              placeholder={
                language === 'kn'
                  ? 'ಇಲ್ಲಿ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ...'
                  : language === 'hi'
                  ? 'यहाँ सवाल लिखें या बोलें...'
                  : 'Type your question or tap mic...'
              }
              className="flex-1 p-3.5 text-base sm:text-lg font-bold rounded-2xl border-2 border-slate-300 focus:border-purple-600 bg-slate-50 text-slate-900"
            />

            <button
              type="button"
              onClick={() => handleSendQuery()}
              disabled={!userQuery.trim()}
              className="p-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white disabled:opacity-50 cursor-pointer shadow-md"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
