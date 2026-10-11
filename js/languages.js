/**
 * js/languages.js
 * ---------------
 * Owns everything related to language selection and translated text.
 *
 * HOW IT WORKS
 * ------------
 * 1. TRANSLATIONS holds every UI string in all four languages.
 *    Each key (e.g. 'welcome_title') maps to a string in en/kn/hi/te.
 *
 * 2. setLanguage(lang) saves the choice to sessionStorage so it
 *    survives page navigation within the same browser tab.
 *
 * 3. getLanguage() retrieves the saved language (defaults to 'en').
 *
 * 4. t(key) is a shorthand: returns the translated string for the
 *    current language, falling back to English if a key is missing.
 *
 * 5. applyLanguage() walks the DOM looking for elements that have
 *    a data-i18n="key" attribute and updates their textContent.
 *    Call this once on every page after the DOM is ready.
 */

// ---------------------------------------------------------------------------
// Translation dictionary
// ---------------------------------------------------------------------------
// Add new keys here first, then use data-i18n="key" in HTML or t('key') in JS.
// Keep all four languages in sync when adding new keys.

const TRANSLATIONS = {

  en: {
    // --- index.html (welcome / language selection) ---
    welcome_tagline:    'Digital Payment & Safety Assistant for Older Adults',
    choose_language:    'Please choose your language to continue',
    btn_continue:       'Continue →',
    lang_hint:          'You can change the language again at any time.',

    // --- home.html (dashboard) ---
    home_greeting:      'Welcome to Aasara',
    home_subtitle:      'How can we help you today?',
    card_payment:       'Guided Payment',
    card_payment_desc:  'Learn to send money safely step by step',
    card_safety:        'Digital Safety',
    card_safety_desc:   'Protect yourself from scams and fraud',
    card_awareness:     'Awareness Lessons',
    card_awareness_desc:'Short lessons on digital payments',
    card_volunteer:     'Volunteer Help',
    card_volunteer_desc:'Connect with a helper near you',
    card_services:      'Essential Services',
    card_services_desc: 'Balance check and official guides',
    home_voice_welcome: 'Welcome to Aasara. Please choose a feature from the menu to get started.',

    // --- payment.html ---
    payment_title:      'Guided Payment',
    step1_heading:      'Step 1 — Choose Recipient',
    step1_instruction:  'Select who you want to send money to.',
    label_recipient:    'Recipient',
    label_or_enter:     'Or type a name:',
    placeholder_recipient: 'Type recipient name',
    step2_heading:      'Step 2 — Enter Amount',
    step2_instruction:  'How much money do you want to send? (in Rupees)',
    label_amount:       'Amount (₹)',
    placeholder_amount: 'e.g. 500',
    btn_next:           'Next →',
    btn_back:           '← Back',
    btn_confirm:        '✅ Confirm',
    btn_change:         '✏️ Change',
    btn_cancel:         '✖ Cancel',
    btn_home:           'Return to Home',
    step3_heading:      'Step 3 — Review & Confirm',
    step3_instruction:  'Please check the details carefully before confirming.',
    review_sending:     'Sending',
    review_to:          'to',
    review_question:    'Is this correct?',
    result_heading:     'Simulated Payment Complete',
    result_banner:      '⚠️ DEMONSTRATION ONLY — No real money has been transferred',
    result_reminder:    'To make a real payment, use your official UPI app (BHIM, PhonePe, GPay) and verify all details yourself.',
    warn_large_amount:  '⚠️ Large amount alert: Always verify in your official payment app before sending large sums.',
    warn_suspicious:    '⚠️ Caution: This recipient name looks unusual. Please double-check before proceeding.',
    err_no_recipient:   'Please select or enter a recipient name.',
    err_no_amount:      'Please enter an amount.',
    err_invalid_amount: 'Please enter a valid positive amount (numbers only).',
    payment_voice_step1:'Step 1. Choose the person you want to send money to.',
    payment_voice_step2:'Step 2. Enter the amount in Rupees.',
    payment_voice_step3:'Please confirm: you are sending',
    pin_never_ask:      'Never share your UPI PIN or OTP with anyone.',
    result_ref_label:   'Demo Ref.',
    result_status_label:'Status',
    result_status_value:'✅ Simulated Success',
    mic_listening:      'Listening… speak now',
    mic_heard:          'Heard:',
    mic_tap_confirm:    'Tap to use this',
    mic_not_avail:      'Voice input not available in this browser.',

    // --- safety.html ---
    safety_title:       'Digital Safety',
    safety_intro:       'Learn how to protect yourself from payment scams.',
    tip1_title:         'UPI PIN — Keep It Secret',
    tip1_body:          'Your UPI PIN is like the key to your money. Never share it with anyone — not even someone claiming to be from your bank, the government, or a customer-care center.',
    tip2_title:         'Never Share Your OTP',
    tip2_body:          'An OTP (One-Time Password) is sent to your phone to verify a transaction. If you share it with anyone, they can steal money from your account. No legitimate bank or service will ever ask you for your OTP.',
    tip3_title:         'Beware of Fake Payment Screenshots',
    tip3_body:          'A screenshot can be faked. Never hand over goods or money just because someone shows you a payment screenshot. Always check the actual credit in your official banking app.',
    tip4_title:         'Suspicious Links and Impersonation',
    tip4_body:          'Scammers send fake links by SMS or WhatsApp pretending to be from banks or the government. Never click such links. Never allow anyone to install software or take remote control of your phone.',
    tip5_title:         'What To Do If You Suspect Fraud',
    tip5_body:          'Call your bank helpline immediately. You can also report cybercrime at the National Cyber Crime Reporting Portal: cybercrime.gov.in. Write down what happened and the phone numbers involved.',
    safety_disclaimer:  'This guidance is educational. Aasara cannot guarantee that any transaction is safe. Always verify using your official bank application.',

    // --- awareness.html ---
    awareness_title:    'Awareness Lessons',
    lesson1_title:      'What is UPI?',
    lesson2_title:      'How to Check a Payment',
    lesson3_title:      'Spotting a Scam',
    btn_next_slide:     'Next →',
    btn_prev_slide:     '← Previous',
    btn_quiz:           'Take a Short Quiz',
    quiz_title:         'Quick Quiz',
    quiz_well_done:     'Well done! You completed the quiz.',
    btn_restart:        'Restart Lesson',

    // --- volunteer.html ---
    volunteer_title:    'Volunteer & Essential Services',
    tab_volunteer:      'Volunteer',
    tab_services:       'Essential Services',
    sub_register:       'Register as a Volunteer',
    sub_request:        'Request Assistance',
    label_name:         'Your Name',
    label_city:         'City',
    label_phone:        'Phone (demo only)',
    label_desc:         'Describe the help you need',
    btn_submit:         'Submit',
    confirm_register:   'Thank you! Your volunteer registration has been noted (demonstration only).',
    confirm_request:    'Your request has been noted. Here are volunteers near you (demonstration only):',
    no_volunteers:      'No demo volunteers found for this city. In a real system, you would be matched automatically.',
    services_title:     'Essential Services',
    balance_guide_title:'How to Check Your Bank Balance',
    balance_guide_body: 'Open your official banking app (like SBI YONO, HDFC Mobile Banking, etc.), log in using your registered mobile number and MPIN, and tap "Account Summary" or "Balance Enquiry". You can also dial *99# on any mobile phone to check your balance without internet.',
    balance_disclaimer: 'Aasara does not connect to any bank account. The guide above uses official bank apps only.',
    demo_notice:        'This form is for demonstration only. No data is stored or sent anywhere.',
    err_fill_name_city: 'Please fill in your name and city.',

    // --- shared / navigation ---
    nav_home:           'Home',
    nav_back:           '← Back',
    language_label:     'Language',
    read_aloud:         '🔊 Read Aloud',
    stop_speaking:      '⏹ Stop',
    listen:             '🎤 Listen',
    voice_not_supported:'Voice synthesis is not supported in this browser.',
    mic_not_supported:  'Microphone / speech recognition is not supported in this browser.',
    mic_permission_denied: 'Microphone permission was denied. Please enable it in your browser settings.',
    voice_lang_missing: 'A voice for this language was not found. Using default voice.',
    voice_cmd_confirm:  'Did you say:',
    voice_cmd_tap:      'Tap to confirm',
  },

  // -------------------------------------------------------------------------
  kn: { // ಕನ್ನಡ
  // -------------------------------------------------------------------------
    welcome_tagline:    'ಹಿರಿಯ ವಯಸ್ಕರಿಗಾಗಿ ಡಿಜಿಟಲ್ ಪಾವತಿ ಮತ್ತು ಸುರಕ್ಷತಾ ಸಹಾಯಕ',
    choose_language:    'ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
    btn_continue:       'ಮುಂದುವರಿಯಿರಿ →',
    lang_hint:          'ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಭಾಷೆ ಬದಲಾಯಿಸಬಹುದು.',

    home_greeting:      'ಆಸರೆಗೆ ಸ್ವಾಗತ',
    home_subtitle:      'ನಾವು ನಿಮಗೆ ಇಂದು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    card_payment:       'ಮಾರ್ಗದರ್ಶಿ ಪಾವತಿ',
    card_payment_desc:  'ಹಣ ಕಳುಹಿಸಲು ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ',
    card_safety:        'ಡಿಜಿಟಲ್ ಸುರಕ್ಷತೆ',
    card_safety_desc:   'ವಂಚನೆಯಿಂದ ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸಿಕೊಳ್ಳಿ',
    card_awareness:     'ಅರಿವಿನ ಪಾಠಗಳು',
    card_awareness_desc:'ಡಿಜಿಟಲ್ ಪಾವತಿಗಳ ಕಿರು ಪಾಠಗಳು',
    card_volunteer:     'ಸ್ವಯಂಸೇವಕ ಸಹಾಯ',
    card_volunteer_desc:'ನಿಮ್ಮ ಹತ್ತಿರದ ಸಹಾಯಕರನ್ನು ಸಂಪರ್ಕಿಸಿ',
    card_services:      'ಅಗತ್ಯ ಸೇವೆಗಳು',
    card_services_desc: 'ಬ್ಯಾಲೆನ್ಸ್ ತಪಾಸಣೆ ಮತ್ತು ಅಧಿಕೃತ ಮಾರ್ಗದರ್ಶಿಗಳು',
    home_voice_welcome: 'ಆಸರೆಗೆ ಸ್ವಾಗತ. ಪ್ರಾರಂಭಿಸಲು ಮೆನುವಿನಿಂದ ಒಂದು ಆಯ್ಕೆ ಆರಿಸಿ.',

    payment_title:      'ಮಾರ್ಗದರ್ಶಿ ಪಾವತಿ',
    step1_heading:      'ಹಂತ ೧ — ಸ್ವೀಕರಿಸುವವರನ್ನು ಆರಿಸಿ',
    step1_instruction:  'ನೀವು ಯಾರಿಗೆ ಹಣ ಕಳುಹಿಸಲು ಬಯಸುತ್ತೀರಿ?',
    label_recipient:    'ಸ್ವೀಕರಿಸುವವರು',
    label_or_enter:     'ಅಥವಾ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ:',
    placeholder_recipient: 'ಹೆಸರು ಟೈಪ್ ಮಾಡಿ',
    step2_heading:      'ಹಂತ ೨ — ಮೊತ್ತ ನಮೂದಿಸಿ',
    step2_instruction:  'ನೀವು ಎಷ್ಟು ಹಣ ಕಳುಹಿಸಲು ಬಯಸುತ್ತೀರಿ? (ರೂಪಾಯಿಗಳಲ್ಲಿ)',
    label_amount:       'ಮೊತ್ತ (₹)',
    placeholder_amount: 'ಉದಾ. ೫೦೦',
    btn_next:           'ಮುಂದೆ →',
    btn_back:           '← ಹಿಂದೆ',
    btn_confirm:        '✅ ದೃಢೀಕರಿಸಿ',
    btn_change:         '✏️ ಬದಲಾಯಿಸಿ',
    btn_cancel:         '✖ ರದ್ದುಮಾಡಿ',
    btn_home:           'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    step3_heading:      'ಹಂತ ೩ — ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ',
    step3_instruction:  'ದೃಢೀಕರಿಸುವ ಮೊದಲು ವಿವರಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸಿ.',
    review_sending:     'ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ',
    review_to:          'ಗೆ',
    review_question:    'ಇದು ಸರಿಯಾಗಿದೆಯೇ?',
    result_heading:     'ಅನುಕರಣ ಪಾವತಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
    result_banner:      '⚠️ ಪ್ರದರ್ಶನ ಮಾತ್ರ — ನಿಜವಾದ ಹಣ ವರ್ಗಾವಣೆಯಾಗಿಲ್ಲ',
    result_reminder:    'ನಿಜವಾದ ಪಾವತಿ ಮಾಡಲು, ನಿಮ್ಮ ಅಧಿಕೃತ UPI ಅಪ್ ಬಳಸಿ ಮತ್ತು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    warn_large_amount:  '⚠️ ದೊಡ್ಡ ಮೊತ್ತ: ದೊಡ್ಡ ಮೊತ್ತ ಕಳುಹಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಅಧಿಕೃತ ಅಪ್‌ನಲ್ಲಿ ಯಾವಾಗಲೂ ಪರಿಶೀಲಿಸಿ.',
    warn_suspicious:    '⚠️ ಎಚ್ಚರಿಕೆ: ಈ ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು ಅಸಾಮಾನ್ಯವಾಗಿ ಕಾಣಿಸುತ್ತದೆ. ಮುಂದುವರಿಯುವ ಮೊದಲು ದಯವಿಟ್ಟು ಮರುಪರಿಶೀಲಿಸಿ.',
    err_no_recipient:   'ದಯವಿಟ್ಟು ಸ್ವೀಕರಿಸುವವರ ಹೆಸರನ್ನು ಆರಿಸಿ ಅಥವಾ ನಮೂದಿಸಿ.',
    err_no_amount:      'ದಯವಿಟ್ಟು ಮೊತ್ತ ನಮೂದಿಸಿ.',
    err_invalid_amount: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಧನಾತ್ಮಕ ಮೊತ್ತ ನಮೂದಿಸಿ.',
    payment_voice_step1:'ಹಂತ ೧. ನೀವು ಯಾರಿಗೆ ಹಣ ಕಳುಹಿಸಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಆರಿಸಿ.',
    payment_voice_step2:'ಹಂತ ೨. ರೂಪಾಯಿಗಳಲ್ಲಿ ಮೊತ್ತ ನಮೂದಿಸಿ.',
    payment_voice_step3:'ದಯವಿಟ್ಟು ದೃಢೀಕರಿಸಿ: ನೀವು ಕಳುಹಿಸುತ್ತಿದ್ದೀರಿ',
    pin_never_ask:      'ನಿಮ್ಮ UPI PIN ಅಥವಾ OTP ಯಾರಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.',
    result_ref_label:   'ಡೆಮೋ ಉಲ್ಲೇಖ.',
    result_status_label:'ಸ್ಥಿತಿ',
    result_status_value:'✅ ಅನುಕರಣ ಯಶಸ್ಸು',
    mic_listening:      'ಆಲಿಸುತ್ತಿದ್ದೇನೆ… ಮಾತನಾಡಿ',
    mic_heard:          'ಕೇಳಿದ್ದು:',
    mic_tap_confirm:    'ಇದನ್ನು ಬಳಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    mic_not_avail:      'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ.',

    safety_title:       'ಡಿಜಿಟಲ್ ಸುರಕ್ಷತೆ',
    safety_intro:       'ಪಾವತಿ ವಂಚನೆಗಳಿಂದ ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸಿಕೊಳ್ಳಲು ಕಲಿಯಿರಿ.',
    tip1_title:         'UPI PIN — ರಹಸ್ಯವಾಗಿರಿಸಿ',
    tip1_body:          'ನಿಮ್ಮ UPI PIN ನಿಮ್ಮ ಹಣದ ಬೀಗದ ಕೈ ಇದ್ದಂತೆ. ಯಾರೊಂದಿಗೂ — ಬ್ಯಾಂಕ್‌ನಿಂದ ಬಂದಿದ್ದೇನೆ ಎನ್ನುವವರಿಗೂ ಹೇಳಬೇಡಿ.',
    tip2_title:         'OTP ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ',
    tip2_body:          'OTP ಒಂದು ಬಾರಿ ಬಳಸಬಹುದಾದ ಪಾಸ್‌ವರ್ಡ್. ಯಾರಾದರೂ ಕೇಳಿದರೆ ಹೇಳಬೇಡಿ — ಅವರು ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕದಿಯಬಹುದು.',
    tip3_title:         'ನಕಲಿ ಪಾವತಿ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳಿಂದ ಎಚ್ಚರ',
    tip3_body:          'ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ನಕಲಿ ಮಾಡಬಹುದು. ಯಾರಾದರೂ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ತೋರಿಸಿದರೆ ನಂಬಬೇಡಿ. ನಿಮ್ಮ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಅಪ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
    tip4_title:         'ಅನುಮಾನಾಸ್ಪದ ಲಿಂಕ್‌ಗಳು ಮತ್ತು ನಕಲಿ ಗುರುತು',
    tip4_body:          'ವಂಚಕರು SMS ಅಥವಾ WhatsApp ನಲ್ಲಿ ನಕಲಿ ಲಿಂಕ್‌ಗಳನ್ನು ಕಳುಹಿಸುತ್ತಾರೆ. ಅಂತಹ ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ. ಯಾರಿಗೂ ನಿಮ್ಮ ಫೋನ್ ಅನ್ನು ನಿಯಂತ್ರಿಸಲು ಅನುಮತಿ ನೀಡಬೇಡಿ.',
    tip5_title:         'ವಂಚನೆ ಅನುಮಾನ ಬಂದರೆ ಏನು ಮಾಡಬೇಕು',
    tip5_body:          'ತಕ್ಷಣ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಹೆಲ್ಪ್‌ಲೈನ್‌ಗೆ ಕರೆ ಮಾಡಿ. cybercrime.gov.in ನಲ್ಲಿ ಸೈಬರ್ ಅಪರಾಧ ವರದಿ ಮಾಡಬಹುದು.',
    safety_disclaimer:  'ಈ ಮಾರ್ಗದರ್ಶನ ಶಿಕ್ಷಣ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ. ಆಸರೆ ಯಾವುದೇ ವ್ಯವಹಾರ ಸುರಕ್ಷಿತ ಎಂದು ಖಾತ್ರಿ ನೀಡುವುದಿಲ್ಲ.',

    awareness_title:    'ಅರಿವಿನ ಪಾಠಗಳು',
    lesson1_title:      'UPI ಎಂದರೇನು?',
    lesson2_title:      'ಪಾವತಿ ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ',
    lesson3_title:      'ವಂಚನೆ ಗುರುತಿಸುವುದು ಹೇಗೆ',
    btn_next_slide:     'ಮುಂದೆ →',
    btn_prev_slide:     '← ಹಿಂದೆ',
    btn_quiz:           'ಕಿರು ಪ್ರಶ್ನೋತ್ತರ',
    quiz_title:         'ತ್ವರಿತ ಪ್ರಶ್ನೋತ್ತರ',
    quiz_well_done:     'ಶಾಬ್ಬಾಸ್! ನೀವು ಪ್ರಶ್ನೋತ್ತರ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.',
    btn_restart:        'ಪಾಠ ಮರುಪ್ರಾರಂಭ',

    volunteer_title:    'ಸ್ವಯಂಸೇವಕ ಮತ್ತು ಅಗತ್ಯ ಸೇವೆಗಳು',
    tab_volunteer:      'ಸ್ವಯಂಸೇವಕ',
    tab_services:       'ಅಗತ್ಯ ಸೇವೆಗಳು',
    sub_register:       'ಸ್ವಯಂಸೇವಕರಾಗಿ ನೋಂದಾಯಿಸಿ',
    sub_request:        'ಸಹಾಯ ಕೋರಿ',
    label_name:         'ನಿಮ್ಮ ಹೆಸರು',
    label_city:         'ನಗರ',
    label_phone:        'ಫೋನ್ (ಪ್ರದರ್ಶನ ಮಾತ್ರ)',
    label_desc:         'ನಿಮಗೆ ಬೇಕಾದ ಸಹಾಯ ವಿವರಿಸಿ',
    btn_submit:         'ಸಲ್ಲಿಸಿ',
    confirm_register:   'ಧನ್ಯವಾದ! ನಿಮ್ಮ ನೋಂದಾಯಣೆ ದಾಖಲಾಗಿದೆ (ಪ್ರದರ್ಶನ ಮಾತ್ರ).',
    confirm_request:    'ನಿಮ್ಮ ವಿನಂತಿ ದಾಖಲಾಗಿದೆ. ಹತ್ತಿರದ ಸ್ವಯಂಸೇವಕರು (ಪ್ರದರ್ಶನ ಮಾತ್ರ):',
    no_volunteers:      'ಈ ನಗರಕ್ಕೆ ಯಾವುದೇ ಪ್ರದರ್ಶನ ಸ್ವಯಂಸೇವಕರು ಸಿಗಲಿಲ್ಲ.',
    services_title:     'ಅಗತ್ಯ ಸೇವೆಗಳು',
    balance_guide_title:'ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಹೇಗೆ ಪರಿಶೀಲಿಸಬೇಕು',
    balance_guide_body: 'ನಿಮ್ಮ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಅಪ್ ತೆರೆಯಿರಿ (SBI YONO, HDFC ಮೊಬೈಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಇತ್ಯಾದಿ), ಲಾಗಿನ್ ಮಾಡಿ, ಮತ್ತು "ಖಾತೆ ಸಾರಾಂಶ" ಅಥವಾ "ಬ್ಯಾಲೆನ್ಸ್ ಪ್ರಶ್ನೆ" ಕ್ಲಿಕ್ ಮಾಡಿ. ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ *99# ಡಯಲ್ ಮಾಡಬಹುದು.',
    balance_disclaimer: 'ಆಸರೆ ಯಾವುದೇ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಸಂಪರ್ಕಿಸುವುದಿಲ್ಲ.',
    demo_notice:        'ಈ ಫಾರ್ಮ್ ಪ್ರದರ್ಶನ ಮಾತ್ರ. ಯಾವ ಮಾಹಿತಿಯೂ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ.',
    err_fill_name_city: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ನಗರ ನಮೂದಿಸಿ.',

    nav_home:           'ಮುಖಪುಟ',
    nav_back:           '← ಹಿಂದೆ',
    language_label:     'ಭಾಷೆ',
    read_aloud:         '🔊 ಓದಿ ಹೇಳಿ',
    stop_speaking:      '⏹ ನಿಲ್ಲಿಸಿ',
    listen:             '🎤 ಆಲಿಸಿ',
    voice_not_supported:'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಬೆಂಬಲ ಇಲ್ಲ.',
    mic_not_supported:  'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ / ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಇಲ್ಲ.',
    mic_permission_denied: 'ಮೈಕ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ನಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ.',
    voice_lang_missing: 'ಈ ಭಾಷೆಗೆ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. ಡೀಫಾಲ್ಟ್ ಧ್ವನಿ ಬಳಸಲಾಗುತ್ತಿದೆ.',
    voice_cmd_confirm:  'ನೀವು ಹೇಳಿದಿರಾ:',
    voice_cmd_tap:      'ದೃಢೀಕರಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
  },

  // -------------------------------------------------------------------------
  hi: { // हिंदी
  // -------------------------------------------------------------------------
    welcome_tagline:    'वरिष्ठ नागरिकों के लिए डिजिटल भुगतान और सुरक्षा सहायक',
    choose_language:    'आगे बढ़ने के लिए अपनी भाषा चुनें',
    btn_continue:       'जारी रखें →',
    lang_hint:          'आप कभी भी भाषा बदल सकते हैं।',

    home_greeting:      'आसरे में आपका स्वागत है',
    home_subtitle:      'आज हम आपकी कैसे मदद कर सकते हैं?',
    card_payment:       'मार्गदर्शित भुगतान',
    card_payment_desc:  'कदम-दर-कदम सुरक्षित पैसे भेजना सीखें',
    card_safety:        'डिजिटल सुरक्षा',
    card_safety_desc:   'धोखाधड़ी से खुद को बचाएं',
    card_awareness:     'जागरूकता पाठ',
    card_awareness_desc:'डिजिटल भुगतान पर छोटे पाठ',
    card_volunteer:     'स्वयंसेवक सहायता',
    card_volunteer_desc:'अपने पास के सहायक से जुड़ें',
    card_services:      'आवश्यक सेवाएँ',
    card_services_desc: 'बैलेंस जाँच और आधिकारिक मार्गदर्शिकाएँ',
    home_voice_welcome: 'आसरे में आपका स्वागत है। शुरू करने के लिए मेनू से कोई विकल्प चुनें।',

    payment_title:      'मार्गदर्शित भुगतान',
    step1_heading:      'चरण १ — प्राप्तकर्ता चुनें',
    step1_instruction:  'आप किसे पैसे भेजना चाहते हैं?',
    label_recipient:    'प्राप्तकर्ता',
    label_or_enter:     'या नाम टाइप करें:',
    placeholder_recipient: 'प्राप्तकर्ता का नाम टाइप करें',
    step2_heading:      'चरण २ — राशि दर्ज करें',
    step2_instruction:  'आप कितने रुपये भेजना चाहते हैं?',
    label_amount:       'राशि (₹)',
    placeholder_amount: 'जैसे ५००',
    btn_next:           'अगला →',
    btn_back:           '← वापस',
    btn_confirm:        '✅ पुष्टि करें',
    btn_change:         '✏️ बदलें',
    btn_cancel:         '✖ रद्द करें',
    btn_home:           'होम पर वापस जाएँ',
    step3_heading:      'चरण ३ — समीक्षा करें और पुष्टि करें',
    step3_instruction:  'पुष्टि करने से पहले विवरण ध्यान से जाँचें।',
    review_sending:     'भेज रहे हैं',
    review_to:          'को',
    review_question:    'क्या यह सही है?',
    result_heading:     'अनुकरणीय भुगतान पूर्ण',
    result_banner:      '⚠️ केवल प्रदर्शन — कोई वास्तविक पैसा स्थानांतरित नहीं हुआ',
    result_reminder:    'वास्तविक भुगतान के लिए अपने आधिकारिक UPI ऐप का उपयोग करें और सभी विवरण स्वयं सत्यापित करें।',
    warn_large_amount:  '⚠️ बड़ी राशि: बड़ी राशि भेजने से पहले हमेशा अपने आधिकारिक ऐप में सत्यापित करें।',
    warn_suspicious:    '⚠️ सावधान: यह प्राप्तकर्ता का नाम असामान्य लगता है। आगे बढ़ने से पहले कृपया पुनः जाँचें।',
    err_no_recipient:   'कृपया प्राप्तकर्ता का नाम चुनें या दर्ज करें।',
    err_no_amount:      'कृपया राशि दर्ज करें।',
    err_invalid_amount: 'कृपया एक मान्य धनात्मक राशि दर्ज करें।',
    payment_voice_step1:'चरण एक। आप जिसे पैसे भेजना चाहते हैं उसे चुनें।',
    payment_voice_step2:'चरण दो। रुपयों में राशि दर्ज करें।',
    payment_voice_step3:'कृपया पुष्टि करें: आप भेज रहे हैं',
    pin_never_ask:      'अपना UPI PIN या OTP किसी के साथ साझा न करें।',
    result_ref_label:   'डेमो संदर्भ',
    result_status_label:'स्थिति',
    result_status_value:'✅ अनुकरणीय सफलता',
    mic_listening:      'सुन रहा हूँ… बोलें',
    mic_heard:          'सुना:',
    mic_tap_confirm:    'इसे उपयोग करने के लिए टैप करें',
    mic_not_avail:      'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।',

    safety_title:       'डिजिटल सुरक्षा',
    safety_intro:       'भुगतान धोखाधड़ी से खुद को कैसे बचाएं।',
    tip1_title:         'UPI PIN — इसे गुप्त रखें',
    tip1_body:          'आपका UPI PIN आपके पैसे की चाबी है। इसे किसी के साथ साझा न करें — यहाँ तक कि बैंक अधिकारी या सरकारी कर्मचारी का दावा करने वाले से भी नहीं।',
    tip2_title:         'OTP कभी साझा न करें',
    tip2_body:          'OTP एक बार उपयोग होने वाला पासवर्ड है। अगर कोई पूछे तो न बताएं — वे आपके खाते से पैसे चुरा सकते हैं।',
    tip3_title:         'नकली भुगतान स्क्रीनशॉट से सावधान',
    tip3_body:          'स्क्रीनशॉट नकली हो सकता है। केवल स्क्रीनशॉट दिखाने पर भरोसा न करें। अपने आधिकारिक बैंकिंग ऐप में असली जमा की जाँच करें।',
    tip4_title:         'संदिग्ध लिंक और नकली पहचान',
    tip4_body:          'धोखेबाज SMS या WhatsApp पर नकली लिंक भेजते हैं। ऐसे लिंक पर क्लिक न करें। किसी को भी अपने फोन पर रिमोट एक्सेस न दें।',
    tip5_title:         'धोखाधड़ी का संदेह होने पर क्या करें',
    tip5_body:          'तुरंत अपने बैंक हेल्पलाइन पर कॉल करें। cybercrime.gov.in पर साइबर अपराध की रिपोर्ट करें।',
    safety_disclaimer:  'यह मार्गदर्शन शैक्षिक उद्देश्य के लिए है। आसरे किसी भी लेनदेन की सुरक्षा की गारंटी नहीं देता।',

    awareness_title:    'जागरूकता पाठ',
    lesson1_title:      'UPI क्या है?',
    lesson2_title:      'भुगतान कैसे जाँचें',
    lesson3_title:      'धोखाधड़ी कैसे पहचानें',
    btn_next_slide:     'अगला →',
    btn_prev_slide:     '← पिछला',
    btn_quiz:           'छोटी प्रश्नोत्तरी',
    quiz_title:         'त्वरित प्रश्नोत्तरी',
    quiz_well_done:     'शाबाश! आपने प्रश्नोत्तरी पूरी की।',
    btn_restart:        'पाठ फिर से शुरू करें',

    volunteer_title:    'स्वयंसेवक और आवश्यक सेवाएँ',
    tab_volunteer:      'स्वयंसेवक',
    tab_services:       'आवश्यक सेवाएँ',
    sub_register:       'स्वयंसेवक के रूप में पंजीकरण करें',
    sub_request:        'सहायता का अनुरोध करें',
    label_name:         'आपका नाम',
    label_city:         'शहर',
    label_phone:        'फ़ोन (केवल प्रदर्शन)',
    label_desc:         'आपको किस प्रकार की सहायता चाहिए',
    btn_submit:         'जमा करें',
    confirm_register:   'धन्यवाद! आपका स्वयंसेवक पंजीकरण दर्ज हो गया (केवल प्रदर्शन)।',
    confirm_request:    'आपका अनुरोध दर्ज हो गया। आपके पास के स्वयंसेवक (केवल प्रदर्शन):',
    no_volunteers:      'इस शहर के लिए कोई प्रदर्शन स्वयंसेवक नहीं मिला।',
    services_title:     'आवश्यक सेवाएँ',
    balance_guide_title:'बैंक बैलेंस कैसे जाँचें',
    balance_guide_body: 'अपना आधिकारिक बैंकिंग ऐप खोलें (जैसे SBI YONO, HDFC Mobile Banking), MPIN से लॉगिन करें, और "खाता सारांश" या "बैलेंस जाँच" पर टैप करें। बिना इंटरनेट के *99# डायल करें।',
    balance_disclaimer: 'आसरे किसी भी बैंक खाते से नहीं जुड़ता।',
    demo_notice:        'यह फॉर्म केवल प्रदर्शन के लिए है। कोई डेटा संग्रहीत या भेजा नहीं जाता।',
    err_fill_name_city: 'कृपया अपना नाम और शहर भरें।',

    nav_home:           'होम',
    nav_back:           '← वापस',
    language_label:     'भाषा',
    read_aloud:         '🔊 ज़ोर से पढ़ें',
    stop_speaking:      '⏹ रोकें',
    listen:             '🎤 सुनें',
    voice_not_supported:'इस ब्राउज़र में आवाज़ समर्थित नहीं है।',
    mic_not_supported:  'इस ब्राउज़र में माइक्रोफ़ोन समर्थित नहीं है।',
    mic_permission_denied: 'माइक्रोफ़ोन की अनुमति अस्वीकार की गई। कृपया ब्राउज़र सेटिंग में सक्षम करें।',
    voice_lang_missing: 'इस भाषा के लिए आवाज़ नहीं मिली। डिफ़ॉल्ट आवाज़ उपयोग की जा रही है।',
    voice_cmd_confirm:  'क्या आपने कहा:',
    voice_cmd_tap:      'पुष्टि करने के लिए टैप करें',
  },

  // -------------------------------------------------------------------------
  te: { // తెలుగు
  // -------------------------------------------------------------------------
    welcome_tagline:    'వృద్ధులకు డిజిటల్ చెల్లింపు మరియు భద్రతా సహాయకుడు',
    choose_language:    'కొనసాగించడానికి మీ భాషను ఎంచుకోండి',
    btn_continue:       'కొనసాగించు →',
    lang_hint:          'మీరు ఎప్పుడైనా భాషను మార్చవచ్చు.',

    home_greeting:      'ఆసరాకు స్వాగతం',
    home_subtitle:      'మేము మీకు ఈరోజు ఎలా సహాయపడగలం?',
    card_payment:       'మార్గదర్శక చెల్లింపు',
    card_payment_desc:  'అడుగడుగునా సురక్షితంగా డబ్బు పంపడం నేర్చుకోండి',
    card_safety:        'డిజిటల్ భద్రత',
    card_safety_desc:   'మోసాల నుండి మిమ్మల్ని మీరు రక్షించుకోండి',
    card_awareness:     'అవగాహన పాఠాలు',
    card_awareness_desc:'డిజిటల్ చెల్లింపులపై చిన్న పాఠాలు',
    card_volunteer:     'వాలంటీర్ సహాయం',
    card_volunteer_desc:'మీ దగ్గర సహాయకుడిని కలవండి',
    card_services:      'అవసరమైన సేవలు',
    card_services_desc: 'బ్యాలెన్స్ తనిఖీ మరియు అధికారిక మార్గదర్శకాలు',
    home_voice_welcome: 'ఆసరాకు స్వాగతం. ప్రారంభించడానికి మెనూ నుండి ఒక ఎంపికను ఎంచుకోండి.',

    payment_title:      'మార్గదర్శక చెల్లింపు',
    step1_heading:      'దశ ౧ — గ్రహీతను ఎంచుకోండి',
    step1_instruction:  'మీరు ఎవరికి డబ్బు పంపాలనుకుంటున్నారు?',
    label_recipient:    'గ్రహీత',
    label_or_enter:     'లేదా పేరు టైప్ చేయండి:',
    placeholder_recipient: 'గ్రహీత పేరు టైప్ చేయండి',
    step2_heading:      'దశ ౨ — మొత్తం నమోదు చేయండి',
    step2_instruction:  'మీరు ఎంత డబ్బు పంపాలనుకుంటున్నారు? (రూపాయలలో)',
    label_amount:       'మొత్తం (₹)',
    placeholder_amount: 'ఉదా. ౫౦౦',
    btn_next:           'తదుపరి →',
    btn_back:           '← వెనుకకు',
    btn_confirm:        '✅ నిర్ధారించు',
    btn_change:         '✏️ మార్చు',
    btn_cancel:         '✖ రద్దు',
    btn_home:           'హోమ్‌కు తిరిగి వెళ్ళు',
    step3_heading:      'దశ ౩ — సమీక్షించి నిర్ధారించండి',
    step3_instruction:  'నిర్ధారించే ముందు వివరాలను జాగ్రత్తగా తనిఖీ చేయండి.',
    review_sending:     'పంపుతున్నాం',
    review_to:          'కి',
    review_question:    'ఇది సరైనదేనా?',
    result_heading:     'అనుకరణ చెల్లింపు పూర్తయింది',
    result_banner:      '⚠️ ప్రదర్శన మాత్రమే — నిజమైన డబ్బు బదిలీ కాలేదు',
    result_reminder:    'నిజమైన చెల్లింపు కోసం మీ అధికారిక UPI యాప్ ఉపయోగించండి మరియు అన్ని వివరాలు మీరే ధృవీకరించండి.',
    warn_large_amount:  '⚠️ పెద్ద మొత్తం: పెద్ద మొత్తాలు పంపే ముందు మీ అధికారిక యాప్‌లో ఎల్లప్పుడూ ధృవీకరించండి.',
    warn_suspicious:    '⚠️ జాగ్రత్త: ఈ గ్రహీత పేరు అసాధారణంగా కనిపిస్తోంది. దయచేసి ముందు మళ్ళీ తనిఖీ చేయండి.',
    err_no_recipient:   'దయచేసి గ్రహీత పేరు ఎంచుకోండి లేదా నమోదు చేయండి.',
    err_no_amount:      'దయచేసి మొత్తం నమోదు చేయండి.',
    err_invalid_amount: 'దయచేసి చెల్లుబాటయ్యే ధనాత్మక మొత్తం నమోదు చేయండి.',
    payment_voice_step1:'దశ ఒకటి. మీరు ఎవరికి డబ్బు పంపాలనుకుంటున్నారో ఎంచుకోండి.',
    payment_voice_step2:'దశ రెండు. రూపాయలలో మొత్తం నమోదు చేయండి.',
    payment_voice_step3:'దయచేసి నిర్ధారించండి: మీరు పంపుతున్నారు',
    pin_never_ask:      'మీ UPI PIN లేదా OTP ఎవరికీ చెప్పవద్దు.',
    result_ref_label:   'డెమో రెఫ.',
    result_status_label:'స్థితి',
    result_status_value:'✅ అనుకరణ విజయం',
    mic_listening:      'వింటున్నాను… మాట్లాడండి',
    mic_heard:          'విన్నది:',
    mic_tap_confirm:    'దీన్ని ఉపయోగించడానికి నొక్కండి',
    mic_not_avail:      'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు.',

    safety_title:       'డిజిటల్ భద్రత',
    safety_intro:       'చెల్లింపు మోసాల నుండి మిమ్మల్ని ఎలా రక్షించుకోవాలో తెలుసుకోండి.',
    tip1_title:         'UPI PIN — రహస్యంగా ఉంచండి',
    tip1_body:          'మీ UPI PIN మీ డబ్బుకు తాళంచెవి వంటిది. ఎవరికీ చెప్పవద్దు — బ్యాంకు అధికారి అని చెప్పే వారికి కూడా.',
    tip2_title:         'OTP ఎన్నటికీ చెప్పవద్దు',
    tip2_body:          'OTP ఒక్కసారి మాత్రమే వాడే పాస్‌వర్డ్. ఎవరైనా అడిగితే చెప్పవద్దు — వారు మీ ఖాతా నుండి డబ్బు దొంగిలించవచ్చు.',
    tip3_title:         'నకిలీ చెల్లింపు స్క్రీన్‌షాట్‌ల గురించి జాగ్రత్త',
    tip3_body:          'స్క్రీన్‌షాట్ నకిలీగా ఉండవచ్చు. ఎవరైనా స్క్రీన్‌షాట్ చూపించినా నమ్మవద్దు. మీ అధికారిక బ్యాంకింగ్ యాప్‌లో నిజమైన జమను తనిఖీ చేయండి.',
    tip4_title:         'అనుమానాస్పద లింక్‌లు మరియు నకిలీ గుర్తింపు',
    tip4_body:          'మోసగాళ్ళు SMS లేదా WhatsApp ద్వారా నకిలీ లింక్‌లు పంపుతారు. అలాంటి లింక్‌లపై క్లిక్ చేయవద్దు. ఎవరికీ మీ ఫోన్‌ను రిమోట్‌గా నియంత్రించడానికి అనుమతి ఇవ్వవద్దు.',
    tip5_title:         'మోసం అనుమానం వస్తే ఏం చేయాలి',
    tip5_body:          'వెంటనే మీ బ్యాంకు హెల్ప్‌లైన్‌కు కాల్ చేయండి. cybercrime.gov.in లో సైబర్ నేరాన్ని నివేదించవచ్చు.',
    safety_disclaimer:  'ఈ మార్గదర్శకత్వం విద్యా ప్రయోజనం కోసం. ఆసరా ఏ లావాదేవీ సురక్షితమని హామీ ఇవ్వదు.',

    awareness_title:    'అవగాహన పాఠాలు',
    lesson1_title:      'UPI అంటే ఏమిటి?',
    lesson2_title:      'చెల్లింపు ఎలా తనిఖీ చేయాలి',
    lesson3_title:      'మోసాన్ని ఎలా గుర్తించాలి',
    btn_next_slide:     'తదుపరి →',
    btn_prev_slide:     '← వెనుకకు',
    btn_quiz:           'చిన్న క్విజ్',
    quiz_title:         'త్వరిత క్విజ్',
    quiz_well_done:     'అభినందనలు! మీరు క్విజ్ పూర్తి చేశారు.',
    btn_restart:        'పాఠాన్ని మళ్ళీ ప్రారంభించు',

    volunteer_title:    'వాలంటీర్ మరియు అవసరమైన సేవలు',
    tab_volunteer:      'వాలంటీర్',
    tab_services:       'అవసరమైన సేవలు',
    sub_register:       'వాలంటీర్‌గా నమోదు చేయండి',
    sub_request:        'సహాయం అభ్యర్థించండి',
    label_name:         'మీ పేరు',
    label_city:         'నగరం',
    label_phone:        'ఫోన్ (ప్రదర్శన మాత్రమే)',
    label_desc:         'మీకు కావలసిన సహాయాన్ని వివరించండి',
    btn_submit:         'సమర్పించు',
    confirm_register:   'ధన్యవాదాలు! మీ వాలంటీర్ నమోదు గుర్తించబడింది (ప్రదర్శన మాత్రమే).',
    confirm_request:    'మీ అభ్యర్థన గుర్తించబడింది. మీ దగ్గర వాలంటీర్లు (ప్రదర్శన మాత్రమే):',
    no_volunteers:      'ఈ నగరంలో ప్రదర్శన వాలంటీర్లు కనుగొనబడలేదు.',
    services_title:     'అవసరమైన సేవలు',
    balance_guide_title:'బ్యాంక్ బ్యాలెన్స్ ఎలా తనిఖీ చేయాలి',
    balance_guide_body: 'మీ అధికారిక బ్యాంకింగ్ యాప్ తెరవండి (SBI YONO, HDFC Mobile Banking మొదలైనవి), లాగిన్ అవ్వండి, "ఖాతా సారాంశం" లేదా "బ్యాలెన్స్ విచారణ" నొక్కండి. ఇంటర్నెట్ లేకుండా *99# డయల్ చేయండి.',
    balance_disclaimer: 'ఆసరా ఏ బ్యాంకు ఖాతాకూ కనెక్ట్ కాదు.',
    demo_notice:        'ఈ ఫారమ్ ప్రదర్శన మాత్రమే. ఏ సమాచారం సంగ్రహించబడదు లేదా పంపబడదు.',
    err_fill_name_city: 'దయచేసి మీ పేరు మరియు నగరం నమోదు చేయండి.',

    nav_home:           'హోమ్',
    nav_back:           '← వెనుకకు',
    language_label:     'భాష',
    read_aloud:         '🔊 బిగ్గరగా చదవండి',
    stop_speaking:      '⏹ ఆపు',
    listen:             '🎤 వినండి',
    voice_not_supported:'ఈ బ్రౌజర్‌లో వాయిస్ మద్దతు లేదు.',
    mic_not_supported:  'ఈ బ్రౌజర్‌లో మైక్రోఫోన్ మద్దతు లేదు.',
    mic_permission_denied: 'మైక్రోఫోన్ అనుమతి తిరస్కరించబడింది. బ్రౌజర్ సెట్టింగ్‌లలో దయచేసి ప్రారంభించండి.',
    voice_lang_missing: 'ఈ భాషకు వాయిస్ కనుగొనబడలేదు. డిఫాల్ట్ వాయిస్ ఉపయోగించబడుతోంది.',
    voice_cmd_confirm:  'మీరు అన్నారా:',
    voice_cmd_tap:      'నిర్ధారించడానికి నొక్కండి',
  },
};

