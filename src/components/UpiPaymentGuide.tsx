import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Camera,
  Upload,
  Lock,
  ShieldAlert,
  X,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import { useLanguage } from '../context/LanguageContext';
import { SpeakerButton } from './SpeakerButton';
import { VoiceService } from '../services/voiceService';
import {
  GhostMerchantShield,
  DEMO_QR_SCENARIOS,
} from '../services/ghostMerchantShield';
import type { VpaDiscrepancyReport, DemoQrScenario } from '../services/ghostMerchantShield';

export const UpiPaymentGuide: React.FC = () => {
  const { language, t, speak } = useLanguage();

  // Active View Tab: 'guided' (the original 3-question payment assistant) vs 'scanner' (The Ghost Merchant Shield QR Engine)
  const [activeTab, setActiveTab] = useState<'guided' | 'scanner'>('guided');

  // Guided Flow Steps: 1 to 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form states
  const [recipient, setRecipient] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  // QR Camera & Scanner states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrStatusMessage, setQrStatusMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Ghost Merchant Shield Discrepancy State
  const [shieldReport, setShieldReport] = useState<VpaDiscrepancyReport | null>(null);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Process raw QR payload string
  const processQrPayload = useCallback((rawPayload: string) => {
    stopCamera();
    setQrStatusMessage(null);

    // Parse UPI intent URI
    const parsed = GhostMerchantShield.parseUpiUri(rawPayload);
    const finalVpa = parsed.pa || rawPayload.trim();
    const finalName = parsed.pn || 'Unknown Merchant';
    const finalAmount = parsed.am || '';
    const finalPurpose = parsed.tn || '';

    // Inspect VPA with Ghost Merchant Shield
    const report = GhostMerchantShield.inspectVpa(
      finalName,
      finalVpa,
      finalAmount,
      finalPurpose
    );

    setShieldReport(report);

    if (report.isMismatch || report.riskLevel === 'danger') {
      // Audio warning
      const warningAudio = `${language === 'kn' ? 'ಎಚ್ಚರಿಕೆ! ಹೆಸರು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.' : language === 'hi' ? 'सावधान! नाम मेल नहीं खा रहा है।' : 'Danger! Name mismatch detected.'} ${report.action[language]}`;
      speak(warningAudio, 'ghost-shield-warning');
      setActiveTab('scanner'); // Bring up the shield warning screen
    } else {
      // Verified genuine merchant
      setRecipient(report.parsedVpa);
      setRecipientName(report.claimedMerchant);
      if (report.parsedAmount) setAmount(report.parsedAmount);
      if (report.parsedPurpose) setPurpose(report.parsedPurpose);

      speak(
        `${language === 'kn' ? 'ವ್ಯಾಪಾರಿಯ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ.' : language === 'hi' ? 'व्यापारी का विवरण सत्यापित हुआ।' : 'Merchant identity verified.'}`,
        'merchant-verified'
      );
    }
  }, [language, speak, stopCamera]);

  // QR video frame scanning loop
  const scanQrFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          processQrPayload(code.data);
          return;
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanQrFrame);
  }, [processQrPayload]);

  // Start live webcam / mobile camera
  const startCamera = async () => {
    setCameraError(null);
    setQrStatusMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        animFrameIdRef.current = requestAnimationFrame(scanQrFrame);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setCameraError(
        language === 'kn'
          ? 'ಕ್ಯಾಮೆರಾ ತೆರೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಸನ್ನಿವೇಶಗಳನ್ನು ಬಳಸಿ.'
          : language === 'hi'
          ? 'कैमरा खोलने में असमर्थ। कृपया अनुमति जांचें या नीचे दिए गए नमूनों का उपयोग करें।'
          : `Camera access failed: ${msg}. You can test using the one-click demo scenarios below or upload a QR image.`
      );
      setIsCameraActive(false);
    }
  };

  // Upload QR image from gallery / desktop
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrStatusMessage(language === 'kn' ? 'ಚಿತ್ರವನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Analyzing QR image...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            processQrPayload(code.data);
          } else {
            setQrStatusMessage(
              language === 'kn'
                ? 'ಚಿತ್ರದಲ್ಲಿ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
                : language === 'hi'
                ? 'फोटो में क्यूआर कोड नहीं मिला। कृपया स्पष्ट फोटो अपलोड करें।'
                : 'No QR code detected in this image. Please upload a clearer photo.'
            );
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Run demo scenario directly
  const handleSelectDemoScenario = (scenario: DemoQrScenario) => {
    processQrPayload(scenario.upiUri);
  };

  // Trusted quick recipients (Old Feature)
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

  // Quick amounts (Old Feature)
  const quickAmounts = ['50', '100', '200', '500', '1000', '2000'];

  // Quick purposes (Old Feature)
  const quickPurposes = [
    { en: 'Groceries & Food', kn: 'ದಿನಸಿ ಮತ್ತು ತರಕಾರಿ', hi: 'किराना और सब्जी', te: 'కిరాణా మరియు కూರగాಯలు' },
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
    stopCamera();
    setCurrentStep(1);
    setRecipient('');
    setRecipientName('');
    setAmount('');
    setPurpose('');
    setShowQrCode(false);
    setShieldReport(null);
    setQrStatusMessage(null);
    VoiceService.stopSpeaking();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hidden canvas for QR decoding */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Header with Feature Navigation Pills */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-stone-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Step-by-Step Payment Safety</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-50 mt-2">
              {t.upi.title[language]}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <SpeakerButton
              textToSpeak={
                activeTab === 'guided'
                  ? currentStep === 1
                    ? t.upi.step1Title[language]
                    : currentStep === 2
                    ? t.upi.step2Title[language]
                    : currentStep === 3
                    ? t.upi.step3Title[language]
                    : t.upi.reviewTitle[language]
                  : 'Scan UPI QR code or test Ghost Merchant Shield for name mismatch'
              }
              id={`upi-main-speaker-${activeTab}-${currentStep}`}
              size="lg"
              label={t.listen[language]}
            />

            {(currentStep > 1 || shieldReport || recipient) && (
              <button
                onClick={handleResetFlow}
                className="p-3 text-slate-500 hover:text-red-600 rounded-xl bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 cursor-pointer transition-colors"
                title={t.clear[language]}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Feature Tabs: Old Guided Payment + New Ghost Merchant Shield QR Scanner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('guided');
              stopCamera();
            }}
            className={`py-3.5 px-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all ${
              activeTab === 'guided'
                ? 'bg-blue-600 dark:bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-stone-700 border border-slate-200 dark:border-stone-700'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span>
              {language === 'kn'
                ? '📱 ಹಂತ-ಹಂತದ ಪಾವತಿ ಮಾರ್ಗದರ್ಶಿ'
                : language === 'hi'
                ? '📱 चरण-दर-चरण भुगतान सहायक'
                : '📱 Guided Payment Flow'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`py-3.5 px-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer transition-all ${
              activeTab === 'scanner'
                ? 'bg-blue-600 dark:bg-amber-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:bg-slate-200 dark:hover:bg-stone-700 border border-slate-200 dark:border-stone-700'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>
              {language === 'kn'
                ? '📷 ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ & ಘೋಸ್ಟ್ ಶೀಲ್ಡ್'
                : language === 'hi'
                ? '📷 क्यूआर स्कैन & घोस्ट शील्ड'
                : '📷 QR Scanner & Ghost Shield'}
            </span>
          </button>
        </div>

        {/* Step indicator pills (Shown during guided payment flow) */}
        {activeTab === 'guided' && (
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2.5 rounded-full transition-all ${
                  currentStep >= step ? 'bg-blue-600 dark:bg-amber-500' : 'bg-slate-200 dark:bg-stone-800'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          FEATURE 1 (NEW): THE GHOST MERCHANT SHIELD & QR CODE SCANNER TAB
          ========================================================================= */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          {/* GHOST MERCHANT SHIELD ALERT CARD (When mismatch or scam is detected) */}
          {shieldReport && shieldReport.isMismatch && (
            <div className="bg-red-50 dark:bg-red-950/70 border-4 border-red-600 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
              {/* Header with Lock Icon */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-red-600 text-white rounded-2xl shrink-0 shadow-lg shadow-red-600/30">
                    <Lock className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-widest uppercase bg-red-600 text-white px-3 py-1 rounded-full shadow-sm">
                      Ghost Merchant Shield
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-red-700 dark:text-red-400 mt-1.5 tracking-tight">
                      ⚠️ DANGER: NAME MISMATCH
                    </h2>
                  </div>
                </div>

                <SpeakerButton
                  textToSpeak={`Danger: Name Mismatch! You are trying to pay ${shieldReport.claimedMerchant}. But the bank account receiving money belongs to ${shieldReport.registeredAccount}. ${shieldReport.action[language]}`}
                  id="ghost-shield-audio-scanner"
                  size="lg"
                  label={t.listen[language]}
                />
              </div>

              {/* Exact Discrepancy Breakdown Requested by User */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border-2 border-red-300 dark:border-red-900 space-y-5 shadow-sm">
                {/* 1. Claimed Merchant */}
                <div>
                  <p className="text-sm font-extrabold text-slate-500 dark:text-stone-400 uppercase tracking-wider">
                    {language === 'kn'
                      ? 'ನೀವು ಪಾವತಿಸಲು ಹೊರಟಿರುವ ಸಂಸ್ಥೆ:'
                      : language === 'hi'
                      ? 'आप जिस नाम को भुगतान करने की कोशिश कर रहे हैं:'
                      : 'You are trying to pay:'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {shieldReport.claimedMerchant}
                  </p>
                </div>

                {/* 2. Registered Account (The Real Mule Behind) */}
                <div className="pt-4 border-t-2 border-red-200 dark:border-red-900/60">
                  <p className="text-sm font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    {language === 'kn'
                      ? 'ಹಣ ಪಡೆಯುತ್ತಿರುವ ನೈಜ ಬ್ಯಾಂಕ್ ಖಾತೆದಾರ:'
                      : language === 'hi'
                      ? 'पैसे प्राप्त करने वाला असली बैंक खाता:'
                      : 'The bank account receiving the money belongs to:'}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-red-700 dark:text-red-400 mt-1">
                    {shieldReport.registeredAccount}
                  </p>
                  <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-lg bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                    {shieldReport.accountType}
                  </span>
                </div>

                {/* 3. Action Block */}
                <div className="pt-4 border-t-2 border-red-200 dark:border-red-900/60 bg-red-100/80 dark:bg-red-900/40 p-4 rounded-xl border border-red-300 dark:border-red-700">
                  <p className="text-lg sm:text-xl font-black text-red-950 dark:text-red-100">
                    Action: {shieldReport.action[language]}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-red-900 dark:text-red-200 mt-1">
                    {shieldReport.reason[language]}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="tel:1930"
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg text-center shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldAlert className="w-6 h-6" />
                  <span>
                    {language === 'kn'
                      ? 'ಸೈಬರ್ ಹೆಲ್ಪ್‌ಲೈನ್ 1930 ಗೆ ಕರೆ ಮಾಡಿ'
                      : language === 'hi'
                      ? 'साइबर हेल्पलाइन 1930 पर कॉल करें'
                      : 'Report Fraud: Call 1930'}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setShieldReport(null);
                    setQrStatusMessage(null);
                  }}
                  className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-200 dark:bg-stone-800 hover:bg-slate-300 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-200 font-bold text-lg cursor-pointer transition-colors"
                >
                  {language === 'kn'
                    ? 'ಬೇರೆ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
                    : language === 'hi'
                    ? 'दूसरा कोड स्कैन करें'
                    : 'Scan Another QR'}
                </button>
              </div>
            </div>
          )}

          {/* Genuine Verified Notice */}
          {shieldReport && !shieldReport.isMismatch && shieldReport.riskLevel === 'verified' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/70 border-3 border-emerald-500 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-3 py-1 rounded-full">
                    Verified Merchant
                  </span>
                  <h3 className="text-2xl font-black text-emerald-950 dark:text-emerald-50 mt-1">
                    {recipientName || recipient}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
                    {shieldReport.registeredAccount}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('guided');
                    setCurrentStep(2); // Proceed directly to amount step with prefilled data!
                  }}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {language === 'kn'
                      ? 'ಹಂತ-ಹಂತದ ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ'
                      : language === 'hi'
                      ? 'भुगतान जारी रखें'
                      : 'Proceed with Guided Payment'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setShieldReport(null)}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-200 dark:bg-stone-800 text-slate-700 dark:text-stone-300 font-bold"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* QR Camera & Upload Card */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 dark:border-stone-800 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-50 flex items-center gap-3">
                <QrCode className="w-8 h-8 text-blue-600 dark:text-amber-500 shrink-0" />
                <span>
                  {language === 'kn'
                    ? 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
                    : language === 'hi'
                    ? 'क्यूआर कोड स्कैन करें'
                    : 'Scan Any UPI QR Code'}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-stone-300 mt-1">
                {language === 'kn'
                  ? 'ನಕಲಿ ಬಿಲ್ ಮತ್ತು ವಂಚಕರ ಖಾತೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಘೋಸ್ಟ್ ಮರ್ಚೆಂಟ್ ಶೀಲ್ಡ್ ತಕ್ಷಣವೇ ಪರಿಶೀಲಿಸುತ್ತದೆ.'
                  : language === 'hi'
                  ? 'नकली बिल और ठगों के खातों की पहचान के लिए घोस्ट मर्चेंट शील्ड तुरंत जांच करेगी।'
                  : 'The Ghost Merchant Shield intercepts the underlying VPA to check if the money is diverted to a mule.'}
              </p>
            </div>

            {/* Camera View or Buttons */}
            {isCameraActive ? (
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video flex items-center justify-center border-4 border-blue-500 shadow-xl">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-white/40 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-4 border-dashed border-amber-400 rounded-2xl animate-pulse" />
                </div>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="absolute top-4 right-4 p-2 bg-black/70 text-white rounded-full hover:bg-black cursor-pointer"
                  title="Close camera"
                >
                  <X className="w-6 h-6" />
                </button>
                <span className="absolute bottom-4 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Point camera at any UPI QR Code
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-6 rounded-2xl bg-blue-50 dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-stone-700 border-2 border-blue-300 dark:border-stone-700 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
                >
                  <div className="p-4 bg-blue-600 dark:bg-amber-600 text-white rounded-2xl group-hover:scale-105 transition-transform">
                    <Camera className="w-9 h-9" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-xl text-slate-900 dark:text-amber-50">
                      {language === 'kn'
                        ? 'ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ'
                        : language === 'hi'
                        ? 'कैमरा शुरू करें'
                        : 'Open Camera Scanner'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">
                      {language === 'kn'
                        ? 'ಅಂಗಡಿ ಅಥವಾ ಬಿಲ್‌ನಲ್ಲಿರುವ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
                        : language === 'hi'
                        ? 'दुकान या बिल पर लगे कोड को स्कैन करें'
                        : 'Scan QR at shop, auto or bill'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 border-2 border-amber-300 dark:border-stone-700 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
                >
                  <div className="p-4 bg-amber-600 dark:bg-amber-500 text-white rounded-2xl group-hover:scale-105 transition-transform">
                    <Upload className="w-9 h-9" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-xl text-slate-900 dark:text-amber-50">
                      {language === 'kn'
                        ? 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ'
                        : language === 'hi'
                        ? 'फोटो अपलोड करें'
                        : 'Upload QR Photo'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">
                      {language === 'kn'
                        ? 'ವಾಟ್ಸಾಪ್ ಬಿಲ್ ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ'
                        : language === 'hi'
                        ? 'व्हाट्सएप बिल या गैलरी से फोटो चुनें'
                        : 'Select QR screenshot or image from phone'}
                    </p>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}

            {cameraError && (
              <p className="p-3.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-sm font-semibold border border-red-300 dark:border-red-800">
                {cameraError}
              </p>
            )}

            {qrStatusMessage && (
              <p className="p-3.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 text-sm font-bold border border-blue-300 dark:border-blue-800">
                {qrStatusMessage}
              </p>
            )}

            {/* ONE-TAP TEST SCENARIOS */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <p className="text-sm font-black text-slate-800 dark:text-stone-200 uppercase tracking-wide">
                  {language === 'kn'
                    ? 'ಪರೀಕ್ಷಿಸಲು ನೈಜ ಸನ್ನಿವೇಶಗಳನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ:'
                    : language === 'hi'
                    ? 'परीक्षण हेतु वास्तविक नमूने चुनें:'
                    : 'Or test realistic scenarios with 1-tap:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_QR_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleSelectDemoScenario(scenario)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      scenario.isScam
                        ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 hover:bg-red-100'
                        : 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-base text-slate-900 dark:text-stone-100">
                        {scenario.title[language]}
                      </span>
                      <span
                        className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md ${
                          scenario.isScam ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {scenario.isScam ? 'Scam Demo' : 'Genuine'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-stone-400 mt-1 line-clamp-2">
                      {scenario.description[language]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FEATURE 2 (OLD): GUIDED 3-QUESTION PAYMENT ASSISTANT
          ========================================================================= */}
      {activeTab === 'guided' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 dark:border-stone-800 space-y-6 transition-colors">
          {/* STEP 1: Who would you like to pay? */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-50 flex items-center gap-3">
                  <User className="w-8 h-8 text-blue-600 dark:text-amber-500 shrink-0" />
                  <span>{t.upi.step1Title[language]}</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-stone-300 mt-2">
                  {t.upi.step1Desc[language]}
                </p>
              </div>

              {/* Verified Merchant Badge if populated */}
              {recipientName && recipient && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border-2 border-emerald-400 dark:border-emerald-700 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-lg font-black text-emerald-950 dark:text-emerald-100">
                        {recipientName}
                      </p>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        {recipient}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipient('');
                      setRecipientName('');
                    }}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}

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
                  className="w-full text-xl sm:text-2xl font-bold p-4 rounded-2xl border-2 border-slate-300 dark:border-stone-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-slate-50 dark:bg-stone-800 text-slate-900 dark:text-white"
                />

                {/* Action Buttons: Voice Input & Switch to QR Scanner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleVoiceInputStep1}
                    className={`py-3.5 px-4 rounded-2xl font-bold text-base sm:text-lg border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isVoiceActive
                        ? 'bg-red-600 text-white border-red-700 animate-pulse'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {isVoiceActive ? (
                      <>
                        <MicOff className="w-5 h-5 animate-spin" />
                        <span>{t.listeningNow[language]}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        <span>
                          {language === 'kn'
                            ? 'ಹೆಸರನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಹೇಳಿ'
                            : language === 'hi'
                            ? 'नाम बोलकर बताएं'
                            : 'Speak Recipient'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('scanner')}
                    className="py-3.5 px-4 rounded-2xl font-bold text-base sm:text-lg border-2 border-blue-300 dark:border-stone-700 bg-blue-50 dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-stone-700 text-blue-900 dark:text-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>
                      {language === 'kn'
                        ? 'ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ'
                        : language === 'hi'
                        ? 'क्यूआर कोड स्कैन करें'
                        : 'Or Scan QR Code'}
                    </span>
                  </button>
                </div>

                {voiceError && (
                  <p className="text-sm text-red-600 font-semibold">{voiceError}</p>
                )}
              </div>

              {/* Quick Trusted Contacts (Preserved Original Feature) */}
              <div className="pt-2">
                <p className="text-sm font-bold text-slate-700 dark:text-stone-300 mb-2">
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
                      type="button"
                      onClick={() => {
                        setRecipient(rec.upi);
                        setRecipientName(rec.name[language]);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm sm:text-base cursor-pointer transition-all ${
                        recipient === rec.upi
                          ? 'bg-blue-100 dark:bg-stone-700 text-blue-900 dark:text-amber-300 border-blue-500'
                          : 'bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-stone-200 border-slate-200 dark:border-stone-700 hover:bg-slate-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      <p className="line-clamp-1">{rec.name[language]}</p>
                      <p className="text-xs font-normal text-slate-500 dark:text-stone-400">{rec.upi}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: How much would you like to pay? (Preserved Keypad & Quick Amounts) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-50 flex items-center gap-3">
                  <IndianRupee className="w-8 h-8 text-emerald-600 shrink-0" />
                  <span>{t.upi.step2Title[language]}</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-stone-300 mt-2">
                  {t.upi.step2Desc[language]}
                </p>
              </div>

              {/* Big Amount Display */}
              <div className="bg-slate-50 dark:bg-stone-800 p-6 rounded-3xl border-2 border-slate-300 dark:border-stone-700 text-center">
                <span className="text-3xl font-black text-slate-500 dark:text-stone-400 mr-2">₹</span>
                <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-amber-50 tracking-tight">
                  {amount || '0'}
                </span>
              </div>

              {/* Quick Amounts Chips */}
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-stone-300 mb-2">
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
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-3 px-2 rounded-2xl font-black text-base sm:text-lg border-2 cursor-pointer transition-all ${
                        amount === amt
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-stone-200 border-slate-200 dark:border-stone-700 hover:bg-slate-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tactile Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '00'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'C') {
                        setAmount('');
                      } else {
                        setAmount((prev) => `${prev}${key}`);
                      }
                    }}
                    className="py-4 rounded-2xl bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 text-2xl font-black text-slate-800 dark:text-stone-100 border border-slate-300 dark:border-stone-700 active:scale-95 cursor-pointer shadow-sm"
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
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
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

          {/* STEP 3: What is the payment for? (Preserved Categories) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-50 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-amber-600 shrink-0" />
                  <span>{t.upi.step3Title[language]}</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-600 dark:text-stone-300 mt-2">
                  {t.upi.step3Desc[language]}
                </p>
              </div>

              {/* Purpose category buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPurposes.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPurpose(p[language])}
                    className={`p-5 rounded-2xl border-2 text-left font-bold text-lg cursor-pointer transition-all ${
                      purpose === p[language]
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-stone-800 text-slate-800 dark:text-stone-200 border-slate-200 dark:border-stone-700 hover:bg-slate-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {p[language]}
                  </button>
                ))}
              </div>

              {/* Custom purpose field */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-stone-300 mb-1">
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
                  className="w-full text-lg font-bold p-3.5 rounded-2xl border-2 border-slate-300 dark:border-stone-700 focus:border-blue-600 bg-slate-50 dark:bg-stone-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review & Critical Safety Check (Preserved Review & UPI PIN Rule) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-50 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-amber-500 shrink-0" />
                  <span>{t.upi.reviewTitle[language]}</span>
                </h2>
              </div>

              {/* Summary Box */}
              <div className="bg-blue-50/70 dark:bg-stone-800 p-5 rounded-3xl border-2 border-blue-200 dark:border-stone-700 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-stone-700">
                  <span className="text-base font-semibold text-slate-600 dark:text-stone-300">
                    {language === 'kn'
                      ? 'ಸ್ವೀಕರಿಸುವವರು:'
                      : language === 'hi'
                      ? 'पाने वाले का नाम:'
                      : 'Recipient:'}
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-amber-50">
                    {recipientName || recipient}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-stone-700">
                  <span className="text-base font-semibold text-slate-600 dark:text-stone-300">
                    {language === 'kn'
                      ? 'ಪಾವತಿಸುವ ಮೊತ್ತ:'
                      : language === 'hi'
                      ? 'भुगतान राशि:'
                      : 'Amount to Pay:'}
                  </span>
                  <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">₹{amount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-slate-600 dark:text-stone-300">
                    {language === 'kn'
                      ? 'ಪಾವತಿಯ ಉದ್ದೇಶ:'
                      : language === 'hi'
                      ? 'भुगतान का उद्देश्य:'
                      : 'Purpose:'}
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-stone-200">{purpose}</span>
                </div>
              </div>

              {/* MANDATORY SAFETY WARNING: UPI PIN Rule */}
              <div className="bg-red-50 dark:bg-red-950/60 p-6 rounded-3xl border-3 border-red-500 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-black text-red-900 dark:text-red-200">
                      {t.upi.pinWarningTitle[language]}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-red-800 dark:text-red-300 mt-1">
                      {t.upi.pinWarningDesc[language]}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/90 dark:bg-stone-900 rounded-2xl border border-red-200 dark:border-red-900 text-sm font-semibold text-slate-800 dark:text-stone-200 flex items-center gap-2">
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
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-extrabold text-xl text-white bg-blue-700 hover:bg-blue-800 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-xl shadow-blue-700/25 active:scale-95 transition-all text-center"
                >
                  <span>{t.upi.handoffBtn[language]}</span>
                  <ExternalLink className="w-6 h-6" />
                </a>

                {/* Show QR fallback for desktop or second device */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    className="inline-flex items-center gap-2 text-base font-bold text-blue-700 dark:text-amber-400 hover:underline cursor-pointer"
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
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-stone-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-lg bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-800 dark:text-stone-200 border border-slate-300 dark:border-stone-700 active:scale-95 cursor-pointer transition-colors"
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
                className="flex items-center gap-2 py-3.5 px-8 rounded-2xl font-black text-xl text-white bg-blue-700 hover:bg-blue-800 dark:bg-amber-600 dark:hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 cursor-pointer transition-colors"
              >
                <span>{t.nextStep[language]}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetFlow}
                className="flex items-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-base bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 border border-slate-300 dark:border-stone-700 cursor-pointer transition-colors"
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
      )}
    </div>
  );
};
