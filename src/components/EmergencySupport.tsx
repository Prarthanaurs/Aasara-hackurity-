import React, { useState } from 'react';
import {
  PhoneCall,
  ExternalLink,
  Clock,
  CheckSquare,
  Square,
  FileText,
  Copy,
  ShieldAlert,
  Building2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SpeakerButton } from './SpeakerButton';

export const EmergencySupport: React.FC = () => {
  const { language, t } = useLanguage();

  // Checklist state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Incident form state
  const [incidentTime, setIncidentTime] = useState<string>('today-morning');
  const [incidentAmount, setIncidentAmount] = useState<string>('');
  const [scamType, setScamType] = useState<string>('electricity-bill');
  const [scammerContact, setScammerContact] = useState<string>('');
  const [myBank, setMyBank] = useState<string>('SBI');
  const [copied, setCopied] = useState<boolean>(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    {
      id: 'utr',
      title: {
        en: 'Transaction ID / UTR Number',
        kn: 'ವಹಿವಾಟಿನ ಯುಟಿಆರ್ (UTR) ಅಥವಾ ರೆಫರೆನ್ಸ್ ಸಂಖ್ಯೆ',
        hi: 'लेनदेन का यूटीआर (UTR) या रेफरेंस नंबर',
        te: 'లావాదేవీ యుటిఆర్ (UTR) లేదా రిఫరెన్స్ నంబర్',
      },
      desc: {
        en: 'Look at the bank debit SMS you received. It will contain a 12-digit UTR number.',
        kn: 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಬಂದ ಹಣ ಕಡಿತವಾದ ಬ್ಯಾಂಕ್ ಎಸ್‌ಎಂಎಸ್‌ನಲ್ಲಿ 12 ಅಂಕಿಯ ಯುಟಿಆರ್ ಸಂಖ್ಯೆ ಇರುತ್ತದೆ.',
        hi: 'बैंक से आए पैसे कटने वाले मैसेज में 12 अंकों का यूटीआर नंबर होता है।',
        te: 'డబ్బులు కట్ అయిన బ్యాంక్ ఎస్ఎంఎస్ లో 12 అంకెల యుటిఆర్ నంబర్ ఉంటుంది.',
      },
    },
    {
      id: 'account',
      title: {
        en: 'Your Bank Account Number',
        kn: 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆ',
        hi: 'आपका बैंक खाता नंबर',
        te: 'మీ బ్యాంక్ ఖాతా సంఖ్య',
      },
      desc: {
        en: 'The account or debit card from which money was deducted.',
        kn: 'ಯಾವ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತಗೊಂಡಿದೆಯೋ ಆ ಖಾತೆ ಸಂಖ್ಯೆ ಅಥವಾ ಪಾಸ್‌ಬುಕ್.',
        hi: 'जिस खाते या एटीएम कार्ड से पैसे कटे हैं, उसका नंबर।',
        te: 'డబ్బులు కట్ అయిన మీ బ్యాంక్ ఖాతా లేదా ఏటీఎం కార్డు నంబర్.',
      },
    },
    {
      id: 'scammer',
      title: {
        en: 'Scammer Contact / UPI ID / Link',
        kn: 'ವಂಚಕನ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ಯುಪಿಐ ಐಡಿ ಅಥವಾ ಲಿಂಕ್',
        hi: 'ठग का मोबाइल नंबर, यूपीआई आईडी या लिंक',
        te: 'మోసగాడి మొబైల్ నంబర్ లేదా యూపీఐ ఐడీ',
      },
      desc: {
        en: 'The phone number that called you or the link you received.',
        kn: 'ನಿಮಗೆ ಕರೆ ಮಾಡಿದ ನಂಬರ್ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ.',
        hi: 'जिस नंबर से कॉल आया था या व्हाट्सएप पर मैसेज भेजा गया था।',
        te: 'మీకు కాల్ చేసిన నంబర్ లేదా వచ్చిన లింక్.',
      },
    },
    {
      id: 'datetime',
      title: {
        en: 'Exact Date & Time',
        kn: 'ನಿಖರವಾದ ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
        hi: 'सटीक तारीख और समय',
        te: 'ఖచ్చితమైన తేదీ మరియు సమయం',
      },
      desc: {
        en: 'Note down the exact time shown on your debit alert.',
        kn: 'ಹಣ ಕಡಿತಗೊಂಡ ನಿಖರವಾದ ಸಮಯವನ್ನು ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ.',
        hi: 'पैसे कटने के एसएमएस पर दिया गया सही समय नोट करें।',
        te: 'డబ్బు కట్ అయిన సమయాన్ని నోట్ చేసుకోండి.',
      },
    },
  ];

  const bankHelplines = [
    { name: 'State Bank of India (SBI)', phone: '18001234', desc: 'Toll-free 24x7' },
    { name: 'HDFC Bank', phone: '18001600', desc: 'Emergency fraud reporting' },
    { name: 'ICICI Bank', phone: '18001080', desc: 'Customer support' },
    { name: 'Canara Bank', phone: '18004250018', desc: 'Toll-free' },
    { name: 'Punjab National Bank', phone: '18001802222', desc: 'Toll-free 24x7' },
    { name: 'Bank of Baroda', phone: '18005700', desc: 'Toll-free' },
  ];

  // Generated Summary Text
  const generatedIncidentSummary =
    language === 'kn'
      ? `ಸೈಬರ್ ಅಪರಾಧ ವರದಿ ವಿವರ (1930 ಕರೆಗೆ ಸಿದ್ಧಪಡಿಸಿದ ಮಾಹಿತಿ):
• ದಿನಾಂಕ/ಸಮಯ: ${incidentTime === 'just-now' ? 'ಈಗಷ್ಟೇ (ಕಳೆದ 1 ಗಂಟೆಯಲ್ಲಿ)' : 'ಇಂದು ಬೆಳಿಗ್ಗೆ'}
• ಕಡಿತಗೊಂಡ ಅಂದಾಜು ಮೊತ್ತ: ₹${incidentAmount || 'ತಿಳಿದಿಲ್ಲ'}
• ವಂಚನೆಯ ವಿಧಾನ: ${scamType}
• ನನ್ನ ಬ್ಯಾಂಕ್: ${myBank}
• ವಂಚಕನ ಸಂಖ್ಯೆ/ವಿವರ: ${scammerContact || 'ಲಭ್ಯವಿಲ್ಲ'}

ಗಮನಿಸಿ: ಈ ವಿವರವನ್ನು 1930 ಸಹಾಯವಾಣಿ ಅಧಿಕಾರಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ತಕ್ಷಣ ರಕ್ಷಿಸಿಕೊಳ್ಳಿ.`
      : language === 'hi'
      ? `साइबर अपराध घटना विवरण (1930 कॉल के लिए तैयार विवरण):
• तारीख / समय: ${incidentTime === 'just-now' ? 'अभी हाल ही में (1 घंटे के भीतर)' : 'आज सुबह'}
• कटे गए रुपये: ₹${incidentAmount || 'ज्ञात नहीं'}
• धोखाधड़ी का प्रकार: ${scamType}
• मेरा बैंक: ${myBank}
• ठग का नंबर / विवरण: ${scammerContact || 'उपलब्ध नहीं'}

नोट: यह विवरण 1930 पर पुलिस अधिकारी को स्पष्ट रूप से बताएं और बैंक खाता तुरंत फ्रीज करवाएं।`
      : `CYBERCRIME INCIDENT SUMMARY (Prepared for 1930 Helpline):
• Date & Time: ${incidentTime === 'just-now' ? 'Just now (within last hour)' : 'Earlier today'}
• Amount Debited: ₹${incidentAmount || 'Not specified'}
• Fraud Type: ${scamType}
• Victim Bank: ${myBank}
• Scammer Phone / Link: ${scammerContact || 'Not recorded'}

Note: Read these exact details to the 1930 officer to help trace and freeze the recipient account quickly.`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generatedIncidentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-800/80 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border border-red-500 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>{t.emergency.title[language]}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              {t.emergency.call1930[language]}
            </h1>
            <p className="text-red-100 text-base sm:text-lg mt-2">
              {t.emergency.goldenHourDesc[language]}
            </p>
          </div>

          <SpeakerButton
            textToSpeak={`${t.emergency.call1930[language]}. ${t.emergency.goldenHourDesc[language]}`}
            id="emergency-header-audio"
            size="lg"
            className="bg-white text-red-800 hover:bg-red-50 border-white shrink-0"
            label={t.listen[language]}
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <a
            href="tel:1930"
            className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xl shadow-lg active:scale-95 transition-all text-center"
          >
            <PhoneCall className="w-7 h-7 text-red-700 animate-bounce" />
            <span>{t.emergency.call1930[language]}</span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-red-900/80 hover:bg-red-900 text-white font-bold text-lg border-2 border-red-400 active:scale-95 transition-all text-center"
          >
            <span>{t.emergency.officialPortal[language]}</span>
            <ExternalLink className="w-5 h-5 text-amber-300" />
          </a>
        </div>
      </div>

      {/* The Golden 2 Hours Card */}
      <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex items-start gap-4">
        <Clock className="w-9 h-9 text-amber-700 shrink-0 mt-1" />
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-amber-950">
            {t.emergency.goldenHourTitle[language]}
          </h2>
          <p className="text-base sm:text-lg text-amber-900 font-medium">
            {language === 'kn'
              ? 'ಹಣ ಕಡಿತಗೊಂಡ ಮೊದಲ 2 ಗಂಟೆಗಳಲ್ಲಿ 1930 ಸಹಾಯವಾಣಿಗೆ ಮಾಹಿತಿ ನೀಡಿದರೆ, ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಂ ಪೋರ್ಟಲ್ ವಂಚಕರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ತುರ್ತು ನೋಟಿಸ್ ಕಳುಹಿಸಿ ಹಣ ಡ್ರಾ ಆಗದಂತೆ ಫ್ರೀಜ್ ಮಾಡಬಹುದು.'
              : language === 'hi'
              ? 'धोखे से पैसे कटने के पहले 2 घंटे के भीतर 1930 पर कॉल करने से सरकार ठग के खाते को तुरंत होल्ड पर रखवा सकती है, जिससे आपका पैसा बचने की संभावना सबसे अधिक होती है।'
              : 'Reporting to 1930 within the first 2 hours allows cyber police to alert beneficiary banks and freeze the fraudulent transaction before criminals can withdraw the cash from ATMs.'}
          </p>
        </div>
      </div>

      {/* Interactive Preparation Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">
            {t.emergency.checklistTitle[language]}
          </h2>
          <SpeakerButton
            textToSpeak={`${t.emergency.checklistTitle[language]}. ${checklist
              .map((c) => `${c.title[language]}: ${c.desc[language]}`)
              .join('. ')}`}
            id="checklist-audio"
            size="md"
          />
        </div>

        <p className="text-base text-slate-600">
          {language === 'kn'
            ? '1930 ಗೆ ಕರೆ ಮಾಡುವಾಗ ಅಥವಾ ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಹೋಗುವಾಗ ಈ ವಿವರಗಳನ್ನು ಕೈಯಲ್ಲಿಟ್ಟುಕೊಳ್ಳಿ:'
            : language === 'hi'
            ? '1930 पर फोन करते समय या बैंक जाते समय यह जानकारी तैयार रखें:'
            : 'Keep these items ready before calling 1930 so the police officer can log your complaint fast:'}
        </p>

        <div className="grid gap-3">
          {checklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-400'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      isChecked ? 'text-emerald-950' : 'text-slate-900'
                    }`}
                  >
                    {item.title[language]}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-0.5">
                    {item.desc[language]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Summary Form Builder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            <span>{t.emergency.generateReport[language]}</span>
          </h2>
          <p className="text-base text-slate-600 mt-1">
            {language === 'kn'
              ? 'ಸರಳ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ಇದು 1930 ಅಧಿಕಾರಿ ಅಥವಾ ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್‌ಗೆ ಓದಿ ಹೇಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.'
              : language === 'hi'
              ? 'आसान विवरण भरें। यह पर्ची 1930 पर बोलते समय या बैंक में दिखाने में मददगार होगी।'
              : 'Fill simple details to generate an organized slip you can read directly to 1930 or show your branch manager.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {language === 'kn'
                ? 'ಯಾವಾಗ ನಡೆಯಿತು?'
                : language === 'hi'
                ? 'घटना कब हुई?'
                : 'When did it happen?'}
            </label>
            <select
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              className="w-full text-base font-bold p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-900"
            >
              <option value="just-now">
                {language === 'kn'
                  ? 'ಈಗಷ್ಟೇ (ಕಳೆದ 1 ಗಂಟೆಯಲ್ಲಿ)'
                  : language === 'hi'
                  ? 'अभी-अभी (पिछले 1 घंटे में)'
                  : 'Just now (< 1 hour ago)'}
              </option>
              <option value="today-morning">
                {language === 'kn' ? 'ಇಂದು ಬೆಳಿಗ್ಗೆ' : language === 'hi' ? 'आज सुबह' : 'Earlier today'}
              </option>
              <option value="yesterday">
                {language === 'kn' ? 'ನಿನ್ನೆ' : language === 'hi' ? 'कल' : 'Yesterday'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {language === 'kn'
                ? 'ಕಡಿತಗೊಂಡ ಮೊತ್ತ (ರೂಪಾಯಿಗಳಲ್ಲಿ):'
                : language === 'hi'
                ? 'कटी हुई राशि (रुपये):'
                : 'Amount debited (₹):'}
            </label>
            <input
              type="number"
              value={incidentAmount}
              onChange={(e) => setIncidentAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full text-base font-bold p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {language === 'kn'
                ? 'ವಂಚನೆಯ ಬಗೆ:'
                : language === 'hi'
                ? 'धोखाधड़ी का तरीका:'
                : 'Scam Type:'}
            </label>
            <select
              value={scamType}
              onChange={(e) => setScamType(e.target.value)}
              className="w-full text-base font-bold p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-900"
            >
              <option value="Electricity Bill Cutoff Call">
                {language === 'kn'
                  ? 'ಕರೆಂಟ್ ಬಿಲ್ ಕಡಿತ ಬೆದರಿಕೆ'
                  : language === 'hi'
                  ? 'बिजली बिल कटने की धमकी'
                  : 'Electricity Bill Cutoff'}
              </option>
              <option value="Bank KYC Blocked Link">
                {language === 'kn'
                  ? 'ಬ್ಯಾಂಕ್ ಕೆವೈಸಿ ಬ್ಲಾಕ್ ಲಿಂಕ್'
                  : language === 'hi'
                  ? 'बैंक केवाईसी ब्लॉक लिंक'
                  : 'Bank KYC Blocked Link'}
              </option>
              <option value="Scan QR to Receive Money Trick">
                {language === 'kn'
                  ? 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಟ್ರಿಕ್'
                  : language === 'hi'
                  ? 'क्यूआर कोड स्कैन धोखा'
                  : 'QR Code Refund Trap'}
              </option>
              <option value="Lottery or Prize Scam">
                {language === 'kn'
                  ? 'ಲಾಟರಿ ಬಹುಮಾನ ವಂಚನೆ'
                  : language === 'hi'
                  ? 'लॉटरी या इनाम का झांसा'
                  : 'Lottery / Prize Fraud'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {language === 'kn'
                ? 'ವಂಚಕನ ಫೋನ್ / ಯುಪಿಐ:'
                : language === 'hi'
                ? 'ठग का फोन या यूपीआई:'
                : 'Scammer Phone / UPI:'}
            </label>
            <input
              type="text"
              value={scammerContact}
              onChange={(e) => setScammerContact(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full text-base font-bold p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್:'
                : language === 'hi'
                ? 'आपका बैंक:'
                : 'Your Bank:'}
            </label>
            <select
              value={myBank}
              onChange={(e) => setMyBank(e.target.value)}
              className="w-full text-base font-bold p-3.5 rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-900"
            >
              <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="Canara Bank">Canara Bank</option>
              <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
              <option value="Bank of Baroda">Bank of Baroda</option>
              <option value="Other Bank">Other Bank</option>
            </select>
          </div>
        </div>

        {/* Generated Slip Preview */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl font-mono text-sm sm:text-base space-y-2 whitespace-pre-line leading-relaxed shadow-inner">
          {generatedIncidentSummary}
        </div>

        {/* Action button to copy slip */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-2 py-3 px-5 rounded-xl font-bold text-base bg-blue-700 hover:bg-blue-800 text-white cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-300" />
                <span>
                  {language === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!' : language === 'hi' ? 'कॉपी हो गया!' : 'Copied!'}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>
                  {language === 'kn'
                    ? 'ವಿವರವನ್ನು ಕಾಪಿ ಮಾಡಿ'
                    : language === 'hi'
                    ? 'विवरण कॉपी करें'
                    : 'Copy Summary Text'}
                </span>
              </>
            )}
          </button>

          <SpeakerButton
            textToSpeak={generatedIncidentSummary}
            id="generated-slip-speak"
            size="md"
            label={t.readAloud[language]}
          />
        </div>

        {/* Compliance Notice: Aasara does not claim automatic filing */}
        <div className="p-3 bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-600 flex items-start gap-2 border border-slate-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
          <p>
            {language === 'kn'
              ? 'ಪ್ರಮುಖ ಮಾಹಿತಿ: ಆಸರಾ ನಿಮ್ಮ ಪರವಾಗಿ ತಾನಾಗಿಯೇ ಪೊಲೀಸ್ ದೂರು ದಾಖಲಿಸುವುದಿಲ್ಲ. ಈ ಸಾರಾಂಶವು ನೀವು 1930 ಕರೆ ಮಾಡುವಾಗ ಅಧಿಕಾರಿಗಳಿಗೆ ನಿಖರ ಮಾಹಿತಿ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.'
              : language === 'hi'
              ? 'महत्वपूर्ण सूचना: आसरा स्वचालित रूप से कोई पुलिस शिकायत दर्ज नहीं करता है। यह पर्ची 1930 पर बात करते समय आपकी सहायता के लिए बनाई गई है।'
              : 'Important Disclosure: Aasara does not automatically file police complaints. This slip is designed to help you communicate clearly and quickly when speaking with the official 1930 officer.'}
          </p>
        </div>
      </div>

      {/* Emergency Bank Helplines */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-slate-700" />
          <span>
            {language === 'kn'
              ? 'ಬ್ಯಾಂಕ್ ಖಾತೆ ಬ್ಲಾಕ್ ಮಾಡಲು ತುರ್ತು ಸಂಖ್ಯೆಗಳು'
              : language === 'hi'
              ? 'खाता व कार्ड तुरंत ब्लॉक करने हेतु बैंक नंबर'
              : 'Emergency Bank Hotlines to Freeze Accounts'}
          </span>
        </h2>

        <p className="text-sm text-slate-600">
          {language === 'kn'
            ? 'ಹೆಚ್ಚಿನ ಹಣ ಕಡಿತವಾಗದಂತೆ ತಡೆಯಲು ಕೂಡಲೇ ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ಗೆ ಕರೆ ಮಾಡಿ ನೆಟ್‌ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಸ್ಥಗಿತಗೊಳಿಸಿ:'
            : language === 'hi'
            ? 'आगे और नुकसान से बचने के लिए तुरंत अपने बैंक को फोन करके कार्ड व नेटबैंकिंग ब्लॉक करवाएं:'
            : 'Call your bank immediately to freeze internet banking and prevent further unauthorized withdrawals:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {bankHelplines.map((bank, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between"
            >
              <div>
                <p className="font-extrabold text-slate-900 text-base">{bank.name}</p>
                <p className="text-xs text-slate-500">{bank.desc}</p>
              </div>
              <a
                href={`tel:${bank.phone}`}
                className="mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-sm cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-blue-700" />
                <span>{bank.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
