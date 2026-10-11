/**
 * js/safety.js — Safety Tips & Awareness Lessons
 * ------------------------------------------------
 * Handles the interactive behaviour on safety.html and awareness.html.
 *
 * SAFETY PAGE
 * -----------
 *  initSafety()       — set up expand/collapse cards, register page reader
 *  readSafetyTip(n)   — speak a specific tip by index (1-based)
 *
 * AWARENESS PAGE
 * --------------
 *  initAwareness()    — set up lesson slides and quiz logic
 *
 * DEPENDENCIES
 * ------------
 *  languages.js must be loaded first (provides t(), speak(), etc.)
 *  voice.js must be loaded first (provides speak(), speakRaw(), registerPageReader())
 */

// ===========================================================================
// SAFETY PAGE
// ===========================================================================

/**
 * Content for each safety tip.
 * Keys match the translation keys in languages.js (tip1_title, tip1_body, etc.)
 * Icons are emoji for maximum compatibility without external assets.
 */
const SAFETY_TIPS = [
  { icon: '🔒', titleKey: 'tip1_title', bodyKey: 'tip1_body' },
  { icon: '📱', titleKey: 'tip2_title', bodyKey: 'tip2_body' },
  { icon: '📸', titleKey: 'tip3_title', bodyKey: 'tip3_body' },
  { icon: '🔗', titleKey: 'tip4_title', bodyKey: 'tip4_body' },
  { icon: '🆘', titleKey: 'tip5_title', bodyKey: 'tip5_body' },
];

/**
 * Set up the safety tips page.
 * Builds the expandable cards and registers the page reader.
 */
function initSafety() {
  const container = document.getElementById('safety-cards');
  if (!container) return;

  SAFETY_TIPS.forEach((tip, index) => {
    const card = _buildSafetyCard(tip, index + 1);
    container.appendChild(card);
  });

  // Register what "Read Aloud" does on this page:
  // reads the page intro, then all tip headings
  registerPageReader(() => {
    const intro = t('safety_intro');
    const headings = SAFETY_TIPS.map(tip => t(tip.titleKey)).join('. ');
    speakRaw(intro + '. ' + headings);
  });
}

/**
 * Build a single expandable safety tip card.
 * @param {{ icon, titleKey, bodyKey }} tip
 * @param {number} index - 1-based position
 * @returns {HTMLElement}
 */
function _buildSafetyCard(tip, index) {
  const card = document.createElement('div');
  card.className = 'info-card';

  // Header button (toggles the body open/closed)
  const header = document.createElement('button');
  header.className = 'info-card-header';
  header.id = 'tip-header-' + index;
  header.setAttribute('aria-expanded', 'false');
  header.setAttribute('aria-controls', 'tip-body-' + index);

  header.innerHTML =
    '<span aria-hidden="true">' + tip.icon + '</span>' +
    '<span data-i18n="' + tip.titleKey + '">' + t(tip.titleKey) + '</span>' +
    '<span class="card-toggle" aria-hidden="true">▼</span>';

  // "Read this tip" button inside the header area
  const readBtn = document.createElement('button');
  readBtn.className = 'btn btn-ghost voice-btn';
  readBtn.style.cssText = 'min-height:36px; padding:4px 12px; font-size:13px; margin-left:auto;';
  readBtn.setAttribute('aria-label', 'Read tip ' + index + ' aloud');
  readBtn.textContent = '🔊';
  readBtn.addEventListener('click', (e) => {
    e.stopPropagation();  // prevent triggering the expand/collapse
    readSafetyTip(index);
  });

  // Body (hidden by default)
  const body = document.createElement('div');
  body.className = 'info-card-body';
  body.id = 'tip-body-' + index;
  body.setAttribute('role', 'region');
  body.setAttribute('aria-labelledby', 'tip-header-' + index);

  const bodyText = document.createElement('p');
  bodyText.setAttribute('data-i18n', tip.bodyKey);
  bodyText.textContent = t(tip.bodyKey);
  body.appendChild(bodyText);

  // Special: add cybercrime link on last tip
  if (index === SAFETY_TIPS.length) {
    const link = document.createElement('p');
    link.style.marginTop = 'var(--space-sm)';
    link.innerHTML =
      '🌐 <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">' +
      'cybercrime.gov.in</a> — National Cyber Crime Reporting Portal';
    body.appendChild(link);

    const helpline = document.createElement('p');
    helpline.innerHTML =
      '📞 Cyber Crime Helpline: <strong>1930</strong> (India)';
    body.appendChild(helpline);
  }

  // Toggle behaviour
  header.addEventListener('click', () => {
    const isOpen = header.getAttribute('aria-expanded') === 'true';
    header.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    body.classList.toggle('open', !isOpen);
  });

  card.appendChild(header);
  card.appendChild(body);

  return card;
}

