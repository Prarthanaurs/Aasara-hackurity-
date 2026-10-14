import type { Language, TutorScenario } from '../types';

export const TUTOR_SCENARIOS: TutorScenario[] = [
  {
    id: 'scen-electricity',
    title: {
      en: 'The "Electricity Bill Cut-off" Call',
      kn: 'ಕರೆಂಟ್ ಬಿಲ್ ಕಡಿತದ ನಕಲಿ ಕರೆ',
      hi: 'बिजली बिल कटने का फर्जी फोन',
    },
    scammerMessage: {
      en: 'Hello Sir/Madam! I am calling from Electricity Board. Your power bill is pending. If you do not pay ₹10 right now through the link I send, your home power will be disconnected at 9 PM!',
      kn: 'ನಮಸ್ಕಾರ! ನಾನು ವಿದ್ಯುತ್ ಇಲಾಖೆಯಿಂದ ಕರೆ ಮಾಡುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ ಬಿಲ್ ಪಾವತಿಯಾಗಿಲ್ಲ. ನಾನು ಕಳುಹಿಸುವ ಲಿಂಕ್ ಮೂಲಕ ₹10 ಕಟ್ಟದಿದ್ದರೆ ಇಂದೇ ರಾತ್ರಿ ನಿಮ್ಮ ಮನೆ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸಲಾಗುವುದು!',
      hi: 'नमस्ते! मैं बिजली विभाग से बोल रहा हूँ। आपका बिल बाकी है। अगर आपने अभी मेरे भेजे लिंक से ₹10 नहीं भरे, तो आज रात 9 बजे आपकी बिजली काट दी जाएगी!',
    },
    scammerAudioText: {
      en: 'Hello! Your power bill is unpaid. Pay ₹10 immediately or power will be disconnected tonight!',
      kn: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಕರೆಂಟ್ ಬಿಲ್ ಬಾಕಿ ಇದೆ. ಕೂಡಲೇ ಹಣ ಕಟ್ಟದಿದ್ದರೆ ಇಂದೇ ವಿದ್ಯುತ್ ಕಡಿತ ಮಾಡುತ್ತೇವೆ!',
      hi: 'नमस्ते! आपका बिजली बिल बाकी है। तुरंत ₹10 भरें वरना आज रात बिजली कट जाएगी!',
    },
    options: [
      {
        text: {
          en: 'Panic and immediately open the link to pay ₹10.',
          kn: 'ಹೆದರಿಕೊಂಡು, ಅವರು ಕಳುಹಿಸಿದ ಲಿಂಕ್ ಮೇಲೆ ಹಣ ಕಳುಹಿಸುವುದು.',
          hi: 'घबराकर तुरंत लिंक खोलना और ₹10 भेजना।',
        },
        isSafe: false,
        feedback: {
          en: '⚠️ Danger! Scammers ask for small amounts like ₹10 to capture your net banking password and debit card OTP! Never click unknown links in fear.',
          kn: '⚠️ ಅಪಾಯ! ಕೇವಲ ₹10 ಕೇಳುವ ನೆಪದಲ್ಲಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಒಟಿಪಿ ಕದಿಯುತ್ತಾರೆ. ಹೆದರಿ ಅಪರಿಚಿತ ಲಿಂಕ್ ಮುಟ್ಟಬೇಡಿ.',
          hi: '⚠️ खतरा! ठग सिर्फ ₹10 के बहाने आपके बैंक की गोपनीय जानकारी और ओटीपी चुरा लेते हैं। डरकर लिंक कभी न खोलें।',
        },
      },
      {
        text: {
          en: 'Hang up the phone. Check my physical electricity bill and pay only via the official department app.',
          kn: 'ಫೋನ್ ಕಟ್ ಮಾಡುವುದು. ಮನೆಯ ಬಿಲ್ ನೋಡಿ, ಅಧಿಕೃತ ಕಚೇರಿಗೆ ಹೋಗಿ ಅಥವಾ ಅಧಿಕೃತ ಆ್ಯಪ್ ಮೂಲಕ ಮಾತ್ರ ಪಾವತಿಸುವುದು.',
          hi: 'फोन काट देना। घर का बिजली बिल देखना और केवल आधिकारिक ऐप या बिजली दफ्तर जाकर पता करना।',
        },
        isSafe: true,
        feedback: {
          en: '🌟 Excellent & Safe! Electricity boards never threaten to cut power at night over WhatsApp or personal mobile numbers. You protected your savings!',
          kn: '🌟 ಅತ್ಯುತ್ತಮ! ವಿದ್ಯುತ್ ಮಂಡಳಿ ಎಂದಿಗೂ ವೈಯಕ್ತಿಕ ಮೊಬೈಲ್‌ನಿಂದ ಕರೆ ಮಾಡಿ ರಾತ್ರಿ ಕರೆಂಟ್ ಕಟ್ ಮಾಡುವುದಿಲ್ಲ. ನೀವು ವಂಚನೆಯಿಂದ ಪಾರಾದಿರಿ!',
          hi: '🌟 शाबाश! बिजली विभाग कभी रात को फोन करके व्यक्तिगत नंबर से धमकी नहीं देता। आपने अपने पैसे सुरक्षित रखे!',
        },
      },
      {
        text: {
          en: 'Ask them to give their personal bank account details.',
          kn: 'ಅವರ ವೈಯಕ್ತಿಕ ಖಾತೆ ಸಂಖ್ಯೆ ಕೇಳಿ ಅವರಿಗೆ ನೇರವಾಗಿ ಹಣ ಹಾಕುವುದು.',
          hi: 'उनका पर्सनल खाता नंबर मांगकर उसमें पैसे भेजना।',
        },
        isSafe: false,
        feedback: {
          en: '⚠️ Never do this! Government and utility departments never collect payments into personal private accounts.',
          kn: '⚠️ ಎಂದಿಗೂ ಮಾಡಬೇಡಿ! ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳು ವೈಯಕ್ತಿಕ ಖಾತೆಗೆ ಹಣ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.',
          hi: '⚠️ ऐसा कभी न करें! सरकारी महकमे कभी व्यक्तिगत खातों में पैसे नहीं मांगते।',
        },
      },
    ],
  },
  {
    id: 'scen-qr-receive',
    title: {
      en: 'The "Scan QR Code to Receive ₹5,000" Trick',
      kn: 'ಹಣ ಸ್ವೀಕರಿಸಲು ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಮೋಸ',
      hi: 'पैसे पाने के लिए क्यूआर कोड स्कैन करने का धोखा',
    },
    scammerMessage: {
      en: 'Sir, I am buying your old sofa / sending your pension bonus of ₹5,000. I have sent you a QR code on WhatsApp. Please scan it and enter your UPI PIN to claim your money!',
      kn: 'ಸರ್, ನಿಮ್ಮ ಖಾತೆಗೆ ₹5,000 ಬೋನಸ್ ಹಣ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ. ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕ್ಯೂಆರ್ ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇನೆ. ಅದನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ಹಾಕಿದರೆ ಹಣ ನಿಮ್ಮ ಖಾತೆಗೆ ಜಮಾ ಆಗುತ್ತದೆ!',
      hi: 'सर, मैं आपके खाते में ₹5,000 पेंशन बोनस भेज रहा हूँ। मैंने व्हाट्सएप पर क्यूआर कोड भेजा है। इसे स्कैन करके अपना यूपीआई पिन डालें ताकि पैसे आपके खाते में आ जाएं!',
    },
    scammerAudioText: {
      en: 'I am sending you ₹5000. Scan the QR code and enter your UPI PIN to receive money.',
      kn: 'ನಾನು ನಿಮಗೆ 5000 ರೂಪಾಯಿ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ. ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ಹಾಕಿ.',
      hi: 'मैं आपको ₹5000 भेज रहा हूँ। क्यूआर कोड स्कैन करें और पैसे पाने के लिए यूपीआई पिन डालें।',
    },
    options: [
      {
        text: {
          en: 'Scan the QR code and type my UPI PIN quickly.',
          kn: 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನನ್ನ ಯುಪಿಐ ಪಿನ್ ಹಾಕುವುದು.',
          hi: 'क्यूआर कोड स्कैन करके अपना यूपीआई पिन डालना।',
        },
        isSafe: false,
        feedback: {
          en: '🛑 Big Loss! Entering your UPI PIN ALWAYS DEDUCTS money from your bank account! Money will be stolen from you, not credited.',
          kn: '🛑 ತೀವ್ರ ನಷ್ಟ! ಯುಪಿಐ ಪಿನ್ ಹಾಕಿದರೆ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತವಾಗುತ್ತದೆ! ಹಣ ಜಮಾ ಆಗುವುದಿಲ್ಲ, ಬದಲಿಗೆ ನಿಮ್ಮ ಹಣ ಕಳ್ಳರ ಪಾಲಾಗುತ್ತದೆ.',
          hi: '🛑 बड़ा नुकसान! यूपीआई पिन डालते ही आपके खाते से पैसे कट जाएंगे! पैसे मिलेंगे नहीं, बल्कि कट जाएंगे।',
        },
      },
      {
        text: {
          en: 'Refuse firmly: "Receiving money NEVER requires entering a UPI PIN or scanning QR codes!"',
          kn: 'ದೃಢವಾಗಿ ನಿರಾಕರಿಸುವುದು: "ಹಣ ಪಡೆಯಲು ಯುಪಿಐ ಪಿನ್ ಹಾಕುವ ಅಗತ್ಯವಿಲ್ಲ!" ಎಂದು ಹೇಳಿ ಕರೆ ಕಟ್ ಮಾಡುವುದು.',
          hi: 'साफ मना करना: "पैसे पाने के लिए कभी यूपीआई पिन डालने या क्यूआर स्कैन करने की जरूरत नहीं होती!"',
        },
        isSafe: true,
        feedback: {
          en: '🌟 Perfect! You remembered the Golden Rule of UPI: Entering a PIN is ONLY for paying money, NEVER for receiving money.',
          kn: '🌟 ಅದ್ಭುತ! ಯುಪಿಐ ಸುವರ್ಣ ನಿಯಮ ನೆನಪಿಟ್ಟುಕೊಂಡಿದ್ದೀರಿ: ಪಿನ್ ಹಾಕುವುದು ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ, ಹಣ ಸ್ವೀಕರಿಸಲು ಅಲ್ಲ!',
          hi: '🌟 बहुत बढ़िया! आपने यूपीआई का स्वर्णिम नियम याद रखा: पिन सिर्फ पैसे भेजने के लिए होता है, पाने के लिए कभी नहीं।',
        },
      },
    ],
  },
  {
    id: 'scen-apk-download',
    title: {
      en: 'The "Download App for Bank KYC" Trap',
      kn: 'ಬ್ಯಾಂಕ್ ಕೆವೈಸಿ ಹೆಸರಿನಲ್ಲಿ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಬಲೆ',
      hi: 'बैंक केवाईसी के नाम पर अनजान ऐप डाउनलोड का जाल',
    },
    scammerMessage: {
      en: 'Your bank account will freeze in 30 minutes! Please install "AnyDesk" or "QuickSupport" from this link so our bank officer can verify your passbook remotely.',
      kn: 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ 30 ನಿಮಿಷದಲ್ಲಿ ಫ್ರೀಜ್ ಆಗುತ್ತದೆ! ನಮ್ಮ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ ನಿಮ್ಮ ಪಾಸ್‌ಬುಕ್ ತಪಾಸಣೆ ಮಾಡಲು "AnyDesk" ಅಥವಾ ಲಿಂಕ್‌ನಲ್ಲಿರುವ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ!',
      hi: 'आपका बैंक खाता 30 मिनट में बंद हो जाएगा! हमारे बैंक अधिकारी द्वारा सत्यापन के लिए दिए गए लिंक से "एनीडेस्क" ऐप डाउनलोड करें।',
    },
    scammerAudioText: {
      en: 'Account freezing in 30 minutes. Install screen share app immediately for verification.',
      kn: 'ಖಾತೆ 30 ನಿಮಿಷದಲ್ಲಿ ರದ್ದಾಗುತ್ತದೆ. ತಪಾಸಣೆಗೆ ಕೂಡಲೇ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ.',
      hi: 'खाता 30 मिनट में बंद होगा। तुरंत ऐप डाउनलोड करें।',
    },
    options: [
      {
        text: {
          en: 'Never download screen-sharing apps or unknown APK files on strangers\' advice.',
          kn: 'ಯಾರೇ ಹೇಳಿದರೂ ಮೊಬೈಲ್‌ಗೆ ಅನಗತ್ಯ ಆ್ಯಪ್ ಅಥವಾ ಸ್ಕ್ರೀನ್ ಶೇರ್ ಆ್ಯಪ್ ಹಾಕಿಕೊಳ್ಳುವುದಿಲ್ಲ ಎಂದು ಹೇಳುವುದು.',
          hi: 'किसी अजनबी के कहने पर कभी भी स्क्रीन-शेयरिंग या अनजान ऐप डाउनलोड नहीं करना।',
        },
        isSafe: true,
        feedback: {
          en: '🌟 100% Right! Screen sharing apps allow scammers to see your screen, read your secret OTPs, and empty your bank account.',
          kn: '🌟 ನೂರಕ್ಕೆ ನೂರು ಸರಿ! ಸ್ಕ್ರೀನ್ ಶೇರ್ ಆ್ಯಪ್‌ಗಳಿಂದ ವಂಚಕರು ನಿಮ್ಮ ಮೊಬೈಲ್ ಪರದೆಯನ್ನು ನೋಡಿ ನಿಮ್ಮ ಒಟಿಪಿ ಕದ್ದು ಹಣ ಲಪಟಾಯಿಸುತ್ತಾರೆ.',
          hi: '🌟 बिल्कुल सही! स्क्रीन शेयरिंग ऐप से ठग आपके फोन की स्क्रीन देखकर ओटीपी पढ़ लेते हैं और खाता खाली कर देते हैं।',
        },
      },
      {
        text: {
          en: 'Install the app quickly so account does not freeze.',
          kn: 'ಖಾತೆ ಉಳಿಸಿಕೊಳ್ಳಲು ತಕ್ಷಣವೇ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿಕೊಳ್ಳುವುದು.',
          hi: 'खाता चालू रखने के लिए तुरंत ऐप डाउनलोड कर लेना।',
        },
        isSafe: false,
        feedback: {
          en: '🛑 High Danger! This grants total control of your phone to the criminal. Official banks NEVER ask you to install screen share apps.',
          kn: '🛑 ತೀವ್ರ ಅಪಾಯ! ಇದರಿಂದ ನಿಮ್ಮ ಇಡೀ ಮೊಬೈಲ್ ಕಳ್ಳರ ನಿಯಂತ್ರಣಕ್ಕೆ ಹೋಗುತ್ತದೆ. ಬ್ಯಾಂಕುಗಳು ಎಂದಿಗೂ ಇಂತಹ ಆ್ಯಪ್ ಹಾಕಲು ಹೇಳುವುದಿಲ್ಲ.',
          hi: '🛑 बड़ा खतरा! इससे आपके फोन का पूरा कंट्रोल ठग के पास चला जाता है। बैंक कभी ऐसा ऐप डालने को नहीं कहते।',
        },
      },
    ],
  },
];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: Record<Language, string>;
  timestamp: string;
}

