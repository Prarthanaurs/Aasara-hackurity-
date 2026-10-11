# Aasara — ಆಸರೆ
**Digital Payment & Safety Assistant for Older Adults**

Aasara (ಆಸರೆ, meaning *support* in Kannada) is a beginner-friendly, voice-assisted web application that helps older adults navigate digital payments confidently and safely. Built as a hackathon project using plain HTML, CSS and JavaScript — no frameworks, no build tools, no login required.

---

## Main Features

| Feature | Description |
|---|---|
| 🌐 Language Selection | Choose English, ಕನ್ನಡ, हिंदी or తెలుగు on the welcome screen |
| 🔊 Voice Assistant | Reads page content aloud; optional voice commands with confirmation |
| 💳 Guided Payment | 3-step simulated payment demo with safety warnings |
| 🛡️ Digital Safety | Five expandable safety tips on UPI scams, OTPs, and fake screenshots |
| 📚 Awareness Lessons | Three interactive lessons with a short quiz at the end of each |
| 🤝 Volunteer Help | Demo volunteer registration and assistance request with city matching |
| 🏦 Essential Services | Step-by-step balance check guide and official resource links |

---

## Technologies Used

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, flexbox, grid, responsive media queries
- **Vanilla JavaScript (ES6)** — no libraries, no frameworks
- **Web Speech API** — `SpeechSynthesis` for text-to-speech, `SpeechRecognition` for voice commands
- **sessionStorage** — saves language choice during navigation

---

## Project File Structure

```
Aasara/
├── index.html          ← Welcome screen & language selector (entry point)
├── home.html           ← Dashboard with feature cards
├── payment.html        ← Guided 3-step simulated payment demo
├── safety.html         ← Digital safety tips (5 expandable cards)
├── awareness.html      ← Awareness lessons with quiz
├── volunteer.html      ← Volunteer registration + request + essential services
├── style.css           ← Shared styles for all pages
├── js/
│   ├── languages.js    ← Translation dictionary + language state management
│   ├── voice.js        ← Voice assistant engine (synthesis + recognition)
│   ├── payment.js      ← Payment flow logic
│   ├── safety.js       ← Safety card + awareness lesson logic
│   └── volunteer.js    ← Volunteer form + city matching logic
└── README.md
```

---

## How to Run Locally

### Method 1 — VS Code Live Server (recommended)

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
2. Open the `Aasara` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.
4. The application opens at `http://127.0.0.1:5500/index.html`.

### Method 2 — Python HTTP server

```bash
cd path/to/Aasara
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

### Method 3 — Open directly

> ⚠️ **Limited:** Some browsers block `file://` origins for speech recognition.
> Use a local server (Method 1 or 2) for full functionality.

Double-click `index.html` — basic navigation and speech synthesis will work; speech recognition requires a server origin.

---

## How to Test the Voice Assistant

### Text-to-speech (Read Aloud)

1. Open any page in **Google Chrome** or **Microsoft Edge** on a laptop.
2. The floating bar at the bottom of the screen shows **🔊 Read Aloud** and **⏹ Stop**.
3. Click **Read Aloud** — the page content is spoken aloud.
4. Click **Stop** — speech stops immediately.

### Voice commands (Listen)

1. Click **🎤 Listen** in the voice bar.
2. The browser will ask for microphone permission — click **Allow**.
3. Speak a command, for example:
   - *"Open payment"*, *"Open safety"*, *"Go back"*, *"Home"*, *"Repeat"*
4. A blue toast appears at the bottom of the screen showing what was heard.
5. **Tap the toast** to confirm the command — it will not execute automatically.

### Language voices

| Language | TTS Support | Recognition Support |
|---|---|---|
| English | ✅ Works everywhere | ✅ Chrome, Edge |
| Hindi (हिंदी) | ✅ Android, some Windows | ⚠️ Chrome only, requires internet |
| Kannada (ಕನ್ನಡ) | ❌ Rarely available on desktop | ❌ Rarely works |
| Telugu (తెలుగు) | ❌ Rarely available on desktop | ❌ Rarely works |

