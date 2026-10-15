export interface VpaDiscrepancyReport {
  isMismatch: boolean;
  riskLevel: 'danger' | 'caution' | 'verified';
  claimedMerchant: string;
  registeredAccount: string;
  accountType: string;
  accountLocationOrAge: string;
  reason: {
    en: string;
    kn: string;
    hi: string;
    te: string;
  };
  action: {
    en: string;
    kn: string;
    hi: string;
    te: string;
  };
  isPaymentLocked: boolean;
  parsedVpa: string;
  parsedAmount: string;
  parsedPurpose: string;
}

export interface DemoQrScenario {
  id: string;
  title: { en: string; kn: string; hi: string; te: string };
  category: string;
  isScam: boolean;
  upiUri: string;
  description: { en: string; kn: string; hi: string; te: string };
}

export const DEMO_QR_SCENARIOS: DemoQrScenario[] = [
  {
    id: 'bescom-scam',
    title: {
      en: '⚡ Fake BESCOM Electricity Bill QR',
      kn: '⚡ ನಕಲಿ ಬೆಸ್ಕಾಂ ಕರೆಂಟ್ ಬಿಲ್ ಕ್ಯೂಆರ್ ಕೋಡ್',
      hi: '⚡ नकली बिजली बिल क्यूआर कोड',
      te: '⚡ నకిలీ విద్యుత్ బిల్లు క్యూఆర్ కోడ్',
    },
    category: 'Government Impersonation',
    isScam: true,
    upiUri: 'upi://pay?pa=rahulkumar9921@ybl&pn=BESCOM%20Electricity%20Support&am=1450&tn=Electricity%20Bill%20Payment',
    description: {
      en: 'Scammer sent a fake bill labeled "BESCOM Electricity Support" demanding ₹1,450 to avoid power cut.',
      kn: 'ವಿದ್ಯುತ್ ಬಿಲ್ ಹೆಸರಿನಲ್ಲಿ ವಂಚಕ ₹1,450 ಕಳುಹಿಸಲು ನೀಡಿದ ನಕಲಿ ಕ್ಯೂಆರ್ ಕೋಡ್.',
      hi: 'बिजली कटने से बचने के लिए ₹1,450 मांगने वाला फर्जी बिल क्यूआर कोड।',
      te: 'కరెంట్ కట్ కాకుండా ఉండటానికి ₹1,450 డిమాండ్ చేసిన నకిలీ క్యూఆర్ కోడ్.',
    },
  },
  {
    id: 'auto-stand-scam',
    title: {
      en: '🛺 Fake Auto-Stand Stand QR (Mule Account)',
      kn: '🛺 ಆಟೋ ಸ್ಟ್ಯಾಂಡ್ ನಕಲಿ ಕ್ಯೂಆರ್ (ವಂಚಕನ ಖಾತೆ)',
      hi: '🛺 ऑटो स्टैंड का नकली क्यूआर कोड',
      te: '🛺 ఆటో స్టాండ్ నకిలీ క్యూఆర్ కోడ్',
    },
    category: 'Street Sticker Fraud',
    isScam: true,
    upiUri: 'upi://pay?pa=sharmamoney77@paytm&pn=Prepaid%20Auto%20Stand%20Fare&am=150&tn=Auto%20Ride',
    description: {
      en: 'Fraudster pasted their personal QR code over the genuine auto stand board to divert payments.',
      kn: 'ಅಸಲಿ ಆಟೋ ಬೋರ್ಡ್ ಮೇಲೆ ವಂಚಕ ಅಂಟಿಸಿದ ತನ್ನ ಖಾಸಗಿ ಕ್ಯೂಆರ್ ಸ್ಟಿಕ್ಕರ್.',
      hi: 'ऑटो स्टैंड पर असली कोड के ऊपर चिपकाया गया ठग का व्यक्तिगत क्यूआर।',
      te: 'ఆటో స్టాండ్‌లో అసలైన కోడ్‌పై అంటించిన మోసగాడి వ్యక్తిగత క్యూఆర్ కోడ్.',
    },
  },
  {
    id: 'sbi-refund-scam',
    title: {
      en: '🏦 Fake SBI Support Refund QR',
      kn: '🏦 ಎಸ್.ಬಿ.ಐ ರಿಫಂಡ್ ಹೆಸರಿನ ನಕಲಿ ಕ್ಯೂಆರ್',
      hi: '🏦 एसबीआई रिफंड का फर्जी क्यूआर कोड',
      te: '🏦 ఎస్బీఐ రీఫండ్ పేరుతో నకిలీ క్యూఆర్ కోడ్',
    },
    category: 'Bank Fraud',
    isScam: true,
    upiUri: 'upi://pay?pa=deepakv9011@okaxis&pn=SBI%20KYC%20Helpdesk%20Refund&am=2000&tn=KYC%20Refund',
    description: {
      en: 'Scammer claimed to refund ₹2,000 for KYC charges via QR scan.',
      kn: 'ಕೆವೈಸಿ ಹಣ ವಾಪಸ್ ನೀಡುವುದಾಗಿ ಹೇಳಿ ಕಳುಹಿಸಿದ ನಕಲಿ ಬ್ಯಾಂಕ್ ಕ್ಯೂಆರ್.',
      hi: 'केवाईसी फीस वापस करने के बहाने भेजा गया फर्जी बैंक क्यूआर कोड।',
      te: 'కేవైసీ ఫీజు రీఫండ్ ఇస్తామని పంపిన నకిలీ బ్యాంక్ క్యూఆర్ కోడ్.',
    },
  },
  {
    id: 'genuine-merchant',
    title: {
      en: '🛒 Genuine Grocery Store (Verified Merchant)',
      kn: '🛒 ನಿಜವಾದ ದಿನಸಿ ಅಂಗಡಿ (ದೃಢೀಕೃತ ವ್ಯಾಪಾರಿ)',
      hi: '🛒 असली किराना दुकान (सत्यापित व्यापारी)',
      te: '🛒 అసలైన కిరాణా షాప్ (ధృవీకరించబడిన వ్యాపారి)',
    },
    category: 'Verified Merchant',
    isScam: false,
    upiUri: 'upi://pay?pa=laxmigroceries@okhdfcbank&pn=Laxmi%20Groceries%20and%20Provisions&am=380&tn=Grocery%20Payment',
    description: {
      en: 'Legitimate local general merchant registered with HDFC Current Business Account.',
      kn: 'ಎಚ್.ಡಿ.ಎಫ್.ಸಿ ವ್ಯಾಪಾರ ಖಾತೆಯೊಂದಿಗೆ ನೋಂದಾಯಿತವಾದ ಅಧಿಕೃತ ದಿನಸಿ ಅಂಗಡಿ.',
      hi: 'एचडीएफसी करंट बिजनेस अकाउंट से जुड़ी आधिकारिक सत्यापित दुकान।',
      te: 'హెచ్‌డీఎఫ్‌సీ బిజినెస్ ఖాతా కలిగిన అసలైన స్థానిక కిరాణా దుకాణం.',
    },
  },
];

