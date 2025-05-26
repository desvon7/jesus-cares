
import { BibleVersion } from '../types/bibleTypes';

export const GITHUB_BIBLE_VERSIONS: BibleVersion[] = [
  {
    id: 'kjv',
    name: 'King James Version',
    nameLocal: 'King James Version',
    abbreviation: 'KJV',
    abbreviationLocal: 'KJV',
    description: 'The King James Version (KJV) is an English translation of the Bible published in 1611',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-data'
  },
  {
    id: 'niv',
    name: 'New International Version',
    nameLocal: 'New International Version',
    abbreviation: 'NIV',
    abbreviationLocal: 'NIV',
    description: 'The New International Version (NIV) is an English translation of the Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-data'
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    nameLocal: 'English Standard Version',
    abbreviation: 'ESV',
    abbreviationLocal: 'ESV',
    description: 'The English Standard Version (ESV) is an English translation of the Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-data'
  },
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    nameLocal: 'New American Standard Bible',
    abbreviation: 'NASB',
    abbreviationLocal: 'NASB',
    description: 'The New American Standard Bible (NASB) is an English translation of the Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-data'
  },
  {
    id: 'nkjv',
    name: 'New King James Version',
    nameLocal: 'New King James Version',
    abbreviation: 'NKJV',
    abbreviationLocal: 'NKJV',
    description: 'The New King James Version (NKJV) is an English translation of the Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-data'
  },
  {
    id: 'nlt',
    name: 'New Living Translation',
    nameLocal: 'New Living Translation',
    abbreviation: 'NLT',
    abbreviationLocal: 'NLT',
    description: 'The New Living Translation (NLT) is an English translation of the Bible',
    language: {
      id: 'en',
      name: 'English',
      nameLocal: 'English',
      script: 'Latin',
      scriptDirection: 'ltr'
    },
    source: 'github-data'
  }
];