If a voice is not available, a notice is shown in the voice bar: *"A voice for this language was not found. Using default voice."* The page interface and translations still work in all languages.

---

## Browser Compatibility

| Browser | Speech Synthesis | Speech Recognition |
|---|---|---|
| Chrome (desktop) | ✅ | ✅ (requires internet) |
| Edge (desktop) | ✅ | ✅ |
| Firefox | ✅ | ❌ Not supported |
| Safari (macOS) | ✅ | ❌ Not on desktop |
| Chrome (Android) | ✅ | ✅ (usually) |
| Safari (iOS) | ✅ | ❌ Not supported |

**Recommendation:** Use **Google Chrome on a laptop** for the best demonstration experience.

---

## What is Demonstration-Only

The following features are simulated and do **not** connect to any real system:

| Feature | Reality |
|---|---|
| Payment flow | No real money is sent. No bank is contacted. The result is labelled "DEMONSTRATION ONLY". |
| Volunteer registration | No data is saved. No real volunteer is contacted. |
| Assistance request | Volunteer matches are from a fictional list in `volunteer.js`. |
| Balance check guide | Explains how to use official apps — does not access any bank account. |
| Cybercrime link | Links to the real `cybercrime.gov.in` website (external). |

---

## Future Improvements (would require a backend)

- User accounts and saved language preferences across sessions
- Real volunteer database and matching system
- In-app messaging between older adults and volunteers
- Integration with actual UPI status APIs (read-only) to verify real transaction history
- Push notifications and reminders
- Offline support via Service Workers
- Support for more regional languages (Tamil, Malayalam, Marathi, Bengali, Punjabi)

---

## Testing Checklist

### Setup
- [ ] Open `index.html` using Live Server or Python HTTP server in Google Chrome
- [ ] Browser console shows no JavaScript errors

### Language selection (index.html)
- [ ] All four language buttons are visible and large enough to tap
- [ ] Clicking **English** highlights the button and updates the tagline to English
- [ ] Clicking **ಕನ್ನಡ** highlights the button and updates all text to Kannada
- [ ] Clicking **हिंदी** highlights the button and updates all text to Hindi
- [ ] Clicking **తెలుగు** highlights the button and updates all text to Telugu
- [ ] "Continue" button is disabled until a language is chosen
- [ ] After selecting a language, "Continue" becomes active
- [ ] Clicking "Continue" navigates to `home.html`

### Dashboard (home.html)
- [ ] Page shows the greeting in the chosen language
- [ ] Language badge in the top bar shows the correct language name
- [ ] All five feature cards are visible with icons and descriptions
- [ ] Clicking "Guided Payment" opens `payment.html`
- [ ] Clicking "Digital Safety" opens `safety.html`
- [ ] Clicking "Awareness Lessons" opens `awareness.html`
- [ ] Clicking "Volunteer Help" opens `volunteer.html`
- [ ] Clicking "Essential Services" opens `volunteer.html` on the Services tab
- [ ] Voice bar is visible at the bottom of the screen
- [ ] A welcome message is spoken once on first visit (not on every navigation)

### Voice assistant (all pages)
- [ ] "Read Aloud" button speaks page content
- [ ] "Stop" button stops speech immediately
- [ ] If speech synthesis is unsupported, a notice appears in the status area
- [ ] "Listen" button asks for microphone permission
- [ ] Denying microphone shows "permission denied" notice (no crash)
- [ ] After a voice command is heard, a blue toast appears and waits for a tap
- [ ] Tapping the toast executes the command; not tapping lets it auto-dismiss
- [ ] Voice commands without a tap never trigger navigation or actions

