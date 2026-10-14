import type { CheckResult } from '../types';

export interface SampleMessage {
  id: string;
  label: Record<string, string>;
  category: string;
  text: string;
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: 'sample-power',
    label: {
      en: 'Electricity Bill Cut-off Threat',
      kn: 'ವಿದ್ಯುತ್ ಬಿಲ್ ಕಡಿತ ಬೆದರಿಕೆ',
      hi: 'बिजली बिल कटने की धमकी',
    },
    category: 'Urgent Threat',
    text: 'Dear Customer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately call our electricity officer at 9876543210. BESCOM / MSEDCL.',
  },
  {
    id: 'sample-sbi',
    label: {
      en: 'SBI Account Blocked KYC Link',
      kn: 'ಎಸ್.ಬಿ.ಐ ಖಾತೆ ಬ್ಲಾಕ್ ಲಿಂಕ್ ವಂಚನೆ',
      hi: 'एसबीआई खाता ब्लॉक केवाईसी लिंक',
    },
    category: 'Bank Impersonation',
    text: 'Dear SBI User, your YONO NetBanking account has been blocked today due to incomplete PAN card KYC. Click here http://sbi-kyc-verify.xyz to update your details and unblock immediately or account will be permanently closed.',
  },
  {
    id: 'sample-lottery',
    label: {
      en: 'KBC Lottery Winner Scam',
      kn: 'ಕೆಬಿಸಿ ಲಾಟರಿ 25 ಲಕ್ಷ ಬಹುಮಾನ',
      hi: 'केबीसी 25 लाख लॉटरी फर्जीवाड़ा',
    },
    category: 'Prize Fraud',
    text: 'Congratulations! Your WhatsApp number has won a prize of Rs 25,00,000 from KBC Lottery 2026. To claim your prize money, send Rs 2,500 processing tax to UPI id kbcwinner@paytm and share your OTP with manager.',
  },
  {
    id: 'sample-post',
    label: {
      en: 'India Post Failed Delivery',
      kn: 'ಇಂಡಿಯಾ ಪೋಸ್ಟ್ ಪಾರ್ಸೆಲ್ ಲಿಂಕ್',
      hi: 'इंडिया पोस्ट पार्सल डिलीवरी संदेश',
    },
    category: 'Delivery Scam',
    text: 'India Post: Your package cannot be delivered due to incomplete street address. Please update your address within 12 hours at bit.ly/ind-post-redelivery and pay Rs 15 re-dispatch fee.',
  },
  {
    id: 'sample-safe',
    label: {
      en: 'Safe Bank Credit SMS (Genuine)',
      kn: 'ನಿಜವಾದ ಬ್ಯಾಂಕ್ ಜಮಾ ಸಂದೇಶ',
      hi: 'असली बैंक क्रेडिट एसएमएस',
    },
    category: 'Genuine Message',
    text: 'Dear Customer, INR 500.00 has been credited to your account XX1234 on 14-Oct-26 by UPI transfer from RAMESH KUMAR. Available balance: INR 12,450.00 - State Bank of India.',
  },
];