/**
 * Speak a safety tip by index (1-based).
 * @param {number} index
 */
function readSafetyTip(index) {
  const tip = SAFETY_TIPS[index - 1];
  if (!tip) return;
  const text = t(tip.titleKey) + '. ' + t(tip.bodyKey);
  speakRaw(text);

  // Also expand the card so users can follow along
  const header = document.getElementById('tip-header-' + index);
  const body   = document.getElementById('tip-body-' + index);
  if (header && body) {
    header.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  }
}


// ===========================================================================
// AWARENESS PAGE
// ===========================================================================

/**
 * Lesson and quiz data.
 *
 * Each lesson is an array of slide objects: { heading, body, icon }.
 * After the last slide, a short quiz is offered.
 */
const LESSONS = [
  {
    id: 'lesson1',
    titleKey: 'lesson1_title',
    slides: [
      {
        icon: '📲',
        heading: 'What is UPI?',
        body: 'UPI stands for Unified Payments Interface. It is a system built by the National Payments Corporation of India (NPCI) that lets you send and receive money instantly using just a phone number or a UPI ID.',
      },
      {
        icon: '🏦',
        heading: 'How does UPI work?',
        body: 'UPI links your bank account to a mobile app. When you make a payment, the money moves directly from your bank account to the recipient\'s bank account — no cash, no cheque.',
      },
      {
        icon: '✅',
        heading: 'Popular UPI Apps',
        body: 'Some widely-used UPI apps are: BHIM (by NPCI), PhonePe, Google Pay (GPay), Paytm, and your bank\'s own app. Always download apps from the official app store.',
      },
    ],
    quiz: [
      {
        question: 'UPI stands for:',
        options: [
          'Unified Payments Interface',
          'Universal Payment Index',
          'Unique PIN Interface',
          'Unified Personal Instrument',
        ],
        correct: 0,
      },
      {
        question: 'Where should you download a UPI app from?',
        options: [
          'Any website that offers it',
          'A link sent by SMS',
          'The official app store (Play Store / App Store)',
          'Your friend\'s phone',
        ],
        correct: 2,
      },
    ],
  },

  {
    id: 'lesson2',
    titleKey: 'lesson2_title',
    slides: [
      {
        icon: '🔍',
        heading: 'How to Check if a Payment Went Through',
        body: 'After making a payment, always check your official banking app or UPI app for a transaction confirmation. Look for the transaction in your history.',
      },
      {
        icon: '📋',
        heading: 'Where to Check',
        body: 'Open your UPI app → tap "History" or "Transactions". A successful payment will show "Paid" with the recipient name, amount and a transaction ID.',
      },
      {
        icon: '⚠️',
        heading: 'Never Trust Only a Screenshot',
        body: 'Screenshots can be easily faked. If someone shows you a screenshot claiming they have paid you, always verify by checking your own app or bank statement — not their screenshot.',
      },
    ],
    quiz: [
      {
        question: 'The best way to confirm a payment was received is to:',
        options: [
          'Trust the screenshot the sender shows you',
          'Check your own bank app or UPI transaction history',
          'Ask a friend',
          'Wait for a call from the bank',
        ],
        correct: 1,
      },
      {
        question: 'A "transaction ID" is:',
        options: [
          'Your UPI PIN',
          'A unique number that proves a transaction happened — visible in your app',
          'Your bank account number',
          'A code you create yourself',
        ],
        correct: 1,
      },
    ],
  },

  {
    id: 'lesson3',
    titleKey: 'lesson3_title',
    slides: [
      {
        icon: '🎣',
        heading: 'What is a Payment Scam?',
        body: 'A payment scam happens when someone tricks you into sending them money or sharing your banking details. Scammers often pretend to be bank officials, government employees, or someone offering prizes.',
      },
      {
        icon: '🚩',
        heading: 'Common Warning Signs',
        body: '• Someone asks for your UPI PIN or OTP.\n• You receive a "request money" notification from a stranger.\n• Someone promises you a prize, lottery win, or government refund.\n• A caller says your account will be blocked unless you act immediately.\n• Someone asks you to install software on your phone.',
      },
      {
        icon: '🛡️',
        heading: 'How to Stay Safe',
        body: 'Never share your PIN or OTP with anyone. Hang up on suspicious callers. Call your bank directly on the number on their official website if you are unsure. Report fraud to 1930 or cybercrime.gov.in.',
      },
    ],
    quiz: [
      {
        question: 'A stranger sends you a UPI "Collect Request" asking for money. You should:',
        options: [
          'Accept it if they say it is a government refund',
          'Decline it and report if suspicious',
          'Share your PIN to verify',
          'Call them back on the number they gave you',
        ],
        correct: 1,
      },
      {
        question: 'If someone asks for your OTP, you should:',
        options: [
          'Share it if they claim to be from your bank',
          'Share only the last 4 digits',
          'Never share it with anyone — hang up',
          'Share it if the call comes from a phone number',
        ],
        correct: 2,
      },
    ],
  },
];

