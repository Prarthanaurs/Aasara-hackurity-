/**
 * js/assistant.js — Aasara AI Assistant
 * ---------------------------------------
 * A lightweight, offline-first Q&A assistant.
 * Uses keyword matching against a curated knowledge base to answer
 * questions about digital payments, safety, and the Aasara features.
 * Supports all four app languages (en / kn / hi / te).
 *
 * Public API (called from home.html):
 *   injectAssistant()  — builds and mounts the chat widget
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Knowledge base — each entry has keyword patterns and a response per language
  // ---------------------------------------------------------------------------

  const KB = [
    {
      keywords: ['payment', 'send money', 'pay', 'transfer', 'upi', 'money',
                 'ಪಾವತಿ', 'ಹಣ', 'हिंदी', 'पैसे', 'भुगतान', 'పేమెంట్', 'డబ్బు'],
      en: "To make a payment, tap the 💳 Guided Payment card. I'll walk you through choosing who to pay, entering the amount, and reviewing before you confirm.",
      kn: "ಪಾವತಿ ಮಾಡಲು 💳 ಮಾರ್ಗದರ್ಶಿ ಪಾವತಿ ಕಾರ್ಡ್ ಅನ್ನು ಒತ್ತಿ. ಯಾರಿಗೆ ಹಣ ಕಳುಹಿಸಬೇಕು, ಎಷ್ಟು ಕಳುಹಿಸಬೇಕು ಎಂಬುದನ್ನು ಹಂತ ಹಂತವಾಗಿ ತೋರಿಸುತ್ತೇನೆ.",
      hi: "भुगतान करने के लिए 💳 Guided Payment कार्ड पर टैप करें। मैं आपको प्राप्तकर्ता चुनने, राशि दर्ज करने और पुष्टि करने में मदद करूँगा।",
      te: "చెల్లింపు చేయడానికి 💳 Guided Payment కార్డ్ నొక్కండి. ఎవరికి పంపాలి, ఎంత పంపాలి అని దశల వారీగా చూపిస్తాను.",
    },
    {
      keywords: ['scam', 'fraud', 'fake', 'cheat', 'safe', 'safety', 'protect', 'otp', 'pin',
                 'ವಂಚನೆ', 'ಸುರಕ್ಷತೆ', 'धोखा', 'सुरक्षा', 'మోసం', 'భద్రత'],
      en: "For safety tips, open the 🛡️ Digital Safety section. Key rules: never share your UPI PIN or OTP with anyone, and beware of fake payment screenshots.",
      kn: "ಸುರಕ್ಷತಾ ಸಲಹೆಗಳಿಗಾಗಿ 🛡️ ಡಿಜಿಟಲ್ ಸುರಕ್ಷತೆ ವಿಭಾಗ ತೆರೆಯಿರಿ. ನಿಮ್ಮ UPI PIN ಅಥವಾ OTP ಯಾರಿಗೂ ಹೇಳಬೇಡಿ.",
      hi: "सुरक्षा टिप्स के लिए 🛡️ Digital Safety खोलें। अपना UPI PIN या OTP किसी को न बताएं।",
      te: "భద్రతా చిట్కాల కోసం 🛡️ Digital Safety తెరవండి. మీ UPI PIN లేదా OTP ఎవరికీ చెప్పకండి.",
    },
    {
      keywords: ['lesson', 'learn', 'awareness', 'quiz', 'teach', 'what is upi', 'education',
                 'ಪಾಠ', 'ಅರಿವು', 'पाठ', 'सीखें', 'పాఠం', 'నేర్చుకోండి'],
      en: "Open 📚 Awareness Lessons to learn how UPI works, how to check a payment, and how to spot scams — all with a short quiz at the end.",
      kn: "UPI ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಎಂದು ತಿಳಿಯಲು 📚 ಅರಿವಿನ ಪಾಠಗಳನ್ನು ತೆರೆಯಿರಿ. ಕ್ವಿಜ್ ಕೂಡ ಇದೆ!",
      hi: "📚 Awareness Lessons खोलें और जानें कि UPI कैसे काम करता है, भुगतान कैसे जांचें, और धोखे को कैसे पहचानें।",
      te: "UPI ఎలా పని చేస్తుందో నేర్చుకోవడానికి 📚 Awareness Lessons తెరవండి. చివర్లో quiz కూడా ఉంది!",
    },
    {
      keywords: ['volunteer', 'help', 'helper', 'near me', 'assist', 'human',
                 'ಸ್ವಯಂಸೇವಕ', 'ಸಹಾಯ', 'मदद', 'स्वयंसेवक', 'సహాయం', 'వాలంటీర్'],
      en: "Need a person to help you? Tap 🤝 Volunteer Help to connect with a trained volunteer in your area who can guide you face-to-face.",
      kn: "ಸಹಾಯ ಬೇಕೇ? 🤝 ಸ್ವಯಂಸೇವಕ ಸಹಾಯ ಒತ್ತಿ. ನಿಮ್ಮ ಪ್ರದೇಶದ ತರಬೇತಿ ಪಡೆದ ಸಹಾಯಕರು ಸಂಪರ್ಕ ಮಾಡುತ್ತಾರೆ.",
      hi: "किसी व्यक्ति की मदद चाहिए? 🤝 Volunteer Help पर टैप करें। आपके क्षेत्र का एक प्रशिक्षित स्वयंसेवक आपकी मदद करेगा।",
      te: "సహాయం కావాలా? 🤝 Volunteer Help నొక్కండి. మీ ప్రాంతంలోని శిక్షణ పొందిన సహాయకుడు మీకు గైడ్ చేస్తారు.",
    },
    {
      keywords: ['balance', 'check balance', 'bank', 'account', 'services', 'enquiry',
                 'ಬ್ಯಾಲೆನ್ಸ್', 'ಖಾತೆ', 'बैलेंस', 'खाता', 'బ్యాలెన్స్', 'ఖాతా'],
      en: "To check your bank balance, go to 🏦 Essential Services. You can also dial *99# on any phone (no internet needed) for balance enquiry.",
      kn: "ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಯಲು 🏦 ಅಗತ್ಯ ಸೇವೆಗಳಿಗೆ ಹೋಗಿ. ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ *99# ಡಯಲ್ ಮಾಡಿ ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಯಬಹುದು.",
      hi: "बैंक बैलेंस जांचने के लिए 🏦 Essential Services खोलें। बिना इंटरनेट के *99# डायल करके भी बैलेंस पता कर सकते हैं।",
      te: "బ్యాంక్ బ్యాలెన్స్ చెక్ చేయడానికి 🏦 Essential Services తెరవండి. ఇంటర్నెట్ లేకుండా *99# డయల్ చేయడం ద్వారా బ్యాలెన్స్ తెలుసుకోవచ్చు.",
    },
    {
      keywords: ['language', 'change language', 'kannada', 'hindi', 'telugu', 'english',
                 'ಭಾಷೆ', 'भाषा', 'భాష'],
      en: "You chose your language on the first screen. To change it, go back to the start screen (reload the page) and pick a new language.",
      kn: "ನೀವು ಮೊದಲ ಪರದೆಯಲ್ಲಿ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ. ಬದಲಾಯಿಸಲು ಪುಟ ಮರು ಲೋಡ್ ಮಾಡಿ.",
      hi: "आपने पहली स्क्रीन पर भाषा चुनी थी। बदलने के लिए पेज को रीलोड करें।",
      te: "మీరు మొదటి స్క్రీన్‌లో భాష ఎంచుకున్నారు. మార్చడానికి పేజీని రీలోడ్ చేయండి.",
    },
    {
      keywords: ['hello', 'hi', 'help', 'start', 'what can you do', 'who are you',
                 'ಹಲೋ', 'ಸಹಾಯ', 'नमस्ते', 'मदद', 'హలో', 'సహాయం'],
      en: "Hello! I'm your Aasara assistant 👋. Ask me about:\n• Making a payment\n• Staying safe from scams\n• Learning about UPI\n• Finding a volunteer\n• Checking your balance",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಆಸರೆ ಸಹಾಯಕ 👋. ಕೇಳಿ:\n• ಪಾವತಿ ಮಾಡುವುದು\n• ವಂಚನೆಯಿಂದ ರಕ್ಷಿಸಿಕೊಳ್ಳುವುದು\n• UPI ಕಲಿಯುವುದು\n• ಸ್ವಯಂಸೇವಕ ಹುಡುಕುವುದು\n• ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಯುವುದು",
      hi: "नमस्ते! मैं आपका Aasara सहायक हूँ 👋। पूछें:\n• पैसे भेजना\n• धोखे से बचाव\n• UPI सीखना\n• स्वयंसेवक खोजना\n• बैलेंस चेक करना",
      te: "నమస్కారం! నేను మీ Aasara సహాయకుడిని 👋. అడగండి:\n• చెల్లింపు చేయడం\n• మోసాల నుండి రక్షణ\n• UPI నేర్చుకోవడం\n• వాలంటీర్ కనుగొనడం\n• బ్యాలెన్స్ తెలుసుకోవడం",
    },
    {
      keywords: ['report', 'cybercrime', 'complaint', 'fraud number', 'helpline',
                 'ದೂರು', 'शिकायत', 'ఫిర్యాదు'],
      en: "To report cybercrime, call the national helpline 1930 or visit cybercrime.gov.in. Block the sender and inform your bank immediately.",
      kn: "ಸೈಬರ್ ಅಪರಾಧ ದೂರು ನೀಡಲು 1930 ಕರೆ ಮಾಡಿ ಅಥವಾ cybercrime.gov.in ಗೆ ಭೇಟಿ ಕೊಡಿ. ನಿಮ್ಮ ಬ್ಯಾಂಕಿಗೆ ತಕ್ಷಣ ತಿಳಿಸಿ.",
      hi: "साइबर अपराध की शिकायत के लिए 1930 पर कॉल करें या cybercrime.gov.in पर जाएं। अपने बैंक को तुरंत सूचित करें।",
      te: "సైబర్ క్రైమ్ ఫిర్యాదు కోసం 1930 కి కాల్ చేయండి లేదా cybercrime.gov.in సందర్శించండి. మీ బ్యాంక్‌కి వెంటనే తెలియజేయండి.",
    },
  ];

  // Fallback when no keyword matches
  const FALLBACK = {
    en: "I'm sorry, I didn't quite understand that. Try asking about payments, safety tips, balance check, lessons, or finding a volunteer.",
    kn: "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಪಾವತಿ, ಸುರಕ್ಷತೆ, ಬ್ಯಾಲೆನ್ಸ್, ಪಾಠಗಳು ಅಥವಾ ಸ್ವಯಂಸೇವಕರ ಬಗ್ಗೆ ಕೇಳಿ.",
    hi: "माफ़ करें, मुझे समझ नहीं आया। भुगतान, सुरक्षा, बैलेंस, पाठ या स्वयंसेवक के बारे में पूछें।",
    te: "క్షమించండి, నాకు అర్థం కాలేదు. చెల్లింపు, భద్రత, బ్యాలెన్స్, పాఠాలు లేదా వాలంటీర్ గురించి అడగండి.",
  };

  // ---------------------------------------------------------------------------
  // Core matching
  // ---------------------------------------------------------------------------

  function getAnswer(query) {
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'en';
    const q = query.toLowerCase();

    for (const entry of KB) {
      if (entry.keywords.some(kw => q.includes(kw.toLowerCase()))) {
        return { text: entry[lang] || entry.en, lang };
      }
    }
    return { text: FALLBACK[lang] || FALLBACK.en, lang };
  }

  // ---------------------------------------------------------------------------
  // DOM helpers
  // ---------------------------------------------------------------------------

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k.startsWith('data-')) node.setAttribute(k, v);
      else node[k] = v;
    });
    children.forEach(c => node.appendChild(
      typeof c === 'string' ? document.createTextNode(c) : c
    ));
    return node;
  }

  // ---------------------------------------------------------------------------
  // Build widget
  // ---------------------------------------------------------------------------

  function buildWidget() {
    // ── Bubble toggle button ──────────────────────────────────────────────
    const toggleBtn = el('button', {
      class: 'ai-toggle-btn',
      id: 'ai-toggle-btn',
      'aria-label': 'Open AI assistant',
      title: 'Ask Aasara Assistant',
    }, '🤖');

    // ── Chat panel ────────────────────────────────────────────────────────
    const panel = el('div', {
      class: 'ai-panel',
      id: 'ai-panel',
      role: 'dialog',
      'aria-label': 'Aasara AI Assistant',
      'aria-modal': 'false',
    });

    // Header
    const header = el('div', { class: 'ai-header' });
    const title  = el('span', { class: 'ai-title' }, '🤖 Aasara Assistant');
    const closeBtn = el('button', {
      class: 'ai-close-btn',
      'aria-label': 'Close assistant',
    }, '✕');
    header.append(title, closeBtn);

    // Messages area
    const msgs = el('div', { class: 'ai-messages', id: 'ai-messages', 'aria-live': 'polite' });

    // Input row
    const inputRow = el('div', { class: 'ai-input-row' });
    const input = el('input', {
      type: 'text',
      class: 'ai-input',
      id: 'ai-input',
      placeholder: 'Ask me anything…',
      'aria-label': 'Your question',
      autocomplete: 'off',
    });
    const sendBtn = el('button', {
      class: 'ai-send-btn btn-primary',
      'aria-label': 'Send',
    }, '➤');
    inputRow.append(input, sendBtn);

    panel.append(header, msgs, inputRow);

    // Wrapper
    const wrapper = el('div', { class: 'ai-widget', id: 'ai-widget' });
    wrapper.append(panel, toggleBtn);
    document.body.appendChild(wrapper);

    return { toggleBtn, panel, msgs, input, sendBtn, closeBtn };
  }

  // ---------------------------------------------------------------------------
  // Message rendering
  // ---------------------------------------------------------------------------

  function appendMessage(msgs, text, role) {
    const bubble = el('div', { class: 'ai-bubble ai-' + role });
    // Support newlines from KB responses
    text.split('\n').forEach((line, i) => {
      if (i > 0) bubble.appendChild(el('br', {}));
      bubble.appendChild(document.createTextNode(line));
    });
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ---------------------------------------------------------------------------
  // Suggested quick questions (localised labels)
  // ---------------------------------------------------------------------------

  const SUGGESTIONS = {
    en: ['How do I pay?', 'Safety tips', 'Check balance', 'Find a volunteer'],
    kn: ['ಹಣ ಹೇಗೆ ಕಳುಹಿಸುವುದು?', 'ಸುರಕ್ಷತಾ ಸಲಹೆ', 'ಬ್ಯಾಲೆನ್ಸ್ ತಿಳಿಯಿರಿ', 'ಸ್ವಯಂಸೇವಕ ಹುಡುಕಿ'],
    hi: ['पैसे कैसे भेजें?', 'सुरक्षा सुझाव', 'बैलेंस जांचें', 'स्वयंसेवक खोजें'],
    te: ['డబ్బు ఎలా పంపాలి?', 'భద్రతా చిట్కాలు', 'బ్యాలెన్స్ చెక్', 'వాలంటీర్ కనుగొనండి'],
  };

  function addSuggestions(msgs, input, onSend) {
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'en';
    const chips = el('div', { class: 'ai-chips' });
    (SUGGESTIONS[lang] || SUGGESTIONS.en).forEach(label => {
      const chip = el('button', { class: 'ai-chip' }, label);
      chip.addEventListener('click', () => {
        input.value = label;
        onSend();
      });
      chips.appendChild(chip);
    });
    msgs.appendChild(chips);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ---------------------------------------------------------------------------
  // Mount the assistant
  // ---------------------------------------------------------------------------

  function injectAssistant() {
    const { toggleBtn, panel, msgs, input, sendBtn, closeBtn } = buildWidget();
    let open = false;

    // Show greeting + suggestions
    function showGreeting() {
      msgs.innerHTML = '';
      const lang = (typeof getLanguage === 'function') ? getLanguage() : 'en';
      const greet = FALLBACK[lang]
        ? getAnswer('hello').text
        : getAnswer('hello').text;
      // Use the hello entry directly
      const helloEntry = KB.find(e => e.keywords.includes('hello'));
      const greetText = helloEntry ? (helloEntry[lang] || helloEntry.en) : '';
      appendMessage(msgs, greetText, 'bot');
      addSuggestions(msgs, input, sendMessage);
    }

    function openPanel() {
      open = true;
      panel.classList.add('open');
      toggleBtn.setAttribute('aria-label', 'Close AI assistant');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (msgs.children.length === 0) showGreeting();
      setTimeout(() => input.focus(), 120);
    }

    function closePanel() {
      open = false;
      panel.classList.remove('open');
      toggleBtn.setAttribute('aria-label', 'Open AI assistant');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }

    function sendMessage() {
      const q = input.value.trim();
      if (!q) return;
      appendMessage(msgs, q, 'user');
      input.value = '';

      // Typing indicator
      const typing = el('div', { class: 'ai-bubble ai-bot ai-typing' }, '…');
      msgs.appendChild(typing);
      msgs.scrollTop = msgs.scrollHeight;

      setTimeout(() => {
        msgs.removeChild(typing);
        const { text } = getAnswer(q);
        appendMessage(msgs, text, 'bot');
        // Speak the response if voice is available
        if (typeof speakRaw === 'function') speakRaw(text);
      }, 400);
    }

    toggleBtn.addEventListener('click', () => open ? closePanel() : openPanel());
    closeBtn.addEventListener('click', closePanel);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) closePanel();
    });
  }

  // Expose globally
  window.injectAssistant = injectAssistant;
})();
