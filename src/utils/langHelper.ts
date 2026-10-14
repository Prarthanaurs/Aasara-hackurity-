import type { Language } from '../types';

export function getLangText(
  obj: Record<string, any> | undefined | null,
  lang: Language
): string {
  if (!obj) return '';
  return obj[lang] || obj['kn'] || obj['en'] || obj['hi'] || '';
}
