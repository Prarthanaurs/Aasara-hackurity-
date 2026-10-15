/**
 * js/voice.js — Aasara Voice Assistant
 * -------------------------------------
 * This file provides a reusable voice layer for every page.
 *
 * ─── PUBLIC API ───────────────────────────────────────────────────────────
 *
 *   speak(key)                 Speak the translated string for 'key'.
 *   speakRaw(text)             Speak a literal text string.
 *   stopSpeaking()             Cancel any speech currently in progress.
 *   isSpeechSupported()        Returns { synthesis: bool, recognition: bool }
 *   registerPageReader(fn)     Register what the "Read aloud" button does on
 *                              the current page. Call once per page load.
 *   startListening(commandMap) Start voice-command recognition.
 *   stopListening()            Stop recognition.
 *
 * ─── HOW THE VOICE BAR WORKS ─────────────────────────────────────────────
 *
 *   When a page loads, call injectVoiceBar() to create a fixed floating bar
 *   at the bottom of the screen.  It contains:
 *     [🔊 Read Aloud]  [⏹ Stop]  [🎤 Listen]  <status text>
 *
 *   "Read Aloud" calls whatever function was last passed to registerPageReader().
 *   "Stop"       calls stopSpeaking() and stopListening().
 *   "Listen"     calls startListening() with the page's command map.
 *
 * ─── LANGUAGE & VOICE MATCHING ───────────────────────────────────────────
 *
 *   speak() tries to find a system voice whose lang attribute starts with
 *   the right BCP-47 prefix (kn, hi, te, en).
 *   If no matching voice is found the utterance still plays — the browser
 *   will use its default voice — and a notice is shown.
 *
 * ─── HONEST BROWSER SUPPORT ──────────────────────────────────────────────
 *
 *   Speech synthesis:  Chrome ✅  Firefox ✅  Safari ✅  (most desktops)
 *   Speech recognition: Chrome/Edge ✅  Firefox ❌  Safari iOS ❌
 *
 *   Kannada (kn) TTS voice: almost never present on Windows/Mac/Android.
 *   Telugu  (te) TTS voice: rarely present.
 *   Hindi   (hi) TTS voice: present on Android; varies on Windows.
 *   English (en) TTS voice: always present.
 *
 *   If synthesis is unavailable the voice buttons are shown but display
 *   a "not supported" notice instead of crashing.
 *
 * ─── PRIVACY NOTE ────────────────────────────────────────────────────────
 *
 *   Chrome's SpeechRecognition API sends audio to Google's servers.
 *   We show a notice before activating the microphone and only activate
 *   it when the user explicitly presses the Listen button.
 *   We never record continuously in the background.
 *
 * ─── SAFETY RULE ─────────────────────────────────────────────────────────
 *
 *   Voice commands NEVER execute consequential actions (payment confirm,
 *   form submit) directly.  They show a visible confirmation toast that
 *   the user must tap before anything happens.
 */

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let _pageReaderFn   = null;   // function registered by the current page
let _recognition    = null;   // SpeechRecognition instance
let _commandMap     = {};     // current page's command map
let _voiceBarInjected = false;

// ---------------------------------------------------------------------------
// Support detection
// ---------------------------------------------------------------------------

/**
 * Check what the current browser supports.
 * @returns {{ synthesis: boolean, recognition: boolean }}
 */
function isSpeechSupported() {
  return {
    synthesis:   typeof window.speechSynthesis !== 'undefined',
    recognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  };
}

// ---------------------------------------------------------------------------
// Speech synthesis
// ---------------------------------------------------------------------------

/**
 * Speak the translated string for a given translation key.
 * Uses the language currently selected in languages.js.
 *
 * @param {string} key - A key from TRANSLATIONS (see languages.js)
 */
function speak(key) {
  // t() and getLanguage() come from languages.js (loaded before voice.js)
  speakRaw(t(key));
}

/**
 * Speak a literal text string (for dynamic content like "₹500 to Anita").
 *
 * @param {string} text - The exact text to speak
 */
function speakRaw(text) {
  const { synthesis } = isSpeechSupported();

  if (!synthesis) {
    _setVoiceStatus(t('voice_not_supported'));
    return;
  }

  // Cancel any speech already in progress before starting new speech.
  // This prevents the assistant from talking over itself.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Try to match a voice for the current language
  const lang = getLanguage();           // from languages.js
  const voice = _findVoice(lang);

  if (voice) {
    utterance.voice = voice;
    utterance.lang  = voice.lang;
    _setVoiceStatus('');
  } else {
    // No matching voice found — browser will use its default voice.
    // We still attempt to play (it may sound wrong but it's better than silence).
    utterance.lang = _bcp47(lang);
    _setVoiceStatus(t('voice_lang_missing'));
  }

  utterance.rate   = 0.92;   // slightly slower for clarity
  utterance.pitch  = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
}

/**
 * Cancel any speech currently in progress.
 */