### Payment page (payment.html)
- [ ] Step 1 shows a recipient dropdown populated with demo names
- [ ] Clicking "Next" without selecting a recipient shows an error message
- [ ] Selecting a recipient and clicking "Next" advances to Step 2
- [ ] Typing a custom name in the text field works as an alternative
- [ ] Typing a suspicious word (e.g. "lottery") shows the caution warning
- [ ] Step 2 shows an amount input
- [ ] Clicking "Next" with an empty amount shows an error
- [ ] Entering a non-numeric amount shows an error
- [ ] Entering ₹15,000 shows the large-amount warning
- [ ] Entering ₹500 advances to Step 3 with no warning
- [ ] Step 3 shows recipient and amount prominently
- [ ] Voice reads the review details aloud
- [ ] "Change" button returns to Step 2
- [ ] "Cancel" button returns to the dashboard
- [ ] "Confirm" button shows the result screen
- [ ] Result screen has a red "DEMONSTRATION ONLY" banner
- [ ] Result screen shows correct recipient, amount, and a fake reference number
- [ ] "Return to Home" navigates back to the dashboard
- [ ] No PIN, OTP, or password field appears anywhere on this page

### Safety page (safety.html)
- [ ] Five expandable safety-tip cards are visible
- [ ] Clicking a card heading opens/closes the tip body
- [ ] The 🔊 icon on each card reads that tip aloud
- [ ] The cybercrime.gov.in link is visible in Tip 5
- [ ] Educational disclaimer is shown at the bottom
- [ ] "Home" link returns to the dashboard

### Awareness lessons (awareness.html)
- [ ] Three lesson buttons are shown at the top
- [ ] Clicking a lesson button loads its first slide
- [ ] "Next →" advances through slides
- [ ] "← Previous" goes back through slides
- [ ] After the last slide, a "Take a Short Quiz" button appears
- [ ] Quiz shows a question with four options
- [ ] Selecting a correct answer highlights it in green
- [ ] Selecting a wrong answer highlights it in red
- [ ] After all quiz questions, a completion screen shows the score
- [ ] "Restart Lesson" replays the lesson from the first slide

### Volunteer page (volunteer.html)
- [ ] Two tabs are visible: "Volunteer" and "Essential Services"
- [ ] Clicking the "Essential Services" tab switches to that panel
- [ ] Volunteer tab shows both Register and Request sections
- [ ] Register form: submitting with empty name/city shows an error
- [ ] Register form: filling in name and Mysuru and submitting shows confirmation
- [ ] Request form: selecting Bengaluru shows fictional Bengaluru volunteers
- [ ] Selecting "Other" (no volunteers) shows the "no match" message
- [ ] Essential Services tab shows the balance check guide
- [ ] All official links point to correct external URLs
- [ ] No bank balance or personal data is displayed

### Accessibility & responsive layout
- [ ] All interactive elements can be reached and activated by keyboard (Tab + Enter)
- [ ] Focus rings are visible on all focused elements
- [ ] Resize browser to 375px width — no horizontal scroll, all content readable
- [ ] Text remains large and legible on mobile screen sizes
- [ ] Screen reader can navigate page headings and buttons

---

## Hackathon Demonstration Flow (5 minutes)

1. **Welcome & language** — Open `index.html`, select **ಕನ್ನಡ**, show the interface switching to Kannada, click Continue.
2. **Dashboard & voice** — On `home.html`, click "Read Aloud" — the welcome message plays. Click "Listen" and say "open payment" — show the confirmation toast.
3. **Guided payment** — Walk through Steps 1–3: select "Anita Sharma (Demo)", enter ₹500, read back the review, click Confirm — show the result screen with the DEMONSTRATION banner.
4. **Safety tip** — Navigate to `safety.html`, open "OTP scams" card, click the speaker icon — the tip is read aloud.
5. **Volunteer request** — Navigate to `volunteer.html`, fill in the request form with city "Mysuru" — fictional Mysuru volunteers appear.
6. **Essential services** — Switch to the "Essential Services" tab, show the balance check guide and official links.

Total: approximately 4–5 minutes. All features run locally with no internet required except for speech recognition.

---

*Built with HTML, CSS and JavaScript for the Hackathon — Aasara (ಆಸರೆ)*
