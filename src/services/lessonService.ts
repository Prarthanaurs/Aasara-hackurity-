import type { EducationalLesson } from '../types';

export const EDUCATIONAL_LESSONS: EducationalLesson[] = [
  {
    id: 'lesson-1',
    title: {
      en: '1. How to Spot a Fake Bank Alert',
      kn: '೧. ನಕಲಿ ಬ್ಯಾಂಕ್ ಸಂದೇಶವನ್ನು ಗುರುತಿಸುವುದು ಹೇಗೆ?',
      hi: '१. नकली बैंक मैसेज को कैसे पहचानें?',
    },
    category: {
      en: 'Bank Safety',
      kn: 'ಬ್ಯಾಂಕ್ ಸುರಕ್ಷತೆ',
      hi: 'बैंक सुरक्षा',
    },
    readTime: '2 min',
    summary: {
      en: 'Real banks never send urgent warnings threatening to close your account today via SMS links.',
      kn: 'ನಿಜವಾದ ಬ್ಯಾಂಕ್ ಎಂದಿಗೂ ಇಂದೇ ಖಾತೆ ಬಂದ್ ಆಗುತ್ತದೆ ಎಂದು ಎಸ್‌ಎಂಎಸ್ ಲಿಂಕ್ ಮೂಲಕ ಬೆದರಿಸುವುದಿಲ್ಲ.',
      hi: 'असली बैंक कभी एसएमएस लिंक भेजकर आज ही खाता बंद करने की धमकी नहीं देते।',
    },
    keyRules: [
      {
        en: 'Banks send messages from official sender IDs like "VK-SBIINB" or "AD-HDFCBK", not personal 10-digit mobile numbers.',
        kn: 'ಬ್ಯಾಂಕ್‌ಗಳು "VK-SBIINB" ನಂತಹ ಅಧಿಕೃತ ಐಡಿಗಳಿಂದ ಸಂದೇಶ ಕಳುಹಿಸುತ್ತವೆ, 10 ಅಂಕಿಯ ವೈಯಕ್ತಿಕ ಮೊಬೈಲ್‌ನಿಂದಲ್ಲ.',
        hi: 'बैंक आधिकारिक आईडी (जैसे VK-SBIINB) से मैसेज भेजते हैं, किसी 10 अंकों के व्यक्तिगत मोबाइल नंबर से नहीं।',
      },
      {
        en: 'Never click on website links ending with ".xyz", ".top", or bit.ly links claiming to update PAN KYC.',
        kn: 'ಪ್ಯಾನ್ ಕೆವೈಸಿ ಅಪ್ಡೇಟ್ ಹೆಸರಿನಲ್ಲಿ ಬರುವ ".xyz" ಅಥವಾ ಬಿಟ್ಲಿ (bit.ly) ಲಿಂಕ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಮುಟ್ಟಬೇಡಿ.',
        hi: 'पैन या केवाईसी अपडेट करने का दावा करने वाले ".xyz" या छोटे लिंक पर कभी क्लिक न करें।',
      },
      {
        en: 'Always update your KYC by visiting your physical bank branch with your passbook.',
        kn: 'ನಿಮ್ಮ ಕೆವೈಸಿ ಅಪ್ಡೇಟ್ ಮಾಡಬೇಕಿದ್ದರೆ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ನೇರವಾಗಿ ತೆರಳಿ.',
        hi: 'केवाईसी अपडेट हमेशा अपनी बैंक शाखा जाकर पासबुक के साथ ही करवाएं।',
      },
    ],
    quizQuestion: {
      question: {
        en: 'You get an SMS: "YONO blocked today. Click link sbi-kyc.xyz to unblock." What should you do?',
        kn: 'ಸಂದೇಶ ಬಂದಿದೆ: "ಯೋನೋ ಖಾತೆ ಇಂದೇ ಬ್ಲಾಕ್. ಸರಿಪಡಿಸಲು sbi-kyc.xyz ಲಿಂಕ್ ಒತ್ತಿ." ನೀವು ಏನು ಮಾಡಬೇಕು?',
        hi: 'संदेश आया: "खाता आज ब्लॉक होगा। sbi-kyc.xyz लिंक खोलें।" आपको क्या करना चाहिए?',
      },
      options: [
        {
          en: 'Immediately click the link and enter card number.',
          kn: 'ಕೂಡಲೇ ಲಿಂಕ್ ಒತ್ತಿ ಕಾರ್ಡ್ ನಂಬರ್ ಹಾಕುವುದು.',
          hi: 'तुरंत लिंक खोलकर कार्ड नंबर डालना।',
        },
        {
          en: 'Ignore the link, delete message, and ask my bank branch.',
          kn: 'ಲಿಂಕ್ ಮುಟ್ಟದೆ ಅಳಿಸಿ ಹಾಕುವುದು, ಬ್ಯಾಂಕ್ ಶಾಖೆಯಲ್ಲಿ ವಿಚಾರಿಸುವುದು.',
          hi: 'लिंक को नजरअंदाज करें, मैसेज डिलीट करें और बैंक जाकर पूछें।',
        },
        {
          en: 'Forward the message to all my WhatsApp contacts.',
          kn: 'ಎಲ್ಲಾ ವಾಟ್ಸಾಪ್ ಗ್ರೂಪ್‌ಗಳಿಗೆ ಫಾರ್ವರ್ಡ್ ಮಾಡುವುದು.',
          hi: 'सभी व्हाट्सएप ग्रुप में शेयर करना।',
        },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Correct! Never trust unofficial links ending in .xyz. Official banks never ask for credentials via links.',
        kn: 'ಸರಿಯಾದ ಉತ್ತರ! .xyz ಲಿಂಕ್‌ಗಳನ್ನು ಎಂದಿಗೂ ನಂಬಬೇಡಿ. ಬ್ಯಾಂಕುಗಳು ಎಂದಿಗೂ ಲಿಂಕ್ ಮೂಲಕ ಪಾಸ್‌ವರ್ಡ್ ಕೇಳುವುದಿಲ್ಲ.',
        hi: 'बिल्कुल सही! .xyz वाले लिंक पर कभी भरोसा न करें। बैंक लिंक के जरिए निजी जानकारी नहीं मांगते।',
      },
    },
  },
  {
    id: 'lesson-2',
    title: {
      en: '2. The UPI PIN Rule: Sending vs Receiving',
      kn: '೨. ಯುಪಿಐ ಪಿನ್ ನಿಯಮ: ಹಣ ಕಳುಹಿಸುವುದು ಮತ್ತು ಸ್ವೀಕರಿಸುವುದು',
      hi: '२. यूपीआई पिन का नियम: पैसे भेजना बनाम पाना',
    },
    category: {
      en: 'UPI Safety',
      kn: 'ಯುಪಿಐ ಭದ್ರತೆ',
      hi: 'यूपीआई सुरक्षा',
    },
    readTime: '2 min',
    summary: {
      en: 'You NEVER need to enter your UPI PIN to receive money, lottery prizes, or cashback refunds.',
      kn: 'ಹಣ ಸ್ವೀಕರಿಸಲು, ಲಾಟರಿ ಹಣ ಪಡೆಯಲು ಅಥವಾ ರಿಫಂಡ್ ಪಡೆಯಲು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ಹಾಕಬೇಕಾಗಿಲ್ಲ.',
      hi: 'पैसे प्राप्त करने, लॉटरी या रिफंड पाने के लिए कभी यूपीआई पिन डालने की जरूरत नहीं होती।',
    },
    keyRules: [
      {
        en: 'Entering UPI PIN = Money GOES OUT of your bank account.',
        kn: 'ಯುಪಿಐ ಪಿನ್ ಹಾಕಿದರೆ = ಹಣ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹೊರಹೋಗುತ್ತದೆ.',
        hi: 'यूपीआई पिन दर्ज करना = आपके खाते से पैसा कटना।',
      },
      {
        en: 'To RECEIVE money, the sender only needs your mobile number or UPI ID. Nothing else.',
        kn: 'ಹಣ ಸ್ವೀಕರಿಸಲು ಕೇವಲ ನಿಮ್ಮ ಮೊಬೈಲ್ ನಂಬರ್ ಅಥವಾ ಯುಪಿಐ ಐಡಿ ಸಾಕಾಗುತ್ತದೆ. ಬೇರೇನೂ ಬೇಕಾಗಿಲ್ಲ.',
        hi: 'पैसे पाने के लिए भेजने वाले को केवल आपका मोबाइल नंबर या यूपीआई आईडी चाहिए।',
      },
      {
        en: 'Never scan a QR code to "collect" money.',
        kn: 'ಹಣ ಪಡೆಯಲು ಯಾವುದೇ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಬೇಡಿ.',
        hi: 'पैसे "पाने" के लिए कभी भी क्यूआर कोड स्कैन न करें।',
      },
    ],
    quizQuestion: {
      question: {
        en: 'Someone claims: "I am sending you ₹2,000 refund, please enter your UPI PIN to accept it." Is this true?',
        kn: 'ಒಬ್ಬ ವ್ಯಕ್ತಿ: "ನಾನು ₹2000 ರಿಫಂಡ್ ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ, ಸ್ವೀಕರಿಸಲು ಯುಪಿಐ ಪಿನ್ ಹಾಕಿ" ಎನ್ನುತ್ತಾನೆ. ಇದು ಸರಿಯೇ?',
        hi: 'कोई कहता है: "मैं ₹2,000 रिफंड भेज रहा हूँ, लेने के लिए अपना यूपीआई पिन डालें।" क्या यह सही है?',
      },
      options: [
        {
          en: 'Yes, entering PIN is required to accept refunds.',
          kn: 'ಹೌದು, ಹಣ ಪಡೆಯಲು ಪಿನ್ ಹಾಕಬೇಕು.',
          hi: 'हाँ, रिफंड लेने के लिए पिन डालना जरूरी होता है।',
        },
        {
          en: 'No! Entering PIN will transfer ₹2,000 OUT of my account. It is a fraud.',
          kn: 'ಇಲ್ಲ! ಪಿನ್ ಹಾಕಿದರೆ ನನ್ನ ಖಾತೆಯಿಂದಲೇ ₹2000 ಕಡಿತವಾಗುತ್ತದೆ. ಇದು ವಂಚನೆ.',
          hi: 'नहीं! पिन डालते ही मेरे खाते से ₹2,000 कट जाएंगे। यह धोखाधड़ी है।',
        },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Spot on! Entering a PIN is only for authorizing payments, NEVER for receiving money.',
        kn: 'ಖಚಿತವಾಗಿ ಸರಿ! ಪಿನ್ ಹಾಕುವುದು ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ, ಹಣ ಸ್ವೀಕರಿಸಲು ಎಂದಿಗೂ ಅಲ್ಲ.',
        hi: 'एकदम सही! पिन सिर्फ पैसे भेजने के लिए होता है, पाने के लिए कभी नहीं।',
      },
    },
  },
  {
    id: 'lesson-3',
    title: {
      en: '3. What to Do in the Golden 2 Hours',
      kn: '೩. ವಂಚನೆಯಾದಾಗ ಮೊದಲ 2 ಗಂಟೆಗಳಲ್ಲಿ ಏನು ಮಾಡಬೇಕು?',
      hi: '३. धोखा होने पर पहले 2 घंटों में क्या करें?',
    },
    category: {
      en: 'Emergency Response',
      kn: 'ತುರ್ತು ಕ್ರಮ',
      hi: 'आपातकालीन कदम',
    },
    readTime: '2 min',
    summary: {
      en: 'If money was fraudulently debited, quick action on 1930 can freeze the scammer bank account.',
      kn: 'ಮೋಸದಿಂದ ಹಣ ಕಡಿತಗೊಂಡರೆ, ಕೂಡಲೇ 1930 ಗೆ ಕರೆ ಮಾಡಿದರೆ ವಂಚಕರ ಖಾತೆಯನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಬಹುದು.',
      hi: 'धोखे से पैसे कटने पर 1930 पर तुरंत कॉल करने से ठग का खाता फ्रीज हो सकता है।',
    },
    keyRules: [
      {
        en: 'Dial 1930 immediately from India — this is the National Financial Cybercrime Helpline.',
        kn: 'ಕೂಡಲೇ 1930 ಗೆ ಕರೆ ಮಾಡಿ — ಇದು ಭಾರತ ಸರ್ಕಾರದ ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಂ ಸಹಾಯವಾಣಿ.',
        hi: 'तुरंत 1930 डायल करें — यह भारत की राष्ट्रीय वित्तीय साइबर हेल्पलाइन है।',
      },
      {
        en: 'Note down: Transaction UTR number, your bank account, date and time, and scammer details.',
        kn: 'ವಹಿವಾಟಿನ ಯುಟಿಆರ್ (UTR) ಸಂಖ್ಯೆ, ಬ್ಯಾಂಕ್ ಖಾತೆ, ದಿನಾಂಕ, ಸಮಯ ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳಿ.',
        hi: 'लेनदेन का यूटीआर (UTR) नंबर, बैंक खाता, तारीख और समय लिखकर रखें।',
      },
      {
        en: 'Call your bank branch emergency helpline to immediately block online net banking and debit cards.',
        kn: 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿ ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಹಾಗೂ ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ಸ್ಥಗಿತಗೊಳಿಸಿ.',
        hi: 'अपने बैंक के हेल्पलाइन पर कॉल करके डेबिट कार्ड और ऑनलाइन बैंकिंग तुरंत ब्लॉक करवाएं।',
      },
    ],
    quizQuestion: {
      question: {
        en: 'What is the national helpline number for financial cyber fraud in India?',
        kn: 'ಭಾರತದಲ್ಲಿ ಆರ್ಥಿಕ ಸೈಬರ್ ವಂಚನೆಗಿರುವ ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ ಯಾವುದು?',
        hi: 'भारत में वित्तीय साइबर अपराध के लिए राष्ट्रीय हेल्पलाइन नंबर कौन सा है?',
      },
      options: [
        { en: '100', kn: '100', hi: '100' },
        { en: '1930', kn: '1930', hi: '1930' },
        { en: '108', kn: '108', hi: '108' },
      ],
      correctIndex: 1,
      explanation: {
        en: '1930 is the dedicated Cyber Crime helpline run by the Ministry of Home Affairs, Govt. of India.',
        kn: '1930 ಭಾರತ ಸರ್ಕಾರದ ಗೃಹ ಸಚಿವಾಲಯದ ಅಧಿಕೃತ ಸೈಬರ್ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆಯಾಗಿದೆ.',
        hi: '1930 भारत सरकार के गृह मंत्रालय द्वारा संचालित आधिकारिक साइबर हेल्पलाइन है।',
      },
    },
  },
];
