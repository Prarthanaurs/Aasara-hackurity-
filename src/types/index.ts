export type Language = 'en' | 'kn' | 'hi' | 'te';

export type FontSize = 'normal' | 'large' | 'xlarge';

export type ThemeMode = 'dark' | 'light' | 'contrast';

export interface TrustedContact {
  name: string;
  phone: string;
  relation: string;
}

export type ScanRiskLevel = 'safe' | 'caution' | 'danger';

export interface CheckResult {
  riskLevel: ScanRiskLevel;
  title: Record<string, string>;
  summary: Record<string, string>;
  reasons: Array<{
    icon: string;
    text: Record<string, string>;
  }>;
  actionAdvice: Array<{
    text: Record<string, string>;
    isImportant?: boolean;
  }>;
  matchedKeywords?: string[];
  safeScore: number; // 0 to 100
}

export interface PaymentDetails {
  recipientType: 'upi' | 'phone' | 'contact';
  recipientValue: string;
  recipientName: string;
  amount: string;
  purpose: string;
  verified: boolean;
}

export interface EducationalLesson {
  id: string;
  title: Record<string, string>;
  category: Record<string, string>;
  readTime: string;
  summary: Record<string, string>;
  keyRules: Array<Record<string, string>>;
  quizQuestion: {
    question: Record<string, string>;
    options: Array<Record<string, string>>;
    correctIndex: number;
    explanation: Record<string, string>;
  };
}

export interface TutorScenario {
  id: string;
  title: Record<string, string>;
  scammerMessage: Record<string, string>;
  scammerAudioText: Record<string, string>;
  options: Array<{
    text: Record<string, string>;
    isSafe: boolean;
    feedback: Record<string, string>;
  }>;
}