// Current lesson/slide state
let _currentLessonIndex = 0;
let _currentSlideIndex  = 0;
let _inQuiz             = false;
let _currentQuizIndex   = 0;
let _quizAnswered       = [];

/**
 * Set up the awareness page.
 */
function initAwareness() {
  _renderLessonMenu();

  // Register page reader
  registerPageReader(() => {
    const lesson = LESSONS[_currentLessonIndex];
    if (lesson && lesson.slides[_currentSlideIndex]) {
      const slide = lesson.slides[_currentSlideIndex];
      speakRaw(slide.heading + '. ' + slide.body);
    }
  });
}

/**
 * Render the lesson selection menu and the first lesson's first slide.
 */
function _renderLessonMenu() {
  const menuContainer = document.getElementById('lesson-menu');
  if (menuContainer) {
    menuContainer.innerHTML = '';
    LESSONS.forEach((lesson, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn ' + (idx === 0 ? 'btn-primary' : 'btn-ghost');
      btn.textContent = (idx + 1) + '. ' + t(lesson.titleKey);
      btn.setAttribute('data-lesson', idx);
      btn.addEventListener('click', () => openLesson(idx));
      menuContainer.appendChild(btn);
    });
  }

  openLesson(0);
}

/**
 * Open a lesson and show its first slide.
 * @param {number} lessonIndex
 */
function openLesson(lessonIndex) {
  _currentLessonIndex = lessonIndex;
  _currentSlideIndex  = 0;
  _inQuiz             = false;
  _currentQuizIndex   = 0;
  _quizAnswered       = [];

  // Highlight active lesson button
  document.querySelectorAll('[data-lesson]').forEach(btn => {
    const isActive = parseInt(btn.dataset.lesson) === lessonIndex;
    btn.className = 'btn ' + (isActive ? 'btn-primary' : 'btn-ghost');
  });

  _renderSlide();
}

/**
 * Render the current slide.
 */
function _renderSlide() {
  const lesson = LESSONS[_currentLessonIndex];
  const slide  = lesson.slides[_currentSlideIndex];
  const total  = lesson.slides.length;

  const slideArea = document.getElementById('slide-area');
  if (!slideArea) return;

  slideArea.innerHTML = '';

  // Slide content
  const slideEl = document.createElement('div');
  slideEl.className = 'card lesson-slide active';
  slideEl.style.marginBottom = 'var(--space-md)';

  // Progress
  const progress = document.createElement('p');
  progress.className = 'muted';
  progress.style.marginBottom = 'var(--space-sm)';
  progress.textContent =
    t(lesson.titleKey) + ' · Slide ' + (_currentSlideIndex + 1) + ' of ' + total;

  const icon = document.createElement('div');
  icon.style.cssText = 'font-size:52px; margin-bottom:var(--space-sm);';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = slide.icon;

  const heading = document.createElement('h3');
  heading.textContent = slide.heading;

  const body = document.createElement('p');
  body.style.whiteSpace = 'pre-line';
  body.textContent = slide.body;

  // Read aloud this slide
  const readBtn = document.createElement('button');
  readBtn.className = 'btn btn-ghost';
  readBtn.style.marginTop = 'var(--space-sm)';
  readBtn.textContent = t('read_aloud');
  readBtn.addEventListener('click', () => speakRaw(slide.heading + '. ' + slide.body));

  slideEl.appendChild(progress);
  slideEl.appendChild(icon);
  slideEl.appendChild(heading);
  slideEl.appendChild(body);
  slideEl.appendChild(readBtn);

  slideArea.appendChild(slideEl);

  // Navigation buttons
  const navRow = document.createElement('div');
  navRow.className = 'btn-group';

  if (_currentSlideIndex > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-ghost';
    prevBtn.setAttribute('data-i18n', 'btn_prev_slide');
    prevBtn.textContent = t('btn_prev_slide');
    prevBtn.addEventListener('click', prevSlide);
    navRow.appendChild(prevBtn);
  }

  if (_currentSlideIndex < total - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.setAttribute('data-i18n', 'btn_next_slide');
    nextBtn.textContent = t('btn_next_slide');
    nextBtn.addEventListener('click', nextSlide);
    navRow.appendChild(nextBtn);
  } else {
    // Last slide — offer quiz
    const quizBtn = document.createElement('button');
    quizBtn.className = 'btn btn-success';
    quizBtn.setAttribute('data-i18n', 'btn_quiz');
    quizBtn.textContent = t('btn_quiz');
    quizBtn.addEventListener('click', startQuiz);
    navRow.appendChild(quizBtn);
  }

  const homeBtn = document.createElement('button');
  homeBtn.className = 'btn btn-ghost';
  homeBtn.textContent = t('nav_home');
  homeBtn.addEventListener('click', () => window.location.href = 'home.html');
  navRow.appendChild(homeBtn);

  slideArea.appendChild(navRow);
}