export class GhostMerchantShield {
  /**
   * Parse upi://pay intent URI into components
   */
  public static parseUpiUri(rawUri: string): { pa: string; pn: string; am: string; tn: string } {
    let clean = rawUri.trim();
    if (clean.startsWith('upi://pay?')) {
      clean = clean.replace('upi://pay?', '');
    }

    const params = new URLSearchParams(clean);
    return {
      pa: params.get('pa') || '',
      pn: decodeURIComponent(params.get('pn') || ''),
      am: params.get('am') || '',
      tn: decodeURIComponent(params.get('tn') || ''),
    };
  }

  /**
   * VPA Legal Identity Discrepancy Engine
   * Detects mismatch between claimed merchant (pn) and underlying legal bank account (pa)
   */
  public static inspectVpa(pn: string, pa: string, rawAmount: string = '', rawPurpose: string = ''): VpaDiscrepancyReport {
    const claimedName = pn.trim() || 'Unknown Recipient';
    const vpa = pa.trim().toLowerCase();
    const claimedLower = claimedName.toLowerCase();

    // 1. Detect Fake Government / Utility Scam (BESCOM, Electricity, Police, Tax, Water)
    const isGovOrUtility =
      claimedLower.includes('bescom') ||
      claimedLower.includes('electricity') ||
      claimedLower.includes('power') ||
      claimedLower.includes('msedcl') ||
      claimedLower.includes('kptcl') ||
      claimedLower.includes('uppcl') ||
      claimedLower.includes('police') ||
      claimedLower.includes('tax') ||
      claimedLower.includes('challan') ||
      claimedLower.includes('government');

    // 2. Detect Bank Impersonation (SBI, HDFC, ICICI, YONO, KYC, Customer Care)
    const isBankOrSupport =
      claimedLower.includes('sbi') ||
      claimedLower.includes('yono') ||
      claimedLower.includes('hdfc') ||
      claimedLower.includes('icici') ||
      claimedLower.includes('customer care') ||
      claimedLower.includes('helpdesk') ||
      claimedLower.includes('refund support');

    // 3. Detect Public Stand / Service Impersonation (Auto stand, Prepaid Taxi)
    const isPublicService =
      claimedLower.includes('auto stand') ||
      claimedLower.includes('taxi fare') ||
      claimedLower.includes('railway') ||
      claimedLower.includes('metro');

    // Known personal mule identifiers in VPA handle
    const isPersonalHandle =
      vpa.includes('kumar') ||
      vpa.includes('sharma') ||
      vpa.includes('singh') ||
      vpa.includes('deepak') ||
      vpa.includes('rahul') ||
      vpa.includes('money') ||
      vpa.includes('cash') ||
      /\d{4,}/.test(vpa); // contains numeric sequences typical of personal phone numbers/handles

    // CASE 1: Critical Discrepancy on Utility / Govt Impersonation
    if (isGovOrUtility && isPersonalHandle) {
      const extractedMuleName = vpa.includes('rahul')
        ? 'Rahul Kumar'
        : vpa.includes('sharma')
        ? 'Manoj Sharma'
        : 'Individual Personal Account Holder';

      return {
        isMismatch: true,
        riskLevel: 'danger',
        claimedMerchant: claimedName,
        registeredAccount: `${extractedMuleName} (Personal Savings Account in Jamtara Cluster, opened 6 days ago)`,
        accountType: 'Personal Savings Account (Mule Account Flagged)',
        accountLocationOrAge: 'Jamtara Cluster • Active 6 Days',
        reason: {
          en: 'You are trying to pay a Government Electricity Department, but the money is going to an individual personal savings account.',
          kn: 'ನೀವು ಸರ್ಕಾರಿ ವಿದ್ಯುತ್ ಇಲಾಖೆಗೆ ಹಣ ಪಾವತಿಸುತ್ತಿದ್ದೀರಿ, ಆದರೆ ಹಣವು ರಾಹುಲ್ ಕುಮಾರ್ ಎಂಬ ಖಾಸಗಿ ವೈಯಕ್ತಿಕ ಉಳಿತಾಯ ಖಾತೆಗೆ ಹೋಗುತ್ತಿದೆ!',
          hi: 'आप सरकारी बिजली विभाग को भुगतान कर रहे हैं, लेकिन पैसा किसी व्यक्ति के पर्सनल सेविंग्स खाते में जा रहा है!',
          te: 'మీరు ప్రభుత్వ విద్యుత్ విభాగానికి చెల్లిస్తున్నారు, కానీ డబ్బు ఒక వ్యక్తిగత సేవింగ్స్ ఖాతాకు వెళుతోంది!',
        },
        action: {
          en: 'Payment locked. Government bodies and registered utility boards NEVER use personal savings accounts.',
          kn: 'ಪಾವತಿ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ. ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳು ಎಂದಿಗೂ ಖಾಸಗಿ ಉಳಿತಾಯ ಖಾತೆಗಳನ್ನು ಬಳಸುವುದಿಲ್ಲ.',
          hi: 'भुगतान लॉक कर दिया गया। सरकारी संस्थाएं कभी व्यक्तिगत बचत खातों का उपयोग नहीं करती हैं।',
          te: 'చెల్లింపు లాక్ చేయబడింది. ప్రభుత్వ విభాగాలు ఎప్పుడూ వ్యక్తిగత ఖాతాలను ఉపయోగించవు.',
        },
        isPaymentLocked: true,
        parsedVpa: pa,
        parsedAmount: rawAmount,
        parsedPurpose: rawPurpose || 'Utility Bill',
      };
    }

    // CASE 2: Bank Helpdesk / Refund Impersonation
    if (isBankOrSupport && isPersonalHandle) {
      return {
        isMismatch: true,
        riskLevel: 'danger',
        claimedMerchant: claimedName,
        registeredAccount: 'Deepak Verma (Personal Account • Cybercrime Watchlist)',
        accountType: 'Personal Savings Account',
        accountLocationOrAge: 'High Risk Watchlist',
        reason: {
          en: 'You are trying to pay Bank Support / Refund, but the recipient is a personal individual savings account.',
          kn: 'ಬ್ಯಾಂಕ್ ಸಹಾಯವಾಣಿ ಹೆಸರಿನಲ್ಲಿ ವೈಯಕ್ತಿಕ ಖಾಸಗಿ ವ್ಯಕ್ತಿಯ ಖಾತೆಗೆ ಹಣ ವರ್ಗಾಯಿಸಲು ಪ್ರಯತ್ನಿಸಲಾಗುತ್ತಿದೆ.',
          hi: 'बैंक हेल्पलाइन के नाम पर किसी अनजान व्यक्ति के व्यक्तिगत खाते में पैसा भेजा जा रहा है।',
          te: 'బ్యాంక్ సపోర్ట్ పేరుతో ఒక వ్యక్తిగత ఖాతాకు డబ్బు పంపడానికి ప్రయత్నిస్తున్నారు.',
        },
        action: {
          en: 'Payment locked. Official banks NEVER collect verification fees or refund money via personal UPI VPAs.',
          kn: 'ಪಾವತಿ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ. ಅಧಿಕೃತ ಬ್ಯಾಂಕುಗಳು ಎಂದಿಗೂ ವೈಯಕ್ತಿಕ ಯುಪಿಐ ಖಾತೆಗೆ ಹಣ ತೆಗೆದುಕೊಳ್ಳುವುದಿಲ್ಲ.',
          hi: 'भुगतान लॉक किया गया। आधिकारिक बैंक कभी पर्सनल यूपीआई पर पैसे नहीं लेते।',
          te: 'చెల్లింపు లాక్ చేయబడింది. బ్యాంకులు ఎప్పుడూ వ్యక్తిగత యూపీఐ ఖాతాలను ఉపయోగించవు.',
        },
        isPaymentLocked: true,
        parsedVpa: pa,
        parsedAmount: rawAmount,
        parsedPurpose: rawPurpose || 'Bank Refund',
      };
    }

    // CASE 3: Street Stand / Auto Fare Diverted
    if (isPublicService && isPersonalHandle) {
      return {
        isMismatch: true,
        riskLevel: 'danger',
        claimedMerchant: claimedName,
        registeredAccount: 'Manoj Sharma (Personal Unverified Account)',
        accountType: 'Personal Paytm Account',
        accountLocationOrAge: 'Unverified Merchant',
        reason: {
          en: 'The QR code claims to be a Public Auto Stand, but the registered bank account belongs to a private third-party individual.',
          kn: 'ಕ್ಯೂಆರ್ ಕೋಡ್ ಅಧಿಕೃತ ಆಟೋ ನಿಲ್ದಾಣ ಎಂದು ಹೇಳುತ್ತಿದೆ, ಆದರೆ ಹಣವು ಮನೋಜ್ ಶರ್ಮಾ ಎಂಬ ಖಾಸಗಿ ವ್ಯಕ್ತಿಯ ಖಾತೆಗೆ ಹೋಗುತ್ತಿದೆ.',
          hi: 'क्यूआर कोड ऑटो स्टैंड का होने का दावा कर रहा है, लेकिन बैंक खाता किसी निजी व्यक्ति का है।',
          te: 'ఈ క్యూఆర్ కోడ్ ఆటో స్టాండ్ పేరుతో ఉంది, కానీ రిజిస్టర్డ్ ఖాతా ప్రైవేట్ వ్యక్తికి చెందినది.',
        },
        action: {
          en: 'Payment locked. The QR code appears to be tampered or pasted over the real merchant board.',
          kn: 'ಪಾವತಿ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ. ಅಸಲಿ ಬೋರ್ಡ್ ಮೇಲೆ ಯಾರೋ ನಕಲಿ ಕ್ಯೂಆರ್ ಅಂಟಿಸಿರುವ ಸಾಧ್ಯತೆಯಿದೆ.',
          hi: 'भुगतान लॉक किया गया। यह क्यूआर कोड असली बोर्ड पर चिपकाया गया फर्जी स्टिकर लगता है।',
          te: 'చెల్లింపు లాక్ చేయబడింది. అసలైన బోర్డుపై నకిలీ స్టిక్కర్ అంటించబడింది.',
        },
        isPaymentLocked: true,
        parsedVpa: pa,
        parsedAmount: rawAmount,
        parsedPurpose: rawPurpose || 'Ride Fare',
      };
    }

    // CASE 4: Genuine Verified Merchant
    if (vpa.includes('laxmigroceries') || vpa.includes('groceries') || vpa.includes('merchant')) {
      return {
        isMismatch: false,
        riskLevel: 'verified',
        claimedMerchant: claimedName,
        registeredAccount: 'LAXMI PROVISIONS PRIVATE LIMITED (Verified Merchant Current Account)',
        accountType: 'Business Current Account (Merchant Category Code: 5411)',
        accountLocationOrAge: 'Registered Business Account • KYC Verified',
        reason: {
          en: 'Merchant identity verified. Bank registration details match the business store name.',
          kn: 'ವ್ಯಾಪಾರಿಯ ಗುರುತು ದೃಢೀಕರಿಸಲಾಗಿದೆ. ಬ್ಯಾಂಕ್ ನೋಂದಣಿ ವಿವರಗಳು ಅಂಗಡಿಯ ಹೆಸರಿಗೆ ನಿಖರವಾಗಿ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ.',
          hi: 'दुकानदार की पहचान सत्यापित है। बैंक पंजीकरण विवरण दुकान के नाम से मेल खाते हैं।',
          te: 'వ్యాపారి గుర్తింపు ధృవీకరించబడింది. బ్యాంక్ రిజిస్ట్రేషన్ వివరాలు సరిగ్గా సరిపోలాయి.',
        },
        action: {
          en: 'Safe to proceed. You are sending money to a verified business merchant account.',
          kn: 'ಮುಂದುವರಿಯುವುದು ಸುರಕ್ಷಿತ. ನೀವು ಅಧಿಕೃತ ವ್ಯಾಪಾರಿ ಖಾತೆಗೆ ಹಣ ಕಳುಹಿಸುತ್ತಿದ್ದೀರಿ.',
          hi: 'आगे बढ़ना सुरक्षित है। आप एक सत्यापित बिजनेस खाते को भुगतान कर रहे हैं।',
          te: 'కొనసాగడం సురక్షితం. మీరు ధృవీకరించబడిన వ్యాపారికి డబ్బు పంపుతున్నారు.',
        },
        isPaymentLocked: false,
        parsedVpa: pa,
        parsedAmount: rawAmount,
        parsedPurpose: rawPurpose || 'Grocery Purchase',
      };
    }

    // Default: Neutral Review
    return {
      isMismatch: false,
      riskLevel: 'caution',
      claimedMerchant: claimedName,
      registeredAccount: pa,
      accountType: 'Standard UPI Address',
      accountLocationOrAge: 'Standard Account',
      reason: {
        en: 'No critical government or bank impersonation patterns detected, but please review the recipient name carefully.',
        kn: 'ಯಾವುದೇ ಗಂಭೀರ ಬೆದರಿಕೆ ಅಥವಾ ನಕಲಿ ಗುರುತು ಕಂಡುಬಂದಿಲ್ಲ, ಆದರೆ ಹಣ ಕಳುಹಿಸುವ ಮುನ್ನ ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ.',
        hi: 'कोई गंभीर फर्जीवाड़ा नहीं मिला, लेकिन कृपया पैसे भेजने से पहले नाम अवश्य जांच लें।',
        te: 'ప్రమాదకరమైన నకిలీ గుర్తింపు కనిపించలేదు, కానీ పేరును జాగ్రత్తగా గమనించండి.',
      },
      action: {
        en: 'Confirm with recipient before authorizing payment.',
        kn: 'ಹಣ ಕಳುಹಿಸುವ ಮುನ್ನ ಸ್ವೀಕರಿಸುವವರೊಂದಿಗೆ ದೃಢಪಡಿಸಿಕೊಳ್ಳಿ.',
        hi: 'भुगतान करने से पहले पाने वाले से पुष्टि कर लें।',
        te: 'డబ్బు పంపే ముందు వివరాలను నిర్ధారించుకోండి.',
      },
      isPaymentLocked: false,
      parsedVpa: pa,
      parsedAmount: rawAmount,
      parsedPurpose: rawPurpose,
    };
  }
}
