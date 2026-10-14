import React, { useState } from 'react';
import {
  User,
  IndianRupee,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Mic,
  MicOff,
  ExternalLink,
  QrCode,
  CheckCircle,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { SpeakerButton } from './SpeakerButton';
import { VoiceService } from '../services/voiceService';

export const UpiPaymentGuide: React.FC = () => {
  const { language, t, speak } = useLanguage();

  // Step 1 to 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [recipient, setRecipient] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  // Trusted quick recipients
  const trustedRecipients = [
    {
      name: { en: 'Daily Milkman', kn: 'ಹಾಲಿನ ವ್ಯಾಪಾರಿ', hi: 'दूधवाला', te: 'పాల వ్యాపారి' },
      upi: 'milkman@upi',
    },
    {
      name: { en: 'Medical Store', kn: 'ಔಷಧಿ ಅಂಗಡಿ', hi: 'दवा दुकान', te: 'మెడికల్ షాప్' },
      upi: 'pharmacy@okaxis',
    },
    {
      name: { en: 'Kirana / Groceries', kn: 'ದಿನಸಿ ಅಂಗಡಿ', hi: 'किराना दुकान', te: 'కిరాణా షాప్' },
      upi: 'groceries@icici',
    },
    {
      name: { en: 'Daughter / Son', kn: 'ಮಗಳು / ಮಗ', hi: 'बेटा / बेटी', te: 'కుమార్తె / కుమారుడు' },
      upi: 'family@okhdfcbank',
    },
  ];

  // Quick amounts
  const quickAmounts = ['50', '100', '200', '500', '1000', '2000'];

  // Quick purposes
  const quickPurposes = [
    { en: 'Groceries & Food', kn: 'ದಿನಸಿ ಮತ್ತು ತರಕಾರಿ', hi: 'किराना और सब्जी', te: 'కిరాణా మరియు కూరగాయలు' },
    { en: 'Doctor & Medicine', kn: 'ಔಷಧಿ ಮತ್ತು ಆಸ್ಪತ್ರೆ', hi: 'दवाई और डॉक्टर', te: 'మందులు మరియు డాక్టర్' },
    { en: 'Rent / Home Bill', kn: 'ಮನೆ ಬಾಡಿಗೆ / ಬಿಲ್', hi: 'किराया और बिजली बिल', te: 'ఇంటి అద్దె / బిల్లు' },
    { en: 'Family / Relatives', kn: 'ಕುಟುಂಬದ ನೆರವು', hi: 'पारिवारिक मदद', te: 'కుటుంబ సహాయం' },
  ];

  // Voice handler for Step 1
  const handleVoiceInputStep1 = () => {
    if (isVoiceActive) {
      VoiceService.stopSpeaking();
      setIsVoiceActive(false);
      return;
    }

    setVoiceError(null);
    VoiceService.startListening(
      language,
      (text) => {
        setRecipient(text);
        setRecipientName(text);
        setIsVoiceActive(false);
      },
      (err) => {
        setVoiceError(err);
        setIsVoiceActive(false);
      },
      () => setIsVoiceActive(false)
    );
    setIsVoiceActive(true);
  };

  // Voice handler for Step 2
  const handleVoiceInputStep2 = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    setVoiceError(null);
    VoiceService.startListening(
      language,
      (text) => {
        // Extract numbers from spoken string
        const numbers = text.replace(/[^0-9]/g, '');
        if (numbers) {
          setAmount(numbers);
        } else {
          setAmount(text);
        }
        setIsVoiceActive(false);
      },
      (err) => {
        setVoiceError(err);
        setIsVoiceActive(false);
      },
      () => setIsVoiceActive(false)
    );
    setIsVoiceActive(true);
  };

  // Construct valid standard UPI intent URI
  const upiIdSanitized = recipient.includes('@')
    ? recipient.trim()
    : `${recipient.trim().replace(/[^0-9]/g, '')}@upi`;

  const payeeNameSanitized = encodeURIComponent(recipientName || recipient || 'Payee');
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiIdSanitized)}&pn=${payeeNameSanitized}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose || 'Payment')}`;

  const handleNext = () => {
    if (currentStep === 1 && !recipient.trim()) return;
    if (currentStep === 2 && (!amount || Number(amount) <= 0)) return;
    if (currentStep === 3 && !purpose.trim()) return;

    const next = currentStep + 1;
    setCurrentStep(next);

    // Audio guidance for next step
    if (next === 2) {
      speak(t.upi.step2Title[language], 'step-2-guide');
    } else if (next === 3) {
      speak(t.upi.step3Title[language], 'step-3-guide');
    } else if (next === 4) {
      speak(
        `${t.upi.reviewTitle[language]}. ${t.upi.pinWarningTitle[language]}: ${t.upi.pinWarningDesc[language]}`,
        'step-4-review'
      );
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResetFlow = () => {
    setCurrentStep(1);
    setRecipient('');
    setRecipientName('');
    setAmount('');
    setPurpose('');
    setShowQrCode(false);
    VoiceService.stopSpeaking();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Feature C — Step-by-Step Payment Safety
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {t.upi.title[language]}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <SpeakerButton
              textToSpeak={
                currentStep === 1
                  ? t.upi.step1Title[language]
                  : currentStep === 2
                  ? t.upi.step2Title[language]
                  : currentStep === 3
                  ? t.upi.step3Title[language]
                  : t.upi.reviewTitle[language]
              }
              id={`step-speaker-${currentStep}`}
              size="lg"
              label={t.listen[language]}
            />

            {currentStep > 1 && (
              <button
                onClick={handleResetFlow}
                className="p-3 text-slate-500 hover:text-red-600 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer"
                title={t.clear[language]}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2.5 rounded-full transition-all ${
                currentStep >= step ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Single Question Card (Rule: One Question Per Screen) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-6">
        {/* STEP 1: Who would you like to pay? */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-600 shrink-0" />
                <span>{t.upi.step1Title[language]}</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-2">
                {t.upi.step1Desc[language]}
              </p>
            </div>

            {/* Input field */}
            <div className="space-y-3">
              <input
                type="text"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  setRecipientName(e.target.value);
                }}
                placeholder={
                  language === 'kn'
                    ? 'ಉದಾ: 9876543210 ಅಥವಾ name@upi'
                    : language === 'hi'
                    ? 'उदा: 9876543210 या name@upi'
                    : 'e.g. 9876543210 or name@upi'
                }
                className="w-full text-xl sm:text-2xl font-bold p-4 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50 text-slate-900"
              />

              {/* Voice input button */}
              <button
                type="button"
                onClick={handleVoiceInputStep1}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-base sm:text-lg border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isVoiceActive
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                {isVoiceActive ? (
                  <>
                    <MicOff className="w-5 h-5 animate-spin" />
                    <span>{t.listeningNow[language]}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-emerald-700" />
                    <span>
                      {language === 'kn'
                        ? 'ಹೆಸರನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಹೇಳಿ'
                        : language === 'hi'
                        ? 'नाम बोलकर बताएं'
                        : 'Speak Recipient Name or Number'}
                    </span>
                  </>
                )}
              </button>

              {voiceError && (
                <p className="text-sm text-red-600 font-semibold">{voiceError}</p>
              )}
            </div>

            {/* Quick Trusted Contacts */}
            <div className="pt-2">
              <p className="text-sm font-bold text-slate-700 mb-2">
                {language === 'kn'
                  ? 'ಅಥವಾ ವಿಶ್ವಾಸಾರ್ಹ ಸಂಪರ್ಕವನ್ನು ಆರಿಸಿ:'
                  : language === 'hi'
                  ? 'या सुरक्षित संपर्क चुनें:'
                  : 'Or choose a trusted contact:'}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {trustedRecipients.map((rec, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setRecipient(rec.upi);
                      setRecipientName(rec.name[language]);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm sm:text-base cursor-pointer transition-all ${
                      recipient === rec.upi
                        ? 'bg-blue-100 text-blue-900 border-blue-500 shadow-sm'
                        : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <p className="line-clamp-1">{rec.name[language]}</p>
                    <p className="text-xs font-normal text-slate-500">{rec.upi}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: How much would you like to pay? */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                <IndianRupee className="w-8 h-8 text-emerald-600 shrink-0" />
                <span>{t.upi.step2Title[language]}</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-2">
                {t.upi.step2Desc[language]}
              </p>
            </div>

            {/* Big Amount Display */}
            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-300 text-center">
              <span className="text-3xl font-black text-slate-500 mr-2">₹</span>
              <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                {amount || '0'}
              </span>
            </div>

            {/* Quick Amounts Chips */}
            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">
                {language === 'kn'
                  ? 'ತ್ವರಿತ ಮೊತ್ತ ಆಯ್ಕೆ:'
                  : language === 'hi'
                  ? 'त्वरित राशि चुनें:'
                  : 'Quick amounts:'}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-3 px-2 rounded-2xl font-black text-base sm:text-lg border-2 cursor-pointer transition-all ${
                      amount === amt
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '00'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'C') {
                      setAmount('');
                    } else {
                      setAmount((prev) => `${prev}${key}`);
                    }
                  }}
                  className="py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-2xl font-black text-slate-800 border border-slate-300 active:scale-95 cursor-pointer shadow-sm"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Voice input for amount */}
            <button
              type="button"
              onClick={handleVoiceInputStep2}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-base sm:text-lg border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isVoiceActive
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>
                {language === 'kn'
                  ? 'ಮೊತ್ತವನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಹೇಳಿ'
                  : language === 'hi'
                  ? 'रुपये बोलकर बताएं'
                  : 'Speak Amount in Rupees'}
              </span>
            </button>
          </div>
        )}

        {/* STEP 3: What is the payment for? */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-amber-600 shrink-0" />
                <span>{t.upi.step3Title[language]}</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-2">
                {t.upi.step3Desc[language]}
              </p>
            </div>

            {/* Purpose category buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickPurposes.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPurpose(p[language])}
                  className={`p-5 rounded-2xl border-2 text-left font-bold text-lg cursor-pointer transition-all ${
                    purpose === p[language]
                      ? 'bg-amber-100 text-amber-950 border-amber-500 shadow-sm'
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {p[language]}
                </button>
              ))}
            </div>

            {/* Custom purpose field */}
            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'kn'
                  ? 'ಅಥವಾ ಬೇರೆ ಕಾರಣ ಬರೆಯಿರಿ:'
                  : language === 'hi'
                  ? 'या कोई अन्य कारण लिखें:'
                  : 'Or type custom purpose:'}
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder={
                  language === 'kn' ? 'ಉದಾ: ಹಣ್ಣುಗಳು' : language === 'hi' ? 'उदा: फल' : 'e.g. Fruits'
                }
                className="w-full text-lg font-bold p-3.5 rounded-2xl border-2 border-slate-300 focus:border-blue-600 bg-slate-50 text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review & Critical Safety Check */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
                <span>{t.upi.reviewTitle[language]}</span>
              </h2>
            </div>

            {/* Summary Box */}
            <div className="bg-blue-50/70 p-5 rounded-3xl border-2 border-blue-200 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                <span className="text-base font-semibold text-slate-600">
                  {language === 'kn'
                    ? 'ಸ್ವೀಕರಿಸುವವರು:'
                    : language === 'hi'
                    ? 'पाने वाले का नाम:'
                    : 'Recipient:'}
                </span>
                <span className="text-xl font-black text-slate-900">
                  {recipientName || recipient}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                <span className="text-base font-semibold text-slate-600">
                  {language === 'kn'
                    ? 'ಪಾವತಿಸುವ ಮೊತ್ತ:'
                    : language === 'hi'
                    ? 'भुगतान राशि:'
                    : 'Amount to Pay:'}
                </span>
                <span className="text-3xl font-black text-emerald-700">₹{amount}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-slate-600">
                  {language === 'kn'
                    ? 'ಪಾವತಿಯ ಉದ್ದೇಶ:'
                    : language === 'hi'
                    ? 'भुगतान का उद्देश्य:'
                    : 'Purpose:'}
                </span>
                <span className="text-lg font-bold text-slate-800">{purpose}</span>
              </div>
            </div>

            {/* MANDATORY SAFETY WARNING: UPI PIN Rule (Feature C core requirement) */}
            <div className="bg-red-50 p-6 rounded-3xl border-3 border-red-500 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-black text-red-900">
                    {t.upi.pinWarningTitle[language]}
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-red-800 mt-1">
                    {t.upi.pinWarningDesc[language]}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/90 rounded-2xl border border-red-200 text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.upi.aasaraPinPromise[language]}</span>
              </div>
            </div>

            {/* Handoff Actions */}
            <div className="space-y-3 pt-2">
              {/* Direct UPI Intent Link Handoff */}
              <a
                href={upiIntentUri}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-extrabold text-xl text-white bg-blue-700 hover:bg-blue-800 shadow-xl shadow-blue-700/25 active:scale-95 transition-all text-center"
              >
                <span>{t.upi.handoffBtn[language]}</span>
                <ExternalLink className="w-6 h-6" />
              </a>

              {/* Show QR fallback for desktop or second device */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="inline-flex items-center gap-2 text-base font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  <QrCode className="w-5 h-5" />
                  <span>
                    {showQrCode
                      ? language === 'kn'
                        ? 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಮರೆಮಾಡಿ'
                        : language === 'hi'
                        ? 'क्यूआर कोड छिपाएं'
                        : 'Hide QR Code'
                      : language === 'kn'
                      ? 'ಮೊಬೈಲ್‌ನಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಕ್ಯೂಆರ್ ಕೋಡ್ ತೋರಿಸಿ'
                      : language === 'hi'
                      ? 'मोबाइल से स्कैन करने हेतु क्यूआर कोड देखें'
                      : 'Show QR Code to scan with Phone'}
                  </span>
                </button>

                {showQrCode && (
                  <div className="mt-4 p-6 bg-white rounded-3xl border-2 border-slate-300 inline-block shadow-md">
                    <QRCodeSVG
                      value={upiIntentUri}
                      size={220}
                      level="H"
                      includeMargin={true}
                    />
                    <p className="text-sm font-bold text-slate-700 mt-3">
                      {language === 'kn'
                        ? 'ಗೂಗಲ್ ಪೇ ಅಥವಾ ಫೋನ್‌ಪೇ ಬಳಸಿ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
                        : language === 'hi'
                        ? 'गूगल पे या फोनपे से स्कैन करें'
                        : 'Scan using GPay, PhonePe or Paytm'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Step Buttons (Next / Back) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t.goBack[language]}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !recipient.trim()) ||
                (currentStep === 2 && (!amount || Number(amount) <= 0)) ||
                (currentStep === 3 && !purpose.trim())
              }
              className="flex items-center gap-2 py-3.5 px-8 rounded-2xl font-black text-xl text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 cursor-pointer"
            >
              <span>{t.nextStep[language]}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetFlow}
              className="flex items-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-base bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
            >
              <span>
                {language === 'kn'
                  ? 'ಹೊಸ ಪಾವತಿ ಪ್ರಾರಂಭಿಸಿ'
                  : language === 'hi'
                  ? 'नया भुगतान शुरू करें'
                  : 'Start New Payment'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
