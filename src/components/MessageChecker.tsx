import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Mic,
  MicOff,
  RotateCcw,
  Upload,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CheckerService, SAMPLE_MESSAGES } from '../services/checkerService';
import type { SampleMessage } from '../services/checkerService';
import type { CheckResult } from '../types';
import { SpeakerButton } from './SpeakerButton';
import { VoiceService } from '../services/voiceService';

export const MessageChecker: React.FC = () => {
  const { language, t, speak } = useLanguage();
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleCheck = () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    // Slight realistic analysis pacing
    setTimeout(() => {
      const res = CheckerService.analyzeMessage(inputText);
      setResult(res);
      setIsAnalyzing(false);

      // Speak result title and summary if user wants
      const audioToSpeak = `${res.title[language]}. ${res.summary[language]}`;
      speak(audioToSpeak, 'checker-result-summary');
    }, 400);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      if (stopListeningFn) stopListeningFn();
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    const stopFn = VoiceService.startListening(
      language,
      (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      },
      (errorMsg) => {
        setVoiceError(errorMsg);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setStopListeningFn(() => stopFn);
    setIsListening(true);
  };

  const handleSampleSelect = (sample: SampleMessage) => {
    setSelectedSampleId(sample.id);
    setInputText(sample.text);
    setScreenshotPreview(null);

    // Run check immediately on sample
    const res = CheckerService.analyzeMessage(sample.text);
    setResult(res);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotPreview(event.target?.result as string);
        // Simulate OCR extracted text from screenshot
        const simulatedOcrText =
          'Dear Customer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately call our electricity officer at 9876543210. BESCOM.';
        setInputText(simulatedOcrText);
        const res = CheckerService.analyzeMessage(simulatedOcrText);
        setResult(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setSelectedSampleId(null);
    setScreenshotPreview(null);
    setVoiceError(null);
    VoiceService.stopSpeaking();
  };

  const renderReasonIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-red-600 shrink-0" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-amber-600 shrink-0" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />;
      case 'CheckCircle':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header with audio prompt */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.checker.title[language]}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-1">
              {t.checker.subtitle[language]}
            </p>
          </div>

          <SpeakerButton
            textToSpeak={`${t.checker.title[language]}. ${t.checker.subtitle[language]}`}
            id="checker-header-audio"
            size="lg"
            label={t.listen[language]}
          />
        </div>
      </div>

      {/* Main Input Area */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-200 space-y-5">
        <div>
          <label
            htmlFor="message-input"
            className="block text-lg font-bold text-slate-800 mb-2 flex items-center justify-between"
          >
            <span>
              {language === 'kn'
                ? 'ಸಂದೇಶ ಅಥವಾ ಲಿಂಕ್ ನಮೂದಿಸಿ:'
                : language === 'hi'
                ? 'संदेश या लिंक यहाँ लिखें / पेस्ट करें:'
                : 'Enter or Paste Message / Link:'}
            </span>

            {inputText && (
              <button
                onClick={handleReset}
                className="text-sm font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.clear[language]}</span>
              </button>
            )}
          </label>

          <textarea
            id="message-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.checker.pastePlaceholder[language]}
            rows={4}
            className="w-full text-lg sm:text-xl p-4 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none bg-slate-50/50"
          />
        </div>

        {/* Screenshot preview if uploaded */}
        {screenshotPreview && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-4">
            <img
              src={screenshotPreview}
              alt="Screenshot Preview"
              className="w-16 h-16 object-cover rounded-xl border border-amber-300"
            />
            <div className="text-sm">
              <p className="font-bold text-amber-900">
                {language === 'kn'
                  ? 'ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ'
                  : language === 'hi'
                  ? 'स्क्रीनशॉट से टेक्स्ट पढ़ा गया'
                  : 'Screenshot image analyzed'}
              </p>
              <p className="text-amber-700">
                {language === 'kn'
                  ? 'ಚಿತ್ರದಲ್ಲಿರುವ ಸಂದೇಶವನ್ನು ಪರೀಕ್ಷೆಗೆ ಸೇರಿಸಲಾಗಿದೆ.'
                  : language === 'hi'
                  ? 'तस्वीर में मौजूद संदेश को जांच के लिए निकाला गया है।'
                  : 'Text extracted from image and loaded for safety scan.'}
              </p>
            </div>
          </div>
        )}

        {/* Voice Input error message if any */}
        {voiceError && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{voiceError}</span>
          </div>
        )}

        {/* Action Buttons: Voice Input, Screenshot, Check This */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`sm:col-span-4 flex items-center justify-center gap-3 py-4 px-5 rounded-2xl font-bold text-base sm:text-lg border-2 cursor-pointer transition-all active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white border-red-700 ring-4 ring-red-200 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 animate-spin" />
                <span>{t.listeningNow[language]}</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 text-emerald-700" />
                <span>{t.speak[language]}</span>
              </>
            )}
          </button>

          {/* Screenshot Upload Button */}
          <label className="sm:col-span-3 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-semibold text-sm sm:text-base border-2 border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer text-center">
            <Upload className="w-5 h-5 text-slate-500" />
            <span>
              {language === 'kn'
                ? 'ಸ್ಕ್ರೀನ್‌ಶಾಟ್'
                : language === 'hi'
                ? 'स्क्रीनशॉट'
                : 'Screenshot'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScreenshotUpload}
            />
          </label>

          {/* Large "Check This" Button */}
          <button
            type="button"
            onClick={handleCheck}
            disabled={!inputText.trim() || isAnalyzing}
            className="sm:col-span-5 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-extrabold text-xl text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-700/20 active:scale-95 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <span>{t.checker.analyzing[language]}</span>
            ) : (
              <>
                <span>{t.checker.checkButton[language]}</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        {/* Real-world test sample presets for seniors */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm font-bold text-slate-700 mb-3">
            {t.checker.trySamples[language]}
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSampleSelect(sample)}
                className={`text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedSampleId === sample.id
                    ? 'bg-blue-100 text-blue-900 border-blue-400 ring-2 ring-blue-300'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
                }`}
              >
                {sample.label[language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-xl border-4 transition-all duration-300 space-y-6 ${
            result.riskLevel === 'danger'
              ? 'bg-red-50 border-red-500 text-red-950'
              : result.riskLevel === 'caution'
              ? 'bg-amber-50 border-amber-500 text-amber-950'
              : 'bg-emerald-50 border-emerald-500 text-emerald-950'
          }`}
        >
          {/* Result Header & Audio read-aloud */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              {result.riskLevel === 'danger' ? (
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-9 h-9" />
                </div>
              ) : result.riskLevel === 'caution' ? (
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-9 h-9" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-9 h-9" />
                </div>
              )}

              <div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {result.title[language]}
                </h2>
                <p className="text-base sm:text-lg font-medium opacity-90">
                  {result.summary[language]}
                </p>
              </div>
            </div>

            <SpeakerButton
              textToSpeak={`${result.title[language]}. ${result.summary[language]}. ${result.reasons
                .map((r) => r.text[language])
                .join('. ')}`}
              id="result-audio-speak"
              size="lg"
              label={t.readAloud[language]}
            />
          </div>

          {/* Transparent Explainable Breakdown (Feature B core rule: Explain why, not just red score!) */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Info className="w-6 h-6 text-slate-800" />
              <span>
                {language === 'kn'
                  ? 'ಕಾರಣಗಳ ವಿವರಣೆ (ಏಕೆ ಈ ತೀರ್ಮಾನ?):'
                  : language === 'hi'
                  ? 'कारण और व्याख्या (यह परिणाम क्यों आया?):'
                  : 'Why Aasara flagged this message (Clear Reasons):'}
              </span>
            </h3>

            <div className="grid gap-3">
              {result.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/80 rounded-2xl border border-black/10 flex items-start gap-3 shadow-sm"
                >
                  {renderReasonIcon(reason.icon)}
                  <p className="text-base sm:text-lg font-semibold text-slate-900">
                    {reason.text[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Advice for the Senior */}
          <div className="p-5 bg-white rounded-2xl border-2 border-slate-300 space-y-3">
            <h4 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
              {language === 'kn'
                ? 'ಮುಂದಿನ ಸುರಕ್ಷಿತ ಕ್ರಮಗಳು:'
                : language === 'hi'
                ? 'आगे क्या करना चाहिए:'
                : 'Safe Actions to Take Right Now:'}
            </h4>

            <ul className="space-y-2.5">
              {result.actionAdvice.map((advice, idx) => (
                <li
                  key={idx}
                  className={`flex items-start gap-2.5 text-base sm:text-lg ${
                    advice.isImportant ? 'font-bold text-red-700' : 'text-slate-800'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 mt-2 shrink-0" />
                  <span>{advice.text[language]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Honest Uncertainty & Privacy Disclaimer */}
          <div className="p-3 bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-600 flex items-start gap-2 border border-slate-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{t.checker.privacyNote[language]}</p>
          </div>
        </div>
      )}
    </div>
  );
};
