# Aasara (ಆಸರಾ / आसरा) — Digital Payment & Safety Assistant for Older Adults

**Aasara** is an accessible, voice-guided digital safety and payment companion designed specifically for older adults in India. It empowers seniors to detect scams, conduct safe UPI payments, report financial cyber fraud (1930), and learn digital safety through an elder-friendly, multilingual interface.

---

## 🌟 Key Features

### 🔊 Feature A — Accessible, Voice-Guided Interface
- **Multilingual Support**: English, Kannada (**ಕನ್ನಡ**), Hindi (**हिन्दी**), and Telugu (**తెలుగు**) with authentic phrasing.
- **Audio Previews for Languages**: Tap the speaker icon beside Kannada, Telugu, Hindi, or English to hear the language name spoken aloud before choosing.
- **Elder-First Visual Design**:
  - Scalable font switcher: **A** (Normal), **A+** (Large), **A++** (Extra Large) with root REM scaling.
  - High Contrast Dark / Light theme toggle conforming to WCAG AAA contrast for low-vision seniors.
  - Tactile touch targets with min height 56px–72px.
- **Voice Input & Spoken Output**:
  - Web Speech Synthesis API (`window.speechSynthesis`) with elder-friendly 0.85x pacing.
  - Web Speech Recognition API (`webkitSpeechRecognition`) for hands-free dictation.
  - **Privacy Guard**: Never automatically speaks sensitive private details unless requested.
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

---

### 💳 Feature C — Guided UPI Payment & "The Ghost Merchant Shield"
- **Strict "One Question Per Screen" Flow**:
  1. *Who would you like to pay?* (Scan/Upload QR code, Trusted contact chips, manual UPI ID/Phone, or voice input).
  2. *How much would you like to pay?* (Big tactile keypad, quick amount chips ₹50–₹2000, voice input).
  3. *What is the payment for?* (Groceries, Doctor, Rent, Family, Other).
  4. *Review & Critical Safety Check*:
     - **🛑 Mandatory UPI PIN Safety Rule**: *"Entering your UPI PIN ALWAYS transfers money OUT of your bank account. You NEVER need to enter a PIN to receive money, refunds, or lottery prizes!"*
     - Clear promise that Aasara NEVER asks for or collects a UPI PIN.
- **The Ghost Merchant Shield (VPA Legal Identity Discrepancy Engine)**:
  - Parses `upi://pay` query parameters (`pn`, `pa`, `mc`).
  - Detects when a QR code displays a legitimate entity name (e.g., *"BESCOM Electricity Support"*) while the actual destination VPA belongs to a personal savings mule account (*rahulkumar9921@ybl*).
  - Intercepts intent, locks the payment, and visually alerts the senior.
- **Safe UPI Intent Handoff**: Deep-links to certified apps (Google Pay, PhonePe, Paytm, BHIM) where the user safely authorizes the payment.

---

### 🚨 Feature D — Cybercrime Emergency Support
- **Immediate 1930 Action Card**: Direct one-tap dialer (`tel:1930`) for the National Financial Cybercrime Helpline.
- **Official Portal Link**: Direct access to `https://cybercrime.gov.in/`.
- **The Golden 2 Hours**: Clear guidance explaining why reporting within 2 hours enables police to freeze the fraudster's bank account before ATM withdrawal.
- **Incident Summary Slip Builder**: Simple 4-field assistant generating an organized statement seniors can read to the 1930 officer or bank branch manager.
- **Emergency Bank Account Freeze Directory**: Direct hotlines for SBI, HDFC, ICICI, Canara Bank, PNB, and Bank of Baroda.

---

### 🤖 Feature E — Aasara Saathi (AI Tutor & Volunteer Support)
- **Safe Roleplay Practice Scenarios**:
  - *The "Electricity Bill Cut-off" Call*: Practice responding to high-pressure utility threats.
  - *The "Scan QR Code to Receive ₹5,000" Trick*: Teaches why scanning QR codes to receive money empties accounts.
  - *The "Download App for Bank KYC" Trap*: Explains the danger of screen-sharing apps like AnyDesk.
- **Aasara Saathi Q&A**: Empathetic conversational mentor addressing common elder doubts via voice or text.
- **Community Volunteer Matching**: Connects seniors with verified digital volunteers in their neighborhood.

---

### 📚 Feature F — Short Educational Lessons & Video
- **Simulated Educational Video Player**: High-contrast synchronized captions and live transcript in English, Kannada, and Hindi.
- **2-Minute Bite-Sized Micro-Lessons**:
  1. *How to Spot a Fake Bank Alert*.
  2. *The UPI PIN Rule: Sending vs Receiving*.
  3. *What to Do in the Golden 2 Hours*.
- **Interactive Knowledge Quiz**: Friendly question checks with confetti celebrations on correct answers!

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Build Tool**: Vite 8
- **Computer Vision**: `jsQR` (Real-time in-browser QR scanning via HTML5 Canvas)
- **Speech Engine**: Web Speech Synthesis & Recognition APIs (with Indic regional neural fallbacks)
- **Delight & Gamification**: `canvas-confetti`

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Prarthanaurs/Aasara-hackurity-project.git
cd Aasara-hackurity-project

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit: **`http://localhost:5173/`**
