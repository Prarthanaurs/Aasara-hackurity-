export type Language = 'en' | 'kn' | 'hi';

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface TrustedContact {
  name: string;
  phone: string;
  relation: string;
}

export type ScanRiskLevel = 'safe' | 'caution' | 'danger';

export interface CheckResult {
  riskLevel: ScanRiskLevel;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  reasons: Array<{
    icon: string;
    text: Record<Language, string>;
  }>;
  actionAdvice: Array<{
    text: Record<Language, string>;
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
  title: Record<Language, string>;
  category: Record<Language, string>;
  readTime: string;
  summary: Record<Language, string>;
  keyRules: Array<Record<Language, string>>;
  quizQuestion: {
    question: Record<Language, string>;
    options: Array<Record<Language, string>>;
    correctIndex: number;
    explanation: Record<Language, string>;
  };
}

export interface TutorScenario {
  id: string;
  title: Record<Language, string>;
  scammerMessage: Record<Language, string>;
  scammerAudioText: Record<Language, string>;
  options: Array<{
    text: Record<Language, string>;
    isSafe: boolean;
    feedback: Record<Language, string>;
  }>;
}
