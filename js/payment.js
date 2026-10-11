/**
 * js/payment.js — Guided Payment Demo Logic
 * ------------------------------------------
 * Manages the 3-step simulated payment flow on payment.html.
 *
 * STEPS
 * -----
 *  Step 1: Choose a recipient (from a demo list or free-text input)
 *  Step 2: Enter an amount (positive integers only)
 *  Step 3: Review the details, confirm or go back/cancel
 *  Result: Show a clearly-labelled simulated result screen
 *
 * SAFETY GUARDRAILS
 * -----------------
 *  - This is demonstration-only. No real money moves. No bank is contacted.
 *  - PINs, OTPs, and passwords are never requested.
 *  - Large amounts (> ₹10,000) trigger a visible educational warning.
 *  - Suspicious recipient keywords trigger a visible caution message.
 *  - The result screen always shows a red "DEMONSTRATION ONLY" banner.
 *  - The rules-based warnings do not claim to guarantee a payment is safe.
 *
 * DEPENDENCIES
 * ------------
 *  languages.js must be loaded before this file (provides t(), getLanguage()).
 *  voice.js must be loaded before this file (provides speak(), speakRaw(), etc.).
 */

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

/**
 * Demo recipients — completely fictional names used for demonstration only.
 * These are NOT real people or UPI accounts.
 */
const DEMO_RECIPIENTS = [
  { id: 'r1', name: 'Anita Sharma (Demo)',  upi: 'anita.demo@upi'  },
  { id: 'r2', name: 'Ravi Kumar (Demo)',    upi: 'ravi.demo@upi'   },
  { id: 'r3', name: 'Sunita Devi (Demo)',   upi: 'sunita.demo@upi' },
  { id: 'r4', name: 'Mohan Rao (Demo)',     upi: 'mohan.demo@upi'  },
];

/**
 * Keywords that suggest a possibly suspicious payment request.
 * This list is educational only and does not constitute fraud detection.
 */
