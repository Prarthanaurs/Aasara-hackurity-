# Aasara (ಆಸರಾ / आसरा) — Digital Safety & Support for Older Adults

**Aasara** is an accessible, voice-guided digital safety companion designed specifically for older adults in India. It empowers seniors to detect scams, conduct safe UPI payments, report financial cyber fraud (1930), and learn digital literacy through interactive roleplay simulations.

---

## 🌟 Key Features

### 🔊 Feature A — Accessible, Voice-Guided Interface
- **Trilingual Support**: English, Kannada (**ಕನ್ನಡ**), and Hindi (**हिन्दी**) with authentic phrasing.
- **Audio Previews for Languages**: Tap the speaker icon beside Kannada, Hindi, or English to hear the language name spoken aloud before choosing.
- **Elder-First Visual Design**:
  - Minimum font size 18px–28px, tactile buttons (min height 56px–72px).
  - High Contrast mode toggle (bright gold/white on deep black).
  - Font scaling switcher: **A** (Normal), **A+** (Large), **A++** (Extra Large).
- **Voice Input & Spoken Output**:
  - Web Speech Synthesis API (`window.speechSynthesis`) with elder-friendly 0.9x pacing.
  - Web Speech Recognition API (`webkitSpeechRecognition`) for hands-free dictation.
  - **Privacy Guard**: Never automatically speaks sensitive private details (such as bank balances or PINs) unless explicitly requested.
- **Human Assistance Backup**: 1-tap "Ask a Family Helper" modal with direct dialing and pre-formatted WhatsApp SOS messages.

---

### 🛡️ Feature B — Suspicious Message & Link Checker
- **Inputs**: Text paste, voice dictation, and screenshot analysis simulation.
- **Rule-based & Heuristic Detection**:
  - Intimidation & urgent threats (*"Account blocked today"*, *"Power disconnected tonight at 9:30 PM"*).
  - OTP, UPI PIN, password, or KYC solicitation.
  - Misleading / deceptive domains (*.xyz*, *.top*, *bit.ly*, spoofed bank URLs).
  - Impersonation of trusted authorities (SBI, YONO, HDFC, BESCOM, India Post, KBC).
- **Explainable Reasoning**: Plain-language breakdown explaining *why* the message was flagged, not just an unexplained red score.
- **Pre-loaded Authentic Test Scenarios**: One-tap test cases (Electricity cutoff, SBI YONO KYC APK, KBC 25 Lakh lottery, India Post failed parcel, and legitimate credit alert).
- **Honest Uncertainty & Privacy**: Clear disclaimers stating that no tool is 100% foolproof and private messages are not retained.

---

### 💳 Feature C — Guided UPI Payment Safety
- **Strict "One Question Per Screen" Flow**:
  1. *Who would you like to pay?* (Trusted contact chips, manual UPI ID/Phone, or voice input).
  2. *How much would you like to pay?* (Big tactile keypad, quick amount chips ₹50–₹2000, voice input).
  3. *What is the payment for?* (Groceries, Medicine, Bills, Family, Other).
  4. *Review & Critical Safety Check*:
     - **🛑 Mandatory UPI PIN Safety Rule**: *"Entering your UPI PIN ALWAYS transfers money OUT of your bank account. You NEVER need to enter a PIN to receive money, refunds, or lottery prizes!"*
     - Clear promise that Aasara NEVER asks for or collects a UPI PIN.
- **UPI Intent Handoff**: Generates standard `upi://pay` intent with direct launch buttons for Google Pay, PhonePe, Paytm, BHIM, and QR code display for tablet/desktop scanning.

---

### 🚨 Feature D — Cybercrime Emergency Support
- **Immediate 1930 Action Card**: Direct one-tap dialer (`tel:1930`) for the National Financial Cybercrime Helpline.
- **Official Portal Link**: Direct access to `https://cybercrime.gov.in/`.
- **The Golden 2 Hours**: Clear guidance explaining why reporting within 2 hours enables police to freeze the fraudster's bank account before ATM withdrawal.
- **Information Preparation Checklist**: Interactive tick-sheet for Transaction UTR, Bank Account Number, Scammer Contact, and Date/Time.
- **Incident Summary Slip Builder**: Simple 4-field assistant generating an organized statement seniors can read to the 1930 officer or bank branch manager.
- **Emergency Bank Account Freeze Directory**: Direct hotlines for SBI, HDFC, ICICI, Canara Bank, PNB, and Bank of Baroda.

---

### 🤖 Feature E — AI Scam Tutor & Safe Simulator
- **Safe Roleplay Practice Scenarios**:
  - *The "Electricity Bill Cut-off" Call*: Practice responding to high-pressure utility threats.
  - *The "Scan QR Code to Receive ₹5,000" Trick*: Teaches why scanning QR codes to receive money empties accounts.
  - *The "Download App for Bank KYC" Trap*: Explains the danger of screen-sharing apps like AnyDesk.
- **Simulated Voice Calls**: Seniors can hear the scammer's spoken pitch and choose safe responses.
- **Aasara Saathi Q&A**: Empathetic conversational mentor addressing common elder doubts via voice or text.

---

### 📚 Feature F — Short Educational Lessons & Video
- **Simulated Educational Video Player**:
  - High-contrast synchronized captions and live transcript in English, Kannada, and Hindi.
  - Play, pause, restart controls with read-aloud spoken audio narration.
- **2-Minute Bite-Sized Micro-Lessons**:
  1. *How to Spot a Fake Bank Alert*.
  2. *The UPI PIN Rule: Sending vs Receiving*.
  3. *What to Do in the Golden 2 Hours*.
- **Interactive Knowledge Quiz**: Friendly question checks with confetti celebrations on correct answers!

---

## 🚀 Running the Project

```bash
cd "C:\Users\Harshadeepa M N\.gemini\antigravity\scratch\aasara"
npm install
npm run dev
```

Visit: **`http://localhost:5173/`**