function nextSlide() {
  const lesson = LESSONS[_currentLessonIndex];
  if (_currentSlideIndex < lesson.slides.length - 1) {
    _currentSlideIndex++;
    _renderSlide();
  }
}

function prevSlide() {
  if (_currentSlideIndex > 0) {
    _currentSlideIndex--;
    _renderSlide();
  }
}

/**
 * Start the quiz for the current lesson.
 */
function startQuiz() {
  _inQuiz           = true;
  _currentQuizIndex = 0;
  _quizAnswered     = [];
  _renderQuizQuestion();
}

function _renderQuizQuestion() {
  const lesson    = LESSONS[_currentLessonIndex];
  const questions = lesson.quiz;

  if (_currentQuizIndex >= questions.length) {
    _renderQuizComplete();
    return;
  }

  const q = questions[_currentQuizIndex];
  const slideArea = document.getElementById('slide-area');
  if (!slideArea) return;

  slideArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.marginBottom = 'var(--space-md)';

  const title = document.createElement('h3');
  title.textContent = t('quiz_title') + ' — ' + (_currentQuizIndex + 1) + ' of ' + questions.length;
  title.style.marginBottom = 'var(--space-sm)';

  const qText = document.createElement('p');
  qText.style.fontWeight = '600';
  qText.style.fontSize   = 'var(--font-size-lg)';
  qText.textContent = q.question;

  card.appendChild(title);
  card.appendChild(qText);

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => _answerQuiz(idx, q.correct, card));
    card.appendChild(btn);
  });

  slideArea.appendChild(card);
}

function _answerQuiz(chosen, correct, card) {
  // Disable all option buttons
  card.querySelectorAll('.quiz-option').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correct) btn.classList.add('correct');
    if (idx === chosen && idx !== correct) btn.classList.add('wrong');
  });

  _quizAnswered.push(chosen === correct);

  // Advance after short delay
  setTimeout(() => {
    _currentQuizIndex++;
    _renderQuizQuestion();
  }, 1500);
}

function _renderQuizComplete() {
  const score = _quizAnswered.filter(Boolean).length;
  const total = _quizAnswered.length;

  const slideArea = document.getElementById('slide-area');
  if (!slideArea) return;

  slideArea.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.textAlign = 'center';

  const icon = document.createElement('div');
  icon.style.fontSize = '56px';
  icon.textContent = score === total ? '🎉' : '👍';

  const msg = document.createElement('h2');
  msg.style.color = 'var(--color-accent)';
  msg.textContent = t('quiz_well_done');

  const scoreEl = document.createElement('p');
  scoreEl.style.fontSize = 'var(--font-size-lg)';
  scoreEl.textContent = 'Score: ' + score + ' / ' + total;

  const btnRow = document.createElement('div');
  btnRow.className = 'btn-group';
  btnRow.style.justifyContent = 'center';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'btn btn-ghost';
  restartBtn.textContent = t('btn_restart');
  restartBtn.addEventListener('click', () => openLesson(_currentLessonIndex));

  const homeBtn = document.createElement('button');
  homeBtn.className = 'btn btn-primary';
  homeBtn.textContent = t('nav_home');
  homeBtn.addEventListener('click', () => window.location.href = 'home.html');

  btnRow.appendChild(restartBtn);
  btnRow.appendChild(homeBtn);

  card.appendChild(icon);
  card.appendChild(msg);
  card.appendChild(scoreEl);
  card.appendChild(btnRow);

  slideArea.appendChild(card);

  speakRaw(t('quiz_well_done') + ' ' + score + ' out of ' + total);
}
