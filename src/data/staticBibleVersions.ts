
import { BibleVersion } from '../types/bibleTypes';

export const STATIC_BIBLE_VERSIONS: BibleVersion[] = [
  // English Versions
  {
    id: 'kjv',
    name: 'King James Version',
    nameLocal: 'King James Version',
    abbreviation: 'KJV',
    abbreviationLocal: 'KJV',
    description: 'The classic English translation from 1611',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'niv',
    name: 'New International Version',
    nameLocal: 'New International Version',
    abbreviation: 'NIV',
    abbreviationLocal: 'NIV',
    description: 'Contemporary English translation',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    nameLocal: 'English Standard Version',
    abbreviation: 'ESV',
    abbreviationLocal: 'ESV',
    description: 'Literal yet readable English translation',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nlt',
    name: 'New Living Translation',
    nameLocal: 'New Living Translation',
    abbreviation: 'NLT',
    abbreviationLocal: 'NLT',
    description: 'Clear, contemporary English',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    nameLocal: 'New American Standard Bible',
    abbreviation: 'NASB',
    abbreviationLocal: 'NASB',
    description: 'Literal English translation',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },

  // GitHub-based unfoldingWord translations
  {
    id: 'ult',
    name: 'unfoldingWord Literal Text',
    nameLocal: 'unfoldingWord Literal Text',
    abbreviation: 'ULT',
    abbreviationLocal: 'ULT',
    description: 'Accurate, literal translation by unfoldingWord',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'github-unfolding'
  },
  {
    id: 'ust',
    name: 'unfoldingWord Simplified Text',
    nameLocal: 'unfoldingWord Simplified Text',
    abbreviation: 'UST',
    abbreviationLocal: 'UST',
    description: 'Clear, simplified translation by unfoldingWord',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'github-unfolding'
  },
  {
    id: 'ulb',
    name: 'unfoldingWord Literal Bible',
    nameLocal: 'unfoldingWord Literal Bible',
    abbreviation: 'ULB',
    abbreviationLocal: 'ULB',
    description: 'Literal Bible translation by unfoldingWord',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'github-unfolding'
  },
  {
    id: 'udb',
    name: 'unfoldingWord Dynamic Bible',
    nameLocal: 'unfoldingWord Dynamic Bible',
    abbreviation: 'UDB',
    abbreviationLocal: 'UDB',
    description: 'Dynamic Bible translation by unfoldingWord',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'github-unfolding'
  },

  // STEPBible translations
  {
    id: 'step-kjv',
    name: 'STEP Bible KJV',
    nameLocal: 'STEP Bible KJV',
    abbreviation: 'STEP-KJV',
    abbreviationLocal: 'STEP-KJV',
    description: 'King James Version with STEP Bible enhanced features',
    language: { id: 'en', name: 'English', nameLocal: 'English', script: 'Latin', scriptDirection: 'ltr' },
    source: 'github-step'
  },
  {
    id: 'step-hebrew',
    name: 'STEP Bible Hebrew',
    nameLocal: 'תנ״ך עברית',
    abbreviation: 'STEP-HEB',
    abbreviationLocal: 'עברית',
    description: 'Hebrew Bible with STEP Bible tools',
    language: { id: 'he', name: 'Hebrew', nameLocal: 'עברית', script: 'Hebrew', scriptDirection: 'rtl' },
    source: 'github-step'
  },
  {
    id: 'step-greek',
    name: 'STEP Bible Greek',
    nameLocal: 'Καινή Διαθήκη',
    abbreviation: 'STEP-GRK',
    abbreviationLocal: 'Ελληνικά',
    description: 'Greek New Testament with STEP Bible tools',
    language: { id: 'el', name: 'Greek', nameLocal: 'Ελληνικά', script: 'Greek', scriptDirection: 'ltr' },
    source: 'github-step'
  },

  // Spanish Versions
  {
    id: 'rvr1960',
    name: 'Reina-Valera 1960',
    nameLocal: 'Reina-Valera 1960',
    abbreviation: 'RVR1960',
    abbreviationLocal: 'RVR1960',
    description: 'Popular Spanish translation',
    language: { id: 'es', name: 'Spanish', nameLocal: 'Español', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nvi',
    name: 'Nueva Versión Internacional',
    nameLocal: 'Nueva Versión Internacional',
    abbreviation: 'NVI',
    abbreviationLocal: 'NVI',
    description: 'Contemporary Spanish translation',
    language: { id: 'es', name: 'Spanish', nameLocal: 'Español', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'lbla',
    name: 'La Biblia de las Américas',
    nameLocal: 'La Biblia de las Américas',
    abbreviation: 'LBLA',
    abbreviationLocal: 'LBLA',
    description: 'Accurate Spanish translation',
    language: { id: 'es', name: 'Spanish', nameLocal: 'Español', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'dhh',
    name: 'Dios Habla Hoy',
    nameLocal: 'Dios Habla Hoy',
    abbreviation: 'DHH',
    abbreviationLocal: 'DHH',
    description: 'Contemporary Spanish version',
    language: { id: 'es', name: 'Spanish', nameLocal: 'Español', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },

  // French Versions
  {
    id: 'lsg',
    name: 'Louis Segond 1910',
    nameLocal: 'Louis Segond 1910',
    abbreviation: 'LSG',
    abbreviationLocal: 'LSG',
    description: 'Classic French Protestant translation',
    language: { id: 'fr', name: 'French', nameLocal: 'Français', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'bds',
    name: 'Bible du Semeur',
    nameLocal: 'Bible du Semeur',
    abbreviation: 'BDS',
    abbreviationLocal: 'BDS',
    description: 'Contemporary French translation',
    language: { id: 'fr', name: 'French', nameLocal: 'Français', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nfc',
    name: 'Nouvelle Français Courant',
    nameLocal: 'Nouvelle Français Courant',
    abbreviation: 'NFC',
    abbreviationLocal: 'NFC',
    description: 'Modern French version',
    language: { id: 'fr', name: 'French', nameLocal: 'Français', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },

  // German Versions
  {
    id: 'luther1912',
    name: 'Luther Bibel 1912',
    nameLocal: 'Luther Bibel 1912',
    abbreviation: 'LUT',
    abbreviationLocal: 'LUT',
    description: 'Classic German Luther translation',
    language: { id: 'de', name: 'German', nameLocal: 'Deutsch', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'luther2017',
    name: 'Luther Bibel 2017',
    nameLocal: 'Luther Bibel 2017',
    abbreviation: 'LUT17',
    abbreviationLocal: 'LUT17',
    description: 'Revised Luther translation',
    language: { id: 'de', name: 'German', nameLocal: 'Deutsch', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'elb',
    name: 'Elberfelder Bibel',
    nameLocal: 'Elberfelder Bibel',
    abbreviation: 'ELB',
    abbreviationLocal: 'ELB',
    description: 'Literal German translation',
    language: { id: 'de', name: 'German', nameLocal: 'Deutsch', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },

  // Additional languages continue...
  {
    id: 'acf',
    name: 'Almeida Corrigida Fiel',
    nameLocal: 'Almeida Corrigida Fiel',
    abbreviation: 'ACF',
    abbreviationLocal: 'ACF',
    description: 'Traditional Portuguese translation',
    language: { id: 'pt', name: 'Portuguese', nameLocal: 'Português', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nvi-pt',
    name: 'Nova Versão Internacional',
    nameLocal: 'Nova Versão Internacional',
    abbreviation: 'NVI',
    abbreviationLocal: 'NVI',
    description: 'Contemporary Portuguese translation',
    language: { id: 'pt', name: 'Portuguese', nameLocal: 'Português', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'krv',
    name: 'Korean Revised Version',
    nameLocal: '개역개정',
    abbreviation: 'KRV',
    abbreviationLocal: '개정',
    description: 'Standard Korean translation',
    language: { id: 'ko', name: 'Korean', nameLocal: '한국어', script: 'Hangul', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nkrv',
    name: 'New Korean Revised Version',
    nameLocal: '새번역',
    abbreviation: 'NKRV',
    abbreviationLocal: '새번역',
    description: 'Modern Korean translation',
    language: { id: 'ko', name: 'Korean', nameLocal: '한국어', script: 'Hangul', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'ccb',
    name: 'Chinese Contemporary Bible',
    nameLocal: '当代译本',
    abbreviation: 'CCB',
    abbreviationLocal: '当代译本',
    description: 'Contemporary Chinese translation',
    language: { id: 'zh', name: 'Chinese', nameLocal: '中文', script: 'Han', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'cunp',
    name: 'Chinese Union Version',
    nameLocal: '和合本',
    abbreviation: 'CUNP',
    abbreviationLocal: '和合本',
    description: 'Traditional Chinese union version',
    language: { id: 'zh', name: 'Chinese', nameLocal: '中文', script: 'Han', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nav',
    name: 'New Arabic Version',
    nameLocal: 'الترجمة العربية الجديدة',
    abbreviation: 'NAV',
    abbreviationLocal: 'NAV',
    description: 'Contemporary Arabic translation',
    language: { id: 'ar', name: 'Arabic', nameLocal: 'العربية', script: 'Arabic', scriptDirection: 'rtl' },
    source: 'static'
  },
  {
    id: 'svd',
    name: 'Smith and Van Dyke',
    nameLocal: 'سميث وفان دايك',
    abbreviation: 'SVD',
    abbreviationLocal: 'SVD',
    description: 'Classic Arabic translation',
    language: { id: 'ar', name: 'Arabic', nameLocal: 'العربية', script: 'Arabic', scriptDirection: 'rtl' },
    source: 'static'
  },
  {
    id: 'rst',
    name: 'Russian Synodal Translation',
    nameLocal: 'Синодальный перевод',
    abbreviation: 'RST',
    abbreviationLocal: 'СП',
    description: 'Traditional Russian Orthodox translation',
    language: { id: 'ru', name: 'Russian', nameLocal: 'Русский', script: 'Cyrillic', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'cars',
    name: 'Contemporary Russian Translation',
    nameLocal: 'Современный русский перевод',
    abbreviation: 'CARS',
    abbreviationLocal: 'СРП',
    description: 'Modern Russian translation',
    language: { id: 'ru', name: 'Russian', nameLocal: 'Русский', script: 'Cyrillic', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'cei',
    name: 'Conferenza Episcopale Italiana',
    nameLocal: 'Conferenza Episcopale Italiana',
    abbreviation: 'CEI',
    abbreviationLocal: 'CEI',
    description: 'Official Catholic Italian translation',
    language: { id: 'it', name: 'Italian', nameLocal: 'Italiano', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nuovadiodati',
    name: 'Nuova Diodati',
    nameLocal: 'Nuova Diodati',
    abbreviation: 'ND',
    abbreviationLocal: 'ND',
    description: 'Protestant Italian translation',
    language: { id: 'it', name: 'Italian', nameLocal: 'Italiano', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'hsv',
    name: 'Herziene Statenvertaling',
    nameLocal: 'Herziene Statenvertaling',
    abbreviation: 'HSV',
    abbreviationLocal: 'HSV',
    description: 'Revised Dutch States translation',
    language: { id: 'nl', name: 'Dutch', nameLocal: 'Nederlands', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'nbv',
    name: 'Nieuwe Bijbelvertaling',
    nameLocal: 'Nieuwe Bijbelvertaling',
    abbreviation: 'NBV',
    abbreviationLocal: 'NBV',
    description: 'New Dutch Bible translation',
    language: { id: 'nl', name: 'Dutch', nameLocal: 'Nederlands', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'bw',
    name: 'Biblia Warszawska',
    nameLocal: 'Biblia Warszawska',
    abbreviation: 'BW',
    abbreviationLocal: 'BW',
    description: 'Warsaw Bible translation',
    language: { id: 'pl', name: 'Polish', nameLocal: 'Polski', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'bt',
    name: 'Biblia Tysiąclecia',
    nameLocal: 'Biblia Tysiąclecia',
    abbreviation: 'BT',
    abbreviationLocal: 'BT',
    description: 'Millennium Bible',
    language: { id: 'pl', name: 'Polish', nameLocal: 'Polski', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'jlb',
    name: 'Japanese Living Bible',
    nameLocal: 'リビングバイブル',
    abbreviation: 'JLB',
    abbreviationLocal: 'JLB',
    description: 'Contemporary Japanese paraphrase',
    language: { id: 'ja', name: 'Japanese', nameLocal: '日本語', script: 'Japanese', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'jkv',
    name: 'Japanese Kougo-yaku',
    nameLocal: '口語訳',
    abbreviation: 'JKV',
    abbreviationLocal: '口語訳',
    description: 'Japanese colloquial translation',
    language: { id: 'ja', name: 'Japanese', nameLocal: '日本語', script: 'Japanese', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'hindi',
    name: 'Hindi Bible',
    nameLocal: 'हिन्दी बाइबल',
    abbreviation: 'HIN',
    abbreviationLocal: 'HIN',
    description: 'Hindi translation',
    language: { id: 'hi', name: 'Hindi', nameLocal: 'हिन्दी', script: 'Devanagari', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'swahili',
    name: 'Biblia Takatifu',
    nameLocal: 'Biblia Takatifu',
    abbreviation: 'BT-SW',
    abbreviationLocal: 'BT',
    description: 'Swahili Holy Bible',
    language: { id: 'sw', name: 'Swahili', nameLocal: 'Kiswahili', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'no78',
    name: 'Bibelen 1978',
    nameLocal: 'Bibelen 1978',
    abbreviation: 'NO78',
    abbreviationLocal: 'NO78',
    description: 'Norwegian Bible 1978',
    language: { id: 'no', name: 'Norwegian', nameLocal: 'Norsk', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  },
  {
    id: 'sv1917',
    name: 'Svenska Bibeln 1917',
    nameLocal: 'Svenska Bibeln 1917',
    abbreviation: 'SV1917',
    abbreviationLocal: 'SV1917',
    description: 'Swedish Bible 1917',
    language: { id: 'sv', name: 'Swedish', nameLocal: 'Svenska', script: 'Latin', scriptDirection: 'ltr' },
    source: 'static'
  }
];