// ---------------------------------------------------------------------------
// Language state (sessionStorage)
// ---------------------------------------------------------------------------

/**
 * Save the chosen language code.
 * @param {'en'|'kn'|'hi'|'te'} lang
 */
function setLanguage(lang) {
  sessionStorage.setItem('aasara_lang', lang);
}

/**
 * Retrieve the saved language, defaulting to English.
 * @returns {'en'|'kn'|'hi'|'te'}
 */
function getLanguage() {
  return sessionStorage.getItem('aasara_lang') || 'en';
}

// ---------------------------------------------------------------------------
// Translation lookup
// ---------------------------------------------------------------------------

/**
 * Return the translated string for `key` in the current language.
 * Falls back to English if the key is missing in the active language.
 * Falls back to the key itself if it is missing in English too.
 *
 * @param {string} key  - A key from the TRANSLATIONS dictionary
 * @returns {string}
 */
function t(key) {
  const lang = getLanguage();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  // Fall back to English if key missing in current language
  return dict[key] ?? TRANSLATIONS['en'][key] ?? key;
}

// ---------------------------------------------------------------------------
// DOM auto-translation
// ---------------------------------------------------------------------------

/**
 * Walk the current page DOM and update every element that carries a
 * data-i18n attribute.  Also handles placeholder and aria-label.
 *
 * Usage in HTML:
 *   <span data-i18n="welcome_tagline"></span>
 *   <input data-i18n-placeholder="placeholder_amount" ...>
 *   <button data-i18n-aria="btn_confirm" ...>
 *
 * Call this once after DOMContentLoaded on every page.
 */
function applyLanguage() {
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  // Update aria-label attributes (for screen readers)
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', t(key));
  });
}