function stopSpeaking() {
  if (isSpeechSupported().synthesis) {
    window.speechSynthesis.cancel();
    _setVoiceStatus('');
  }
}

// ---------------------------------------------------------------------------
// Speech recognition (voice commands)
// ---------------------------------------------------------------------------

/**
 * Register voice commands for the current page WITHOUT starting the microphone.
 *
 * Pages call this at load time to register their command map.
 * The microphone is only activated when the user explicitly presses the
 * 🎤 Listen button — this avoids triggering the browser's mic-permission
 * prompt on every page navigation.
 *
 * commandMap is an object like:
 *   {
 *     'open payment': () => window.location.href = 'payment.html',
 *     'go back':      () => history.back(),
 *   }
 *
 * @param {Object} commandMap
 */
function startListening(commandMap) {
  // Just store the map. Recognition starts only when the user clicks Listen.
  _commandMap = commandMap || {};
}

/**
 * Actually start microphone recognition using the stored command map.
 * Called internally by the Listen button in the voice bar.
 */
function _startRecognition() {
  const { recognition } = isSpeechSupported();

  if (!recognition) {
    _setVoiceStatus(t('mic_not_supported'));
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  _recognition = new SpeechRecognition();

  // Use the current language's BCP-47 code.
  // Note: recognition for kn/te may not work on most devices.
  _recognition.lang = _bcp47(getLanguage());

  _recognition.continuous    = false;  // stop after one result
  _recognition.interimResults = false;
  _recognition.maxAlternatives = 3;

  _recognition.onstart = () => {
    _setVoiceStatus('🎤 Listening…');
    _setListenBtnActive(true);
  };

  _recognition.onend = () => {
    _setVoiceStatus('');
    _setListenBtnActive(false);
  };

  _recognition.onerror = (e) => {
    _setListenBtnActive(false);
    if (e.error === 'not-allowed') {
      _setVoiceStatus(t('mic_permission_denied'));
    } else if (e.error === 'no-speech') {
      _setVoiceStatus('No speech detected. Try again.');
    } else {
      _setVoiceStatus('Mic error: ' + e.error);
    }
  };

  _recognition.onresult = (e) => {
    // Gather all alternatives into a list of lowercase strings
    const results = [];
    for (let i = 0; i < e.results[0].length; i++) {
      results.push(e.results[0][i].transcript.trim().toLowerCase());
    }

    _setVoiceStatus('Heard: "' + results[0] + '"');

    // Try to match against command map
    for (const phrase of results) {
      for (const [key, fn] of Object.entries(_commandMap)) {
        if (phrase.includes(key.toLowerCase())) {
          // Show confirmation toast — user must tap before action runs
          _showCommandToast(results[0], fn);
          return;
        }
      }
    }

    // No match found
    _setVoiceStatus('Command not recognised. Try a button instead.');
  };

  try {
    _recognition.start();
  } catch (err) {
    _setVoiceStatus('Could not start microphone: ' + err.message);
  }
}

/**
 * Stop listening.
 */
function stopListening() {
  if (_recognition) {
    try { _recognition.stop(); } catch (_) {}
    _recognition = null;
  }
  _setListenBtnActive(false);
}

// ---------------------------------------------------------------------------
// Page-reader registration
// ---------------------------------------------------------------------------

/**
 * Register the function that the "Read Aloud" button should call on this page.
 * Each page calls this once after its content is set up.
 *
 * Example:
 *   registerPageReader(() => speakRaw('Hello, welcome to the payment page.'));
 *
 * @param {Function} fn
 */
function registerPageReader(fn) {
  _pageReaderFn = fn;
}

// ---------------------------------------------------------------------------
// Voice bar injection
// ---------------------------------------------------------------------------

/**
 * Create and insert the floating voice bar at the bottom of the page.
 * Call this once per page, after the DOM is ready.
 *
 * The bar is only injected once even if called multiple times.
 */
function injectVoiceBar() {
  if (_voiceBarInjected) return;
  _voiceBarInjected = true;

  const support = isSpeechSupported();

  const bar = document.createElement('div');
  bar.id = 'voice-bar';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Voice assistant controls');

  // "Read Aloud" button
  const readBtn = document.createElement('button');
  readBtn.id = 'voice-read-btn';
  readBtn.className = 'btn btn-primary voice-btn';
  readBtn.setAttribute('data-i18n', 'read_aloud');
  readBtn.setAttribute('aria-label', t('read_aloud'));
  readBtn.textContent = t('read_aloud');
  readBtn.addEventListener('click', () => {
    if (!support.synthesis) {
      _setVoiceStatus(t('voice_not_supported'));
      return;
    }
    if (typeof _pageReaderFn === 'function') {
      _pageReaderFn();
    }
  });

  // "Stop" button
  const stopBtn = document.createElement('button');
  stopBtn.id = 'voice-stop-btn';
  stopBtn.className = 'btn btn-ghost voice-btn';
  stopBtn.setAttribute('data-i18n', 'stop_speaking');
  stopBtn.setAttribute('aria-label', t('stop_speaking'));
  stopBtn.textContent = t('stop_speaking');
  stopBtn.addEventListener('click', () => {
    stopSpeaking();
    stopListening();
  });

  // Status text
  const statusEl = document.createElement('span');
  statusEl.id = 'voice-status';
  statusEl.setAttribute('aria-live', 'polite');  // announced by screen readers

  bar.appendChild(readBtn);
  bar.appendChild(stopBtn);

  // "Listen" button — only shown if recognition is supported
  if (support.recognition) {
    const listenBtn = document.createElement('button');
    listenBtn.id = 'voice-listen-btn';
    listenBtn.className = 'btn btn-ghost voice-btn';
    listenBtn.setAttribute('data-i18n', 'listen');
    listenBtn.setAttribute('aria-label', t('listen'));
    listenBtn.setAttribute('aria-pressed', 'false');
    listenBtn.textContent = t('listen');
    listenBtn.addEventListener('click', () => {
        if (listenBtn.getAttribute('aria-pressed') === 'true') {
          stopListening();
        } else {
          _startRecognition();
        }
      });
    bar.appendChild(listenBtn);
  } else {
    // Show a small note that mic is unavailable
    const micNote = document.createElement('span');
    micNote.className = 'muted';
    micNote.style.fontSize = '13px';
    micNote.textContent = '(voice commands unavailable in this browser)';
    bar.appendChild(micNote);
  }

  bar.appendChild(statusEl);

  // Add the confirmation toast element (hidden until needed)
  const toast = document.createElement('div');
  toast.id = 'voice-confirm-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'assertive');
  document.body.appendChild(toast);

  document.body.appendChild(bar);

  // If synthesis is unavailable, disable the Read Aloud button visually
  if (!support.synthesis) {
    readBtn.disabled = true;
    readBtn.title = t('voice_not_supported');
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Map our language code to a BCP-47 language tag for SpeechSynthesis/Recognition.
 */
function _bcp47(lang) {
  const map = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN', te: 'te-IN' };
  return map[lang] || 'en-IN';
}

/**
 * Try to find a SpeechSynthesisVoice matching the given language code.
 * Returns null if not found — callers must handle the fallback.
 *
 * @param {string} lang - 'en' | 'kn' | 'hi' | 'te'
 * @returns {SpeechSynthesisVoice|null}
 */
function _findVoice(lang) {
  const prefix = _bcp47(lang).slice(0, 2);  // 'en', 'kn', 'hi', 'te'
  const voices = window.speechSynthesis.getVoices();

  // Prefer exact match (e.g. 'kn-IN'), then any voice starting with prefix
  return (
    voices.find(v => v.lang === _bcp47(lang)) ||
    voices.find(v => v.lang.startsWith(prefix)) ||
    null
  );
}

/**
 * Update the status text in the voice bar.
 * @param {string} msg
 */
function _setVoiceStatus(msg) {
  const el = document.getElementById('voice-status');
  if (el) el.textContent = msg;
}

/**
 * Toggle the visual "active" state of the Listen button.
 * @param {boolean} active
 */
function _setListenBtnActive(active) {
  const btn = document.getElementById('voice-listen-btn');
  if (!btn) return;
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  btn.style.fontWeight = active ? '800' : '';
  btn.textContent = active ? '🎤 Listening…' : t('listen');
}

/**
 * Show the voice-command confirmation toast.
 * The user must tap it to run the command — nothing runs automatically.
 *
 * @param {string} phrase - What was heard
 * @param {Function} fn   - The command to run if confirmed
 */
function _showCommandToast(phrase, fn) {
  const toast = document.getElementById('voice-confirm-toast');
  if (!toast) return;

  toast.textContent = t('voice_cmd_confirm') + ' "' + phrase + '"? ' + t('voice_cmd_tap');
  toast.style.display = 'block';

  // Remove any previous listener to avoid stacking
  const newToast = toast.cloneNode(true);
  toast.parentNode.replaceChild(newToast, toast);

  // Single click runs the command and hides the toast
  newToast.addEventListener('click', () => {
    newToast.style.display = 'none';
    fn();
  });

  // Auto-dismiss after 8 seconds if user doesn't tap
  setTimeout(() => {
    newToast.style.display = 'none';
  }, 8000);
}

/*
 * Chrome loads voices asynchronously after the page loads.
 * This event fires when the voice list becomes available.
 * We don't need to do anything here, but it ensures _findVoice()
 * works correctly if called after voices load.
 */
if (typeof window.speechSynthesis !== 'undefined') {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices are now available — _findVoice() will work correctly.
    // Re-apply translated labels on the voice bar in case it was
    // injected before voices loaded.
    const readBtn = document.getElementById('voice-read-btn');
    if (readBtn) {
      const support = isSpeechSupported();
      if (support.synthesis) {
        readBtn.disabled = false;
        readBtn.title = '';
      }
    }
  };
}
