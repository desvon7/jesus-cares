
export interface ReadingSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'dyslexic';
  theme: 'light' | 'dark' | 'sepia';
  lineSpacing: number;
  showVerseNumbers: boolean;
  showChapterNumbers: boolean;
  paragraphMode: boolean;
}

export const defaultReadingSettings: ReadingSettings = {
  fontSize: 16,
  fontFamily: 'serif',
  theme: 'light',
  lineSpacing: 1.5,
  showVerseNumbers: true,
  showChapterNumbers: true,
  paragraphMode: false
};

export const themeClasses = {
  light: 'bg-slate-50 text-slate-900',
  dark: 'bg-slate-900 text-slate-100',
  sepia: 'bg-amber-50 text-amber-900'
};
