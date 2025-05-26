import { BibleVersion } from '../types/bibleTypes';
import { GITHUB_BIBLE_VERSIONS } from './githubBibleVersions';

// Original STATIC_BIBLE_VERSIONS array
export const STATIC_BIBLE_VERSIONS: BibleVersion[] = [
  {
    id: 'de4e12af7f28f599-01',
    name: 'American Standard Version',
    nameLocal: 'American Standard Version',
    abbreviation: 'ASV',
    abbreviationLocal: 'ASV',
    description: 'The American Standard Version Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'static'
  },
  {
    id: 'niv',
    name: 'New International Version',
    nameLocal: 'New International Version',
    abbreviation: 'NIV',
    abbreviationLocal: 'NIV',
    description: 'The New International Version Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'static'
  },
  // Add GitHub versions
  ...GITHUB_BIBLE_VERSIONS,
  // Enhanced versions with GitHub sources
  {
    id: 'ult',
    name: 'unfoldingWord Literal Text',
    nameLocal: 'unfoldingWord Literal Text',
    abbreviation: 'ULT',
    abbreviationLocal: 'ULT',
    description: 'unfoldingWord Literal Text - Open License Bible Translation',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-unfolding'
  },
  {
    id: 'ust',
    name: 'unfoldingWord Simplified Text',
    nameLocal: 'unfoldingWord Simplified Text',
    abbreviation: 'UST',
    abbreviationLocal: 'UST',
    description: 'unfoldingWord Simplified Text - Open License Bible Translation',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-unfolding'
  },
  {
    id: 'step-kjv',
    name: 'STEP Bible KJV',
    nameLocal: 'STEP Bible KJV',
    abbreviation: 'STEP-KJV',
    abbreviationLocal: 'STEP-KJV',
    description: 'STEPBible.org King James Version with enhanced features',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-step'
  },
  {
    id: 'step-hebrew',
    name: 'STEP Bible Hebrew',
    nameLocal: 'STEP Bible Hebrew',
    abbreviation: 'STEP-HE',
    abbreviationLocal: 'STEP-HE',
    description: 'STEPBible.org Hebrew Old Testament',
    language: {
      id: 'he',
      name: 'Hebrew',
      nameLocal: 'עברית',
      script: 'Hebrew',
      scriptDirection: 'rtl'
    },
    source: 'github-step'
  },
  {
    id: 'step-greek',
    name: 'STEP Bible Greek',
    nameLocal: 'STEP Bible Greek',
    abbreviation: 'STEP-GR',
    abbreviationLocal: 'STEP-GR',
    description: 'STEPBible.org Greek New Testament',
    language: {
      id: 'el',
      name: 'Greek',
      nameLocal: 'Ελληνικά',
      script: 'Greek',
      scriptDirection: 'ltr'
    },
    source: 'github-step'
  }
];