const SUSPICIOUS_KEYWORDS = [
  'lottery', 'prize', 'winner', 'tax refund', 'refund', 'cashback offer',
  'free money', 'covid', 'government scheme', 'emi waiver',
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let currentStep = 1;
let chosenRecipient = '';
let chosenPhone     = '';
let chosenAmount    = 0;

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Set up the payment page once the DOM is ready.
 * Called from the inline <script> in payment.html.
 */
function initPayment() {
  _buildRecipientOptions();
  _showStep(1);
  _bindEvents();
  _bindMicButtons();

  // Register this page's "Read Aloud" function with voice.js
  registerPageReader(_readCurrentStepInternal);

  // Speak the Step 1 instruction automatically
  setTimeout(() => speak('payment_voice_step1'), 500);
}

// ---------------------------------------------------------------------------
// Step navigation
// ---------------------------------------------------------------------------

/**
 * Advance to the next step after validating the current one.
 * Called when the user clicks "Next →".
 */
function nextStep() {
  if (currentStep === 1) {
    const ok = _validateStep1();
    if (!ok) return;
    _showStep(2);
    speak('payment_voice_step2');

  } else if (currentStep === 2) {
    const ok = _validateStep2();
    if (!ok) return;
    _buildReviewScreen();
    _showStep(3);
    // Read the review aloud after a short delay
    setTimeout(_readReview, 400);
  }
}

/**
 * Go back one step.
 */
function prevStep() {
  if (currentStep > 1) {
    _showStep(currentStep - 1);
  }
}

/**
 * Cancel the payment and return to the dashboard.
 */
function cancelPayment() {
  window.location.href = 'home.html';
}

/**
 * The user confirms the payment — show the simulated result screen.
 * This function is only called when the user explicitly clicks "Confirm".
 */
function confirmPayment() {
  _showResult();
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function _validateStep1() {
  const dropdown  = document.getElementById('recipient-select');
  const textInput = document.getElementById('recipient-text');
  const phoneInput = document.getElementById('recipient-phone');
  const err = document.getElementById('err-recipient');

  const dropVal  = dropdown  ? dropdown.value.trim()  : '';
  const textVal  = textInput ? textInput.value.trim()  : '';

  chosenRecipient = dropVal || textVal;
  chosenPhone     = phoneInput ? phoneInput.value.trim() : '';

  if (!chosenRecipient) {
    err.textContent = t('err_no_recipient');
    err.style.display = 'block';
    return false;
  }

  err.style.display = 'none';

  // Check for suspicious keywords in free-text entry
  _checkSuspiciousRecipient(chosenRecipient);

  return true;
}

function _validateStep2() {
  const input = document.getElementById('amount-input');
  const err   = document.getElementById('err-amount');

  const val = input ? input.value.trim() : '';

  if (!val) {
    err.textContent = t('err_no_amount');
    err.style.display = 'block';
    return false;
  }

  const num = parseFloat(val);

  if (isNaN(num) || num <= 0 || !Number.isFinite(num)) {
    err.textContent = t('err_invalid_amount');
    err.style.display = 'block';
    return false;
  }

  err.style.display = 'none';
  chosenAmount = num;

  // Show large-amount warning (educational, not a fraud guarantee)
  const warnBox = document.getElementById('warn-large-amount');
  if (warnBox) {
    warnBox.style.display = num > 10000 ? 'block' : 'none';
  }

  return true;
}

// ---------------------------------------------------------------------------
// Suspicious recipient check
// ---------------------------------------------------------------------------

function _checkSuspiciousRecipient(name) {
  const lower = name.toLowerCase();
  const isSuspicious = SUSPICIOUS_KEYWORDS.some(kw => lower.includes(kw));
  const warnBox = document.getElementById('warn-suspicious');
  if (warnBox) {
    warnBox.style.display = isSuspicious ? 'block' : 'none';
  }
}

// ---------------------------------------------------------------------------
// Review screen
// ---------------------------------------------------------------------------

function _buildReviewScreen() {
  const amountEl    = document.getElementById('review-amount');
  const recipientEl = document.getElementById('review-recipient');
  const questionEl  = document.getElementById('review-question');

  if (amountEl)    amountEl.textContent    = '₹' + chosenAmount.toLocaleString('en-IN');
  if (recipientEl) recipientEl.textContent = chosenRecipient;
  if (questionEl)  questionEl.textContent  = t('review_question');

  // Update "Sending __ to __" text
  const sendingLabel = document.getElementById('review-sending-label');
  if (sendingLabel) {
    sendingLabel.textContent =
      t('review_sending') + ' ₹' + chosenAmount.toLocaleString('en-IN') +
      ' ' + t('review_to') + ' ' + chosenRecipient;
  }
}

function _readReview() {
  // Build the review text then sanitise it before speaking:
  // strip any isolated digit sequences (4+ digits) to prevent
  // accidentally speaking a PIN, OTP or account number.
  const raw =
    t('payment_voice_step3') + ' ₹' +
    chosenAmount.toLocaleString('en-IN') + ' ' +
    t('review_to') + ' ' + _sanitiseForSpeech(chosenRecipient) + '. ' +
    t('review_question');
  speakRaw(raw);
}

/**
 * Remove sequences of 4 or more consecutive digits from a string
 * before it is spoken aloud.  This prevents any accidentally entered
 * PIN, OTP or bank account number from being read out.
 *
 * Examples:
 *   "Anita 123456"  →  "Anita"
 *   "Ravi Kumar"    →  "Ravi Kumar"   (no change — no digit run ≥ 4)
 *   "₹500"          →  "₹500"         (3 digits — allowed, it's the amount)
 *
 * @param {string} text
 * @returns {string}
 */
function _sanitiseForSpeech(text) {
  // Replace runs of 4 or more digits (with optional spaces/dashes between)
  // with a blank so the voice never speaks them.
  return text.replace(/\d[\d\s\-]{3,}\d/g, '').trim();
}

// ---------------------------------------------------------------------------
// Result screen
// ---------------------------------------------------------------------------

function _showResult() {
  // Hide all steps
  document.querySelectorAll('.payment-step').forEach(el => el.classList.remove('active'));

  const resultSection = document.getElementById('payment-result');
  if (resultSection) {
    resultSection.style.display = 'block';

    // Fill in result details
    document.getElementById('result-recipient').textContent = chosenRecipient;
    document.getElementById('result-amount').textContent    = '₹' + chosenAmount.toLocaleString('en-IN');

    // Generate a fake reference number for realism
    document.getElementById('result-ref').textContent =
      'DEMO' + Math.floor(100000 + Math.random() * 900000);
  }

  // Update step dots
  _updateStepDots(4);

  // Speak the result — sanitise recipient name before speaking
  setTimeout(() => {
    speakRaw(
      t('result_heading') + '. ' +
      t('review_sending') + ' ₹' + chosenAmount.toLocaleString('en-IN') +
      ' ' + t('review_to') + ' ' + _sanitiseForSpeech(chosenRecipient) + '. ' +
      t('result_banner')
    );
  }, 400);
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

function _showStep(n) {
  currentStep = n;

  document.querySelectorAll('.payment-step').forEach(el => {
    el.classList.remove('active');
  });

  const step = document.getElementById('step-' + n);
  if (step) step.classList.add('active');

  _updateStepDots(n);
}

function _updateStepDots(currentN) {
  [1, 2, 3].forEach(n => {
    const dot  = document.getElementById('dot-' + n);
    const line = document.getElementById('line-' + n);
    if (!dot) return;

    dot.classList.remove('active', 'done');
    if (n < currentN)  dot.classList.add('done');
    if (n === currentN) dot.classList.add('active');

    if (line) {
      line.classList.toggle('done', n < currentN);
    }
  });
}

function _buildRecipientOptions() {
  const select = document.getElementById('recipient-select');
  if (!select) return;

  // First option is a prompt
  const prompt = document.createElement('option');
  prompt.value = '';
  prompt.textContent = '— Select a recipient —';
  select.appendChild(prompt);

  DEMO_RECIPIENTS.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.name;
    opt.textContent = r.name;
    select.appendChild(opt);
  });
}

// Exposed as public so payment.html voice commands can call it
function readCurrentStep() { _readCurrentStepInternal(); }
function _readCurrentStepInternal() {
  if (currentStep === 1) speak('payment_voice_step1');
  else if (currentStep === 2) speak('payment_voice_step2');
  else if (currentStep === 3) _readReview();
}

function _bindEvents() {
  // When dropdown changes, clear the text input and vice versa
  const dropdown  = document.getElementById('recipient-select');
  const textInput = document.getElementById('recipient-text');

  if (dropdown && textInput) {
    dropdown.addEventListener('change', () => {
      if (dropdown.value) textInput.value = '';
    });
    textInput.addEventListener('input', () => {
      if (textInput.value.trim()) dropdown.value = '';
    });
  }

  // Allow pressing Enter in the amount field to advance
  const amountInput = document.getElementById('amount-input');
  if (amountInput) {
    amountInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') nextStep();
    });
  }
}