export const COMMON_QUESTIONS = [
  {
    id: 'q1',
    label: {
      en: 'Can someone steal money just from my phone number or account number?',
      kn: 'ನನ್ನ ಫೋನ್ ನಂಬರ್ ಅಥವಾ ಖಾತೆ ಸಂಖ್ಯೆ ತಿಳಿದರೆ ಯಾರಾದರೂ ಹಣ ಕದಿಯಬಹುದೇ?',
      hi: 'क्या सिर्फ फोन नंबर या खाता नंबर जानने से कोई पैसे चुरा सकता है?',
    },
    answer: {
      en: 'No. Just knowing your phone number or bank account number is not enough to steal your money. To transfer money, criminals need your secret OTP, UPI PIN, or NetBanking password. As long as you NEVER share your OTP or PIN, your money remains safe.',
      kn: 'ಇಲ್ಲ. ಕೇವಲ ನಿಮ್ಮ ಮೊಬೈಲ್ ನಂಬರ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಅಕೌಂಟ್ ಸಂಖ್ಯೆ ತಿಳಿದುಕೊಂಡ ಮಾತ್ರಕ್ಕೆ ಯಾರೂ ಹಣ ಕದಿಯಲು ಸಾಧ್ಯವಿಲ್ಲ. ಹಣ ಡ್ರಾ ಮಾಡಲು ನಿಮ್ಮ ರಹಸ್ಯ ಒಟಿಪಿ (OTP) ಅಥವಾ ಯುಪಿಐ ಪಿನ್ (UPI PIN) ಬೇಕೇ ಬೇಕು. ಅದನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳದಿದ್ದರೆ ನಿಮ್ಮ ಹಣ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.',
      hi: 'नहीं। सिर्फ फोन नंबर या बैंक खाता नंबर जानने से कोई आपके पैसे नहीं निकाल सकता। पैसे निकालने के लिए ठगों को आपका गुप्त ओटीपी (OTP) या यूपीआई पिन चाहिए होता है। जब तक आप पिन या ओटीपी किसी को नहीं बताते, आपका पैसा पूरी तरह सुरक्षित है।',
    },
  },
  {
    id: 'q2',
    label: {
      en: 'Why do scammers create so much urgency and panic?',
      kn: 'ವಂಚಕರು ಅಷ್ಟು ತರಾತುರಿ ಮತ್ತು ಗಾಬರಿ ಏಕೆ ಹುಟ್ಟಿಸುತ್ತಾರೆ?',
      hi: 'ठग इतनी जल्दीबाजी और घबराहಟ್ क्यों पैदा करते हैं?',
    },
    answer: {
      en: 'Scammers know that when humans are frightened (e.g., "Electricity cutoff tonight" or "Account suspended in 10 minutes"), we act without thinking. Their entire strategy is panic. The safest response is to pause, take a deep breath, and consult your children or trusted bank manager before doing anything.',
      kn: 'ಜನರು ಗಾಬರಿಯಾದಾಗ ಆಲೋಚಿಸದೆ ತಪ್ಪು ಮಾಡುತ್ತಾರೆ ಎಂದು ವಂಚಕರಿಗೆ ಚೆನ್ನಾಗಿ ತಿಳಿದಿದೆ. "ಇಂದೇ ರಾತ್ರಿ ವಿದ್ಯುತ್ ಕಟ್", "30 ನಿಮಿಷದಲ್ಲಿ ಖಾತೆ ಬಂದ್" ಎಂದು ಹೆದರಿಸುವುದೇ ಅವರ ತಂತ್ರ. ಅಂತಹ ಸಂದರ್ಭದಲ್ಲಿ ಗಾಬರಿಯಾಗದೆ, ಶಾಂತರಾಗಿ ನಿಮ್ಮ ಮಕ್ಕಳಿಗೆ ಅಥವಾ ಪರಿಚಿತ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಕೇಳಿ ಪರಿಶೀಲಿಸಿ.',
      hi: 'ठग जानते हैं कि डर के माहौल में लोग बिना सोचे-समझे कदम उठाते हैं। "आज रात बिजली कटेगी" या "खाता ब्लॉक होगा" कहकर डराना ही उनका मुख्य हथियार है। जब भी कोई जल्दबाजी करे, रुकें, गहरी सांस लें और अपने परिवार या बैंक से सलाह लें।',
    },
  },
  {
    id: 'q3',
    label: {
      en: 'What is the Golden Rule of UPI payments?',
      kn: 'ಯುಪಿಐ ಪಾವತಿಯ ಸುವರ್ಣ ನಿಯಮ ಯಾವುದು?',
      hi: 'यूपीआई का स्वर्णिम नियम क्या है?',
    },
    answer: {
      en: 'The Golden Rule: Entering your UPI PIN ALWAYS transfers money OUT of your bank account. You NEVER need to enter a PIN to receive money, receive cashback, or claim a lottery. If someone says "Enter PIN to receive ₹2000", they are 100% lying.',
      kn: 'ಸುವರ್ಣ ನಿಯಮ: ಯುಪಿಐ ಪಿನ್ ಹಾಕಿದರೆ ಹಣ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಕಡಿತವಾಗುತ್ತದೆ. ಹಣ ಸ್ವೀಕರಿಸಲು, ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಪಡೆಯಲು ಅಥವಾ ಬಹುಮಾನ ಪಡೆಯಲು ಎಂದಿಗೂ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ! ಯಾರಾದರೂ "ಹಣ ಪಡೆಯಲು ಪಿನ್ ಹಾಕಿ" ಎಂದರೆ ಅದು 100% ಸುಳ್ಳು ಮತ್ತು ವಂಚನೆ.',
      hi: 'स्वर्णिम नियम: यूपीआई पिन डालने से हमेशा आपके खाते से पैसे कटते हैं। पैसे पाने या कैशबैक लेने के लिए कभी पिन डालने की जरूरत नहीं होती। यदि कोई कहे कि "पैसे पाने के लिए पिन डालो", तो वह 100% झूठ बोल रहा है।',
    },
  },
];
