/**
 * js/volunteer.js — Volunteer & Essential Services
 * -------------------------------------------------
 * Manages the tab-based layout on volunteer.html.
 *
 * TABS
 * ----
 *  Tab 1 — Volunteer
 *    Sub-section A: Register as a volunteer (demo form)
 *    Sub-section B: Request assistance (demo form + city matching)
 *
 *  Tab 2 — Essential Services
 *    Balance check guide (text only, no real bank connection)
 *
 * IMPORTANT LIMITATIONS (always displayed on the page)
 * -----------------------------------------------------
 *  - No data is sent to any server or stored permanently.
 *  - No real volunteer is contacted.
 *  - No real bank account is accessed.
 *  - All volunteer records are fictional demo data.
 *
 * DEPENDENCIES
 * ------------
 *  languages.js and voice.js must be loaded before this file.
 */

// ---------------------------------------------------------------------------
// Demo volunteer data
// ---------------------------------------------------------------------------
// All names, phone numbers and descriptions are fictional.

const DEMO_VOLUNTEERS = [
  { name: 'Kavitha Murthy',   city: 'Mysuru',    skills: 'UPI payments, Bank app guidance',        phone: '98xxx-xxxxx (Demo)' },
  { name: 'Suresh Patil',     city: 'Mysuru',    skills: 'Online services, phone troubleshooting', phone: '97xxx-xxxxx (Demo)' },
  { name: 'Ananya Rao',       city: 'Bengaluru', skills: 'UPI, digital literacy',                  phone: '91xxx-xxxxx (Demo)' },
  { name: 'Vikram Hegde',     city: 'Bengaluru', skills: 'Fraud awareness, safety training',       phone: '80xxx-xxxxx (Demo)' },
  { name: 'Meena Krishnaswamy', city: 'Bengaluru', skills: 'Payment apps, Aadhaar services',      phone: '77xxx-xxxxx (Demo)' },
  { name: 'Ramesh Iyer',      city: 'Hubballi',  skills: 'UPI basics, senior citizen assistance', phone: '94xxx-xxxxx (Demo)' },
  { name: 'Priya Joshi',      city: 'Hubballi',  skills: 'Digital payments, mobile banking',       phone: '95xxx-xxxxx (Demo)' },
  { name: 'Deepak Sharma',    city: 'Delhi',     skills: 'UPI, scam awareness',                   phone: '98xxx-xxxxx (Demo)' },
  { name: 'Nisha Verma',      city: 'Delhi',     skills: 'Mobile banking, senior care',            phone: '70xxx-xxxxx (Demo)' },
  { name: 'Arun Nair',        city: 'Mumbai',    skills: 'UPI payments, digital literacy',         phone: '96xxx-xxxxx (Demo)' },
  { name: 'Sneha Pillai',     city: 'Mumbai',    skills: 'Fraud prevention, payment guidance',     phone: '88xxx-xxxxx (Demo)' },
  { name: 'Gopal Reddy',      city: 'Hyderabad', skills: 'UPI, Telugu language support',           phone: '93xxx-xxxxx (Demo)' },
  { name: 'Lakshmi Devi',     city: 'Hyderabad', skills: 'Payment apps, safety awareness',         phone: '85xxx-xxxxx (Demo)' },
];

/** Cities available in the city dropdowns */
const CITIES = ['Mysuru', 'Bengaluru', 'Hubballi', 'Delhi', 'Mumbai', 'Hyderabad', 'Other'];

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Set up the volunteer page.
 * Called from volunteer.html after the DOM is ready.
 */
function initVolunteer() {
  _buildCityDropdowns();
  _bindTabButtons();
  _bindForms();

  // Open the correct tab on page load (support #services hash for direct links)
  if (window.location.hash === '#services') {
    switchTab('tab-services');
  } else {
    switchTab('tab-volunteer');
  }

  // Register page reader
  registerPageReader(() => speak('volunteer_title'));
}

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------

/**
 * Switch between the Volunteer and Essential Services tabs.
 * @param {'tab-volunteer'|'tab-services'} tabId
 */
function switchTab(tabId) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
    btn.setAttribute('aria-selected', btn.dataset.tab === tabId ? 'true' : 'false');
  });

  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
    panel.setAttribute('aria-hidden', panel.id !== tabId ? 'true' : 'false');
  });
}

// ---------------------------------------------------------------------------
// City dropdowns
// ---------------------------------------------------------------------------

function _buildCityDropdowns() {
  const dropdowns = document.querySelectorAll('.city-select');
  dropdowns.forEach(select => {
    // Prompt option
    const prompt = document.createElement('option');
    prompt.value = '';
    prompt.textContent = '— Select a city —';
    select.appendChild(prompt);

    CITIES.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      select.appendChild(opt);
    });

    // Show volunteers immediately when the REQUEST city dropdown changes.
    // Only wire this up for req-city, not reg-city.
    if (select.id === 'req-city') {
      select.addEventListener('change', () => {
        const city = select.value;
        if (!city) return;
        _showVolunteersForCity(city);
      });
    }
  });
}

