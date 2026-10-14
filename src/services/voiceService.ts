import type { Language } from '../types';

export class VoiceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static recognition: any = null;

  // Language codes for Speech Synthesis & Recognition
  public static getLangCode(lang: Language): string {
    switch (lang) {
      case 'kn':
        return 'kn-IN';
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
    if (this.synth && this.currentUtterance) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
    this.currentUtterance = null;
  }

  /**
   * Check if speech is currently playing
   */
  public static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
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

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLangCode = this.getLangCode(lang);
      utterance.lang = targetLangCode;
      
      // Elder-friendly pacing: 0.9 speed is clearer and less rushed
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      // Find best available voice
      const voices = this.synth.getVoices();
      let matchedVoice = voices.find(
        (v) => v.lang === targetLangCode || v.lang.startsWith(targetLangCode.split('-')[0])
      );

      // Fallback for Indian context
      if (!matchedVoice && (lang === 'kn' || lang === 'hi')) {
        matchedVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('hi'));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

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
        // If canceled intentionally, don't trigger error
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
   * Listen to voice input through microphone
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
      onError('Speech recognition is not supported in this browser. You can type or tap instead.');
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
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Microphone permission denied. Please allow microphone access or use typing.');
        } else if (event.error === 'no-speech') {
          onError('No speech was detected. Please tap Speak and try again.');
        } else {
          onError(`Voice input error (${event.error}). Please try typing or tapping.`);
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