// ---------------------------------------------------------------------------
// Voice mic input for name and phone fields
// ---------------------------------------------------------------------------

/**
 * Wire up the 🎤 buttons on Step 1.
 * Each button starts a one-shot SpeechRecognition session and places
 * the result in the associated input field.
 *
 * SECURITY NOTE:
 *   - Phone number input via voice: the recognised text is shown to the
 *     user for visual confirmation before it is accepted. They must tap
 *     a confirm button — the field is never filled silently.
 *   - PIN / OTP entry via voice is NOT provided anywhere in this app.
 *   - Digits are NEVER read back aloud from the phone field.
 */
function _bindMicButtons() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  _setupMicButton('mic-name',  'recipient-text',  /* readBack= */ true,  /* isPhone= */ false);
  _setupMicButton('mic-phone', 'recipient-phone', /* readBack= */ false, /* isPhone= */ true);
}

/**
 * Set up a single mic button.
 *
 * @param {string}  btnId     - id of the 🎤 button
 * @param {string}  inputId   - id of the target input field
 * @param {boolean} readBack  - true: speak the recognised text back to user
 * @param {boolean} isPhone   - true: never speak digits (phone number security)
 */
function _setupMicButton(btnId, inputId, readBack, isPhone) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    // Grey out and show tooltip if recognition not supported
    btn.disabled = true;
    btn.title = t('mic_not_avail');
    btn.style.opacity = '0.4';
    return;
  }

  btn.addEventListener('click', () => {
    // Stop any current speech first
    stopSpeaking();

    const recognition = new SpeechRecognition();
    recognition.lang        = _langCode();
    recognition.continuous  = false;
    recognition.maxAlternatives = 1;

    // Visual feedback: button pulses while listening
    btn.textContent = '🔴';
    btn.setAttribute('aria-label', t('mic_listening'));

    // Show status
    _setMicStatus(btnId, t('mic_listening'));

    recognition.onresult = (e) => {
      const heard = e.results[0][0].transcript.trim();

      // For phone fields: never read back — just show a visual confirm toast
      if (isPhone) {
        _showMicConfirm(heard, input, btnId);
      } else {
        // For name fields: show confirm toast AND speak the name back
        _showMicConfirm(heard, input, btnId);
        if (readBack) {
          // Sanitise before speaking — remove digit runs ≥ 4 for safety
          const safe = _sanitiseForSpeech(heard);
          if (safe) speakRaw(t('mic_heard') + ' ' + safe);
        }
      }
    };

    recognition.onerror = (e) => {
      _resetMicBtn(btn);
      _clearMicStatus(btnId);
      if (e.error === 'not-allowed') {
        _setMicStatus(btnId, t('mic_permission_denied'));
      } else {
        _setMicStatus(btnId, 'Could not hear. Try again.');
      }
    };

    recognition.onend = () => {
      _resetMicBtn(btn);
    };

    try {
      recognition.start();
    } catch (_) {
      _resetMicBtn(btn);
    }
  });
}

