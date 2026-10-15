import type { Language } from '../types';

export class VoiceService {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static recognition: any = null;
  private static cachedVoices: SpeechSynthesisVoice[] = [];

  // Initialize voice list preloading
  static {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        try {
          VoiceService.cachedVoices = window.speechSynthesis.getVoices();
        } catch (_) {}
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  // Language codes for Speech Synthesis & Recognition
  public static getLangCode(lang: Language): string {
    switch (lang) {
      case 'kn':
        return 'kn-IN';
      case 'te':
        return 'te-IN';
      case 'hi':
        return 'hi-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  }

  /**
   * Stop any ongoing speech synthesis immediately
   */
  public static stopSpeaking(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
    if (this.currentUtterance) {
      this.currentUtterance = null;
    }
  }

  /**
   * Check if speech is currently playing
   */
  public static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Find the most accurate native voice for the given language.
   * CRITICAL: NEVER return an English voice for Kannada or Telugu, as it produces garbled or silent output!
   */
  private static findBestVoice(lang: Language): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    let voices = this.cachedVoices;
    if (!voices || voices.length === 0) {
      voices = this.synth.getVoices();
      this.cachedVoices = voices;
    }
    if (!voices || voices.length === 0) return null;

    if (lang === 'kn') {
      // Kannada matches: Windows Sapna/Gagan, Google ಕನ್ನಡ, kn-IN
      const knVoice = voices.find((v) => {
        const langLower = v.lang.toLowerCase().replace('_', '-');
        const nameLower = v.name.toLowerCase();
        return (
          langLower === 'kn-in' ||
          langLower.startsWith('kn') ||
          nameLower.includes('kannada') ||
          nameLower.includes('sapna') ||
          nameLower.includes('gagan') ||
          nameLower.includes('ಕನ್ನಡ')
        );
      });
      if (knVoice) return knVoice;
      // Do NOT fallback to English/Hindi voice for Kannada script!
      return null;
    }

    if (lang === 'te') {
      // Telugu matches: Windows Shruti/Mohan, Google తెలుగు, te-IN
      const teVoice = voices.find((v) => {
        const langLower = v.lang.toLowerCase().replace('_', '-');
        const nameLower = v.name.toLowerCase();
        return (
          langLower === 'te-in' ||
          langLower.startsWith('te') ||
          nameLower.includes('telugu') ||
          nameLower.includes('shruti') ||
          nameLower.includes('mohan') ||
          nameLower.includes('తెలుగు')
        );
      });
      if (teVoice) return teVoice;
      // Do NOT fallback to English/Hindi voice for Telugu script!
      return null;
    }

    if (lang === 'hi') {
      // Hindi matches: Windows Swara/Madhur, Google हिन्दी, hi-IN
      const hiVoice = voices.find((v) => {
        const langLower = v.lang.toLowerCase().replace('_', '-');
        const nameLower = v.name.toLowerCase();
        return (
          langLower === 'hi-in' ||
          langLower.startsWith('hi') ||
          nameLower.includes('hindi') ||
          nameLower.includes('swara') ||
          nameLower.includes('madhur') ||
          nameLower.includes('हिन्दी')
        );
      });
      if (hiVoice) return hiVoice;
      return null;
    }

    // English: Indian English preferred, then any English
    const enVoice = voices.find((v) => {
      const langLower = v.lang.toLowerCase().replace('_', '-');
      return langLower === 'en-in';
    }) || voices.find((v) => v.lang.toLowerCase().startsWith('en'));

    return enVoice || null;
  }

  /**
   * Speak given text in target language with elder-friendly pacing
   */
  public static speak(
    text: string,
    lang: Language,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.synth) {
      onError?.(new Error('Speech synthesis not supported in this browser'));
      return false;
    }

    // Stop existing speech before starting new one
    this.stopSpeaking();

    // Chrome bug fix: resume speech synthesis if paused/stuck
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (_) {}

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLangCode = this.getLangCode(lang);
      utterance.lang = targetLangCode;

      // Elder-friendly pacing: 0.85 rate for Kannada/Telugu ensures clear compound vowel articulation
      utterance.rate = lang === 'kn' || lang === 'te' ? 0.85 : 0.9;
      utterance.pitch = 1.0;

      // Find best available voice
      const matchedVoice = this.findBestVoice(lang);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      // Note: If no matched native voice was found for kn/te, utterance.voice remains unset (null),
      // allowing the browser's language engine (e.g. Chrome Cloud TTS) to synthesize kn-IN/te-IN naturally!

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        console.warn('Speech utterance event:', e);
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          onError?.(e);
        } else {
          onEnd?.();
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Failed to speak:', e);
      onError?.(e);
      return false;
    }
  }

  /**
   * Listen to voice input through microphone in native language
   */
  public static startListening(
    lang: Language,
    onResult: (transcript: string) => void,
    onError: (errorMsg: string) => void,
    onEnd: () => void
  ): () => void {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      const notSupportedMsg =
        lang === 'kn'
          ? 'ಧ್ವನಿ ಗ್ರಹಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಬರೆಯಿರಿ ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ.'
          : lang === 'te'
          ? 'వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి టైప్ చేయండి.'
          : lang === 'hi'
          ? 'आवाज पहचान समर्थित नहीं है। कृपया लिखकर बताएं।'
          : 'Speech recognition is not supported in this browser. You can type or tap instead.';
      onError(notSupportedMsg);
      onEnd();
      return () => {};
    }

    try {
      // Abort any existing recognition
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.lang = this.getLangCode(lang);
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
          } else if (!finalTranscript) {
            // Live feedback
            onResult(transcriptChunk);
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError(
            lang === 'kn'
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನೀಡಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿಸಿ.'
              : lang === 'te'
              ? 'మైక్రోఫోన్ అనుమతి తిరస్కరించబడింది. దయచేసి అనుమతించండి.'
              : lang === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया अनुमति दें।'
              : 'Microphone permission denied. Please allow microphone access.'
          );
        } else if (event.error === 'no-speech') {
          onError(
            lang === 'kn'
              ? 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.'
              : lang === 'te'
              ? 'ఎలాంటి ధ్వని వినపడలేదు. దయచేసి మళ్లీ స్పష్టంగా మాట్లాడండి.'
              : lang === 'hi'
              ? 'कोई आवाज सुनाई नहीं दी। कृपया फिर से बोलें।'
              : 'No speech was detected. Please tap Speak and try again.'
          );
        } else {
          onError(
            lang === 'kn'
              ? 'ಧ್ವನಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
              : lang === 'te'
              ? 'వాయిస్ అందుకోలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.'
              : `Voice error (${event.error}). Please try again or type.`
          );
        }
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();
      this.recognition = recognition;

      return () => {
        try {
          recognition.stop();
        } catch (_) {}
      };
    } catch (e) {
      onError('Could not start microphone. Please type or tap options.');
      onEnd();
      return () => {};
    }
  }

  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }
}