/**
 * Display volunteer cards for a city in the preview area below the form
 * (immediately, without requiring form submission).
 * @param {string} city
 */
function _showVolunteersForCity(city) {
  let preview = document.getElementById('city-volunteer-preview');
  if (!preview) {
    // Create preview area below the city dropdown
    const reqCity = document.getElementById('req-city');
    if (!reqCity) return;
    preview = document.createElement('div');
    preview.id = 'city-volunteer-preview';
    preview.style.marginTop = 'var(--space-md)';
    reqCity.closest('.form-group').insertAdjacentElement('afterend', preview);
  }

  preview.innerHTML = '';

  const matches = DEMO_VOLUNTEERS.filter(v => v.city === city);

  const heading = document.createElement('p');
  heading.style.cssText = 'font-weight:700; font-size:var(--font-size-base); margin-bottom:var(--space-sm);';
  heading.textContent = matches.length
    ? t('confirm_request').replace(':', '') + ' — ' + city + ':'
    : t('no_volunteers');
  preview.appendChild(heading);

  _renderVolunteers(city, preview);
}

// ---------------------------------------------------------------------------
// Form binding
// ---------------------------------------------------------------------------

function _bindTabButtons() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function _bindForms() {
  // Register volunteer form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      _handleRegisterSubmit();
    });
  }

  // Request assistance form
  const reqForm = document.getElementById('request-form');
  if (reqForm) {
    reqForm.addEventListener('submit', e => {
      e.preventDefault();
      _handleRequestSubmit();
    });
  }
}

// ---------------------------------------------------------------------------
// Registration form handler
// ---------------------------------------------------------------------------

function _handleRegisterSubmit() {
  const name  = document.getElementById('reg-name').value.trim();
  const city  = document.getElementById('reg-city').value;
  const phone = document.getElementById('reg-phone').value.trim();
  const err   = document.getElementById('reg-error');

  if (!name || !city) {
    if (err) {
      err.textContent = t('err_fill_name_city');
      err.style.display = 'block';
    }
    return;
  }

  if (err) err.style.display = 'none';

  // Show confirmation (no data is actually sent anywhere)
  const form    = document.getElementById('register-form');
  const confirm = document.getElementById('reg-confirm');

  if (form)    form.style.display    = 'none';
  if (confirm) {
    confirm.style.display = 'block';
    confirm.querySelector('.confirm-name').textContent = name;
    confirm.querySelector('.confirm-city').textContent = city;
  }

  speakRaw(t('confirm_register'));
}

// ---------------------------------------------------------------------------
// Request assistance form handler
// ---------------------------------------------------------------------------

function _handleRequestSubmit() {
  const name  = document.getElementById('req-name').value.trim();
  const city  = document.getElementById('req-city').value;
  const desc  = document.getElementById('req-desc').value.trim();
  const err   = document.getElementById('req-error');

  if (!name || !city) {
    if (err) {
      err.textContent = t('err_fill_name_city');
      err.style.display = 'block';
    }
    return;
  }

  if (err) err.style.display = 'none';

  // Hide the form
  const form = document.getElementById('request-form');
  if (form) form.style.display = 'none';

  // Show results
  const resultsSection = document.getElementById('volunteer-results');
  if (resultsSection) {
    resultsSection.style.display = 'block';
    const msgEl = resultsSection.querySelector('.results-msg');
    if (msgEl) msgEl.textContent = t('confirm_request');

    _renderVolunteers(city, resultsSection.querySelector('#volunteer-list'));
  }

  speakRaw(t('confirm_request'));
}

/**
 * Filter demo volunteers by city and render them as cards.
 * @param {string} city
 * @param {HTMLElement} container
 */
function _renderVolunteers(city, container) {
  if (!container) return;
  container.innerHTML = '';

  const matches = DEMO_VOLUNTEERS.filter(v => v.city === city);

  if (matches.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'alert alert-info';
    msg.textContent = t('no_volunteers');
    container.appendChild(msg);
    return;
  }

  matches.forEach(vol => {
    const card = document.createElement('div');
    card.className = 'volunteer-card';
    card.setAttribute('role', 'article');

    const name = document.createElement('div');
    name.className = 'vol-name';
    name.textContent = '👤 ' + vol.name;

    const city = document.createElement('div');
    city.className = 'vol-detail';
    city.textContent = '📍 ' + vol.city;

    const skills = document.createElement('div');
    skills.className = 'vol-detail';
    skills.textContent = '🛠️ ' + vol.skills;

    const phone = document.createElement('div');
    phone.className = 'vol-detail';
    phone.textContent = '📞 ' + vol.phone;

    card.appendChild(name);
    card.appendChild(city);
    card.appendChild(skills);
    card.appendChild(phone);

    container.appendChild(card);
  });
}