/**
 * Show an inline confirmation strip below an input.
 * The user must tap "Use this" before the text goes into the field.
 *
 * @param {string}      heard   - what was recognised
 * @param {HTMLElement} input   - the target input element
 * @param {string}      btnId   - id of the mic button (for status clear)
 */
function _showMicConfirm(heard, input, btnId) {
  // Remove any existing confirm strip for this input
  const existing = input.parentNode.querySelector('.mic-confirm-strip');
  if (existing) existing.remove();

  const strip = document.createElement('div');
  strip.className = 'mic-confirm-strip';
  strip.style.cssText =
    'margin-top:6px; background:#eef4fc; border:2px solid var(--color-primary);' +
    'border-radius:8px; padding:8px 12px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;';

  const label = document.createElement('span');
  label.style.flex = '1';
  label.textContent = t('mic_heard') + ' "' + heard + '"';

  const useBtn = document.createElement('button');
  useBtn.type = 'button';
  useBtn.className = 'btn btn-success';
  useBtn.style.cssText = 'min-height:36px; padding:4px 14px; font-size:14px;';
  useBtn.textContent = t('mic_tap_confirm');

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'btn btn-ghost';
  retryBtn.style.cssText = 'min-height:36px; padding:4px 14px; font-size:14px;';
  retryBtn.textContent = '🔄';
  retryBtn.setAttribute('aria-label', 'Try again');

  useBtn.addEventListener('click', () => {
    input.value = heard;
    // If this was the name field and a demo dropdown is above it, clear it
    const dropdown = document.getElementById('recipient-select');
    if (dropdown && input.id === 'recipient-text') dropdown.value = '';
    strip.remove();
    _clearMicStatus(btnId);
  });

  retryBtn.addEventListener('click', () => {
    strip.remove();
    document.getElementById(btnId).click();
  });

  strip.appendChild(label);
  strip.appendChild(useBtn);
  strip.appendChild(retryBtn);

  // Insert the confirm strip after the flex row containing the input
  input.parentNode.insertAdjacentElement('afterend', strip);

  _clearMicStatus(btnId);
}

function _langCode() {
  const map = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN', te: 'te-IN' };
  return map[getLanguage()] || 'en-IN';
}

function _resetMicBtn(btn) {
  btn.textContent = '🎤';
  btn.setAttribute('aria-label', 'Speak');
}

function _setMicStatus(btnId, msg) {
  // Re-use the page's existing error/status elements or create a small inline note
  const area = document.getElementById('err-recipient');
  if (area && msg) {
    area.textContent = msg;
    area.style.display = 'block';
    area.style.color = 'var(--color-primary)';
  }
}

function _clearMicStatus(btnId) {
  const area = document.getElementById('err-recipient');
  if (area) {
    area.style.display = 'none';
    area.style.color = '';
  }
}