export class CheckerService {
  public static analyzeMessage(rawText: string): CheckResult {
    const text = rawText.trim().toLowerCase();
    const matchedReasons: Array<{ icon: string; text: Record<string, string> }> = [];
    const actionAdvice: Array<{ text: Record<string, string>; isImportant?: boolean }> = [];
    const matchedKeywords: string[] = [];

    let riskScore = 0; // 0 = safe, 100 = extreme danger

    // 1. Check for Urgent Intimidation & Threats
    const threatKeywords = [
      'blocked', 'blocked today', 'disconnected', 'disconnect tonight', 'suspended', 
      'permanently closed', 'police', 'arrest', 'fir', 'court notice', 'warrant',
      'ಬ್ಲಾಕ್', 'ಕಡಿತ', 'ಖಾತೆ ರದ್ದು', 'ಪೊಲೀಸ್', 'ತಾತ್ಕಾಲಿಕ ರದ್ದು',
      'ब्लॉक', 'कट जाएगा', 'बिजली कटेगी', 'सस्पेंड', 'गिरफ्तारी', 'वारंट'
    ];
    const foundThreats = threatKeywords.filter(k => text.includes(k));
    if (foundThreats.length > 0) {
      riskScore += 35;
      matchedKeywords.push(...foundThreats);
      matchedReasons.push({
        icon: 'AlertTriangle',
        text: {
          en: 'Creates fear with urgent threats (such as "account blocked today" or "power disconnected tonight").',
          kn: 'ತುರ್ತು ಬೆದರಿಕೆಯೊಡ್ಡಿ ಭಯ ಹುಟ್ಟಿಸುತ್ತದೆ (ಉದಾಹರಣೆಗೆ "ಇಂದೇ ಖಾತೆ ರದ್ದು" ಅಥವಾ "ವಿದ್ಯುತ್ ಕಡಿತ").',
          hi: 'डर और दबाव पैदा करने वाली धमकी (जैसे "आज ही खाता बंद होगा" या "बिजली कट जाएगी")।',
        },
      });
    }

    // 2. Check for OTP, PIN, Password Requests
    const otpKeywords = [
      'otp', 'one time password', 'pin', 'upi pin', 'password', 'cvv', 'card number', 
      'share otp', 'enter pin to receive', 'pan kyc',
      'ಒಟಿಪಿ', 'ಪಿನ್', 'ಪಾಸ್ವರ್ಡ್',
      'ओटीपी', 'पिन', 'पासवर्ड', 'सीवीवी'
    ];
    const foundOtp = otpKeywords.filter(k => text.includes(k));
    if (foundOtp.length > 0) {
      riskScore += 40;
      matchedKeywords.push(...foundOtp);
      matchedReasons.push({
        icon: 'Lock',
        text: {
          en: 'Asks for sensitive security information (OTP, PIN, password, or PAN verification).',
          kn: 'ಅತ್ಯಂತ ರಹಸ್ಯ ಭದ್ರತಾ ವಿವರಗಳನ್ನು (ಒಟಿಪಿ, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್) ಕೇಳುತ್ತಿದೆ.',
          hi: 'गोपनीय सुरक्षा जानकारी (ओटीपी, पिन, पासवर्ड या पैन कार्ड) मांगी जा रही है।',
        },
      });
    }

    // 3. Check for Suspicious Links, Unofficial Domains, IP Addresses
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|online|site|club|vip|icu|work|apk|cn|ru)[^\s]*|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+)/gi;
    const linksFound = text.match(urlRegex) || [];
    
    // Check for spoofed bank names inside unofficial domains
    const hasBankInFakeDomain = /sbi.*\.xyz|yono.*\.xyz|hdfc.*\.site|post.*bit\.ly/i.test(text);
    const hasApk = text.includes('.apk') || text.includes('download');

    if (linksFound.length > 0 || hasBankInFakeDomain || hasApk) {
      riskScore += 35;
      matchedReasons.push({
        icon: 'Globe',
        text: {
          en: 'Contains suspicious or shortened web links (.xyz, bit.ly, or unofficial domains) designed to steal passwords.',
          kn: 'ಅಧಿಕೃತವಲ್ಲದ, ಅನುಮಾನಾಸ್ಪದ ವೆಬ್ ಲಿಂಕ್‌ಗಳನ್ನು (.xyz, bit.ly) ಹೊಂದಿದೆ. ಇದು ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಕೊಂಡೊಯ್ಯಬಹುದು.',
          hi: 'संदिग्ध या छोटे किए गए लिंक (.xyz, bit.ly) पाए गए हैं, जो नकली वेबसाइट पर ले जाकर जानकारी चुरा सकते हैं।',
        },
      });
    }

    // 4. Check for Impersonation (Bank, Electricity Board, Post Office, KBC)
    const entityKeywords = ['sbi', 'yono', 'hdfc', 'icici', 'bescom', 'msedcl', 'india post', 'kbc', 'lottery', 'income tax'];
    const foundEntities = entityKeywords.filter(k => text.includes(k));
    if (foundEntities.length > 0 && riskScore >= 30) {
      riskScore += 15;
      matchedReasons.push({
        icon: 'ShieldAlert',
        text: {
          en: `Impersonates trusted organizations (${foundEntities.map(e => e.toUpperCase()).join(', ')}) without official security indicators.`,
          kn: `ವಿಶ್ವಾಸಾರ್ಹ ಸಂಸ್ಥೆಗಳ (${foundEntities.map(e => e.toUpperCase()).join(', ')}) ಹೆಸರಿನಲ್ಲಿ ನಕಲಿ ಸೋಗು ಹಾಕುತ್ತಿದೆ.`,
          hi: `प्रतिष्ठित संस्थाओं (${foundEntities.map(e => e.toUpperCase()).join(', ')}) के नाम का गलत इस्तेमाल कर रहा है।`,
        },
      });
    }

    // 5. Genuine notification indicators (safe credit alerts)
    const genuineKeywords = ['credited to your account', 'available balance', 'has been credited', 'inr', 'debited for', 'ನಿಮ್ಮ ಖಾತೆಗೆ ಜಮಾ ಆಗಿದೆ', 'जमा किए गए'];
    const isCreditNotification = genuineKeywords.filter(k => text.includes(k)).length >= 2;
    if (isCreditNotification && linksFound.length === 0 && foundThreats.length === 0 && foundOtp.length === 0) {
      riskScore = Math.max(0, riskScore - 50);
    }

    // Determine Risk Classification
    if (riskScore >= 40) {
      actionAdvice.push(
        {
          isImportant: true,
          text: {
            en: 'DO NOT CLICK any links and DO NOT call the phone number given inside the message.',
            kn: 'ಯಾವುದೇ ಲಿಂಕ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ ಮತ್ತು ಸಂದೇಶದಲ್ಲಿರುವ ಫೋನ್ ನಂಬರ್‌ಗೆ ಕರೆ ಮಾಡಬೇಡಿ.',
            hi: 'संदेश में दिए गए किसी भी लिंक पर क्लिक न करें और न ही उस नंबर पर कॉल करें।',
          },
        },
        {
          isImportant: true,
          text: {
            en: 'NEVER share OTP, UPI PIN, or bank passwords with anyone. Banks never ask for PIN.',
            kn: 'ನಿಮ್ಮ ಒಟಿಪಿ, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಬ್ಯಾಂಕ್ ಎಂದಿಗೂ ಪಿನ್ ಕೇಳುವುದಿಲ್ಲ.',
            hi: 'अपना ओटीपी या यूपीआई पिन कभी किसी को न बताएं। बैंक कभी फोन या मैसेज पर पिन नहीं मांगता।',
          },
        },
        {
          text: {
            en: 'If in doubt, visit your bank branch directly or call the official customer care number on your passbook.',
            kn: 'ಅನುಮಾನವಿದ್ದರೆ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ಪಾಸ್‌ಬುಕ್‌ನಲ್ಲಿರುವ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ.',
            hi: 'संदेह होने पर सीधे अपनी बैंक शाखा जाएं या पासबुक पर दिए गए आधिकारिक नंबर पर बात करें।',
          },
        }
      );

      return {
        riskLevel: 'danger',
        safeScore: Math.max(5, 100 - riskScore),
        title: {
          en: '⚠️ High Scam Warning: Do Not Respond',
          kn: '⚠️ ತೀವ್ರ ವಂಚನೆಯ ಎಚ್ಚರಿಕೆ: ಪ್ರತಿಕ್ರಿಯಿಸಬೇಡಿ',
          hi: '⚠️ भारी धोखाधड़ी की चेतावनी: कोई जवाब न दें',
        },
        summary: {
          en: 'This message shows clear signs of digital cyber fraud. Scammers are trying to panic you into sharing sensitive information or clicking harmful links.',
          kn: 'ಈ ಸಂದೇಶದಲ್ಲಿ ವಂಚನೆಯ ಸ್ಪಷ್ಟ ಲಕ್ಷಣಗಳಿವೆ. ಭಯ ಹುಟ್ಟಿಸಿ ನಿಮ್ಮಿಂದ ಗೌಪ್ಯ ವಿವರ ಪಡೆಯಲು ಅಥವಾ ಅಪಾಯಕಾರಿ ಲಿಂಕ್ ತೆರೆಸಲು ಪ್ರಯತ್ನಿಸಲಾಗುತ್ತಿದೆ.',
          hi: 'इस संदेश में डिजिटल धोखाधड़ी के स्पष्ट लक्षण हैं। ठग आपको डराकर गोपनीय जानकारी या पैसे ऐंठने की कोशिश कर रहे हैं।',
        },
        reasons: matchedReasons,
        actionAdvice,
        matchedKeywords,
      };
    } else if (riskScore > 10 || linksFound.length > 0) {
      actionAdvice.push(
        {
          isImportant: true,
          text: {
            en: 'Treat this message with caution. Do not click links unless you personally know the sender.',
            kn: 'ಈ ಸಂದೇಶದ ಬಗ್ಗೆ ಎಚ್ಚರವಿರಲಿ. ಕಳುಹಿಸಿದವರನ್ನು ನೀವು ವೈಯಕ್ತಿಕವಾಗಿ ಗುರುತಿಸದಿದ್ದರೆ ಲಿಂಕ್ ತೆರೆಯಬೇಡಿ.',
            hi: 'सावधानी बरतें। जब तक भेजने वाले को व्यक्तिगत रूप से न जानते हों, किसी लिंक को न खोलें।',
          },
        },
        {
          text: {
            en: 'Verify through official channels before taking any action.',
            kn: 'ಯಾವುದೇ ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಮುನ್ನ ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
            hi: 'कोई भी कदम उठाने से पहले आधिकारिक माध्यम से पुष्टि कर लें।',
          },
        }
      );

      return {
        riskLevel: 'caution',
        safeScore: 65,
        title: {
          en: '⚠️ Caution: Unverified Message',
          kn: '⚠️ ಎಚ್ಚರಿಕೆ: ದೃಢೀಕರಿಸದ ಸಂದೇಶ',
          hi: '⚠️ सावधानी: असत्यापित संदेश',
        },
        summary: {
          en: 'This message has some suspicious patterns. It may not be an immediate threat, but proceed carefully without sharing private data.',
          kn: 'ಈ ಸಂದೇಶದಲ್ಲಿ ಕೆಲವು ಅನುಮಾನಾಸ್ಪದ ಅಂಶಗಳಿವೆ. ಖಾಸಗಿ ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳದೆ ಎಚ್ಚರಿಕೆಯಿಂದ ಇರಿ.',
          hi: 'इस संदेश में कुछ संदिग्ध बातें हैं। अपनी निजी जानकारी साझा किए बिना सतर्क रहें।',
        },
        reasons: matchedReasons.length > 0 ? matchedReasons : [
          {
            icon: 'HelpCircle',
            text: {
              en: 'Contains external web link or unverified claims.',
              kn: 'ಬಾಹ್ಯ ವೆಬ್ ಲಿಂಕ್ ಅಥವಾ ದೃಢೀಕರಿಸದ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ.',
              hi: 'बाहरी वेब लिंक या अपुष्ट दावे मौजूद हैं।',
            },
          },
        ],
        actionAdvice,
        matchedKeywords,
      };
    } else {
      actionAdvice.push({
        text: {
          en: 'Standard bank alerts inform you of transactions. Remember that receiving money never requires entering your UPI PIN.',
          kn: 'ಸಾಮಾನ್ಯ ಬ್ಯಾಂಕ್ ಸಂದೇಶಗಳು ಜಮಾ ವಿವರ ನೀಡುತ್ತವೆ. ಹಣ ಸ್ವೀಕರಿಸಲು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ ಎಂಬುದನ್ನು ನೆನಪಿಡಿ.',
          hi: 'सामान्य बैंक मैसेज केवल लेनदेन की सूचना देते हैं। याद रखें कि पैसे प्राप्त करने के लिए कभी यूपीआई पिन नहीं डालना होता।',
        },
      });

      return {
        riskLevel: 'safe',
        safeScore: 92,
        title: {
          en: '✅ Likely Safe / Standard Notification',
          kn: '✅ ಬಹುತೇಕ ಸುರಕ್ಷಿತ / ಸಾಮಾನ್ಯ ಸಂದೇಶ',
          hi: '✅ संभवतः सुरक्षित / सामान्य सूचना',
        },
        summary: {
          en: 'No common fraud patterns detected. It looks like an ordinary alert or genuine transaction message.',
          kn: 'ಯಾವುದೇ ಸಾಮಾನ್ಯ ವಂಚನೆ ಅಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಇದು ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಅಥವಾ ಅಧಿಕೃತ ವಹಿವಾಟು ಸಂದೇಶದಂತೆ ಕಾಣುತ್ತದೆ.',
          hi: 'धोखाधड़ी का कोई सामान्य संकेत नहीं मिला। यह एक सामान्य सूचना या वास्तविक लेनदेन का संदेश प्रतीत होता है।',
        },
        reasons: [
          {
            icon: 'CheckCircle',
            text: {
              en: 'Does not demand urgent money transfer, OTP, or passwords.',
              kn: 'ತುರ್ತಾಗಿ ಹಣ ಕಳುಹಿಸಲು, ಒಟಿಪಿ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ನೀಡಲು ಒತ್ತಾಯಿಸುತ್ತಿಲ್ಲ.',
              hi: 'तुरंत पैसे भेजने, ओटीपी या पासवर्ड देने का कोई दबाव नहीं है।',
            },
          },
        ],
        actionAdvice,
        matchedKeywords: [],
      };
    }
  }
}
