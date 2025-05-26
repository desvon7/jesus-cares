
import { BibleVersion, Book, Chapter, Verse } from '../types/bibleTypes';

export class BibleDataFetcher {
  private githubRepo = 'desvon7/bible-data';
  private baseUrl = `https://raw.githubusercontent.com/${this.githubRepo}/main`;

  async fetchFromGitHub(path: string) {
    const url = `${this.baseUrl}/${path}`;
    console.log(`Attempting to fetch from GitHub: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched ${path}:`, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${path}:`, error);
      throw error;
    }
  }

  async fetchVersionsFromGitHub(): Promise<BibleVersion[]> {
    try {
      console.log('Attempting to fetch Bible versions from bible-data repository...');
      
      // Try to fetch from the data directory structure
      const versionsData = await this.fetchFromGitHub('data/versions.json');
      
      if (Array.isArray(versionsData)) {
        return versionsData.map((version: any) => ({
          id: version.id || version.abbreviation || 'unknown',
          name: version.name || version.full_name || 'Unknown Version',
          nameLocal: version.nameLocal || version.name || 'Unknown Version',
          abbreviation: version.abbreviation || version.id || 'UNK',
          abbreviationLocal: version.abbreviationLocal || version.abbreviation || 'UNK',
          description: version.description || `${version.name || 'Bible'} translation`,
          language: {
            id: version.language?.id || 'en',
            name: version.language?.name || 'English',
            nameLocal: version.language?.nameLocal || 'English',
            script: version.language?.script || 'Latin',
            scriptDirection: version.language?.scriptDirection || 'ltr'
          },
          source: 'github-data' as const
        }));
      }
      
      // If versions.json doesn't exist, try to infer from available JSON files
      console.log('No versions.json found, scanning for available Bible files...');
      return await this.discoverVersionsFromFiles();
      
    } catch (error) {
      console.error('Error fetching versions from GitHub:', error);
      return await this.discoverVersionsFromFiles();
    }
  }

  private async discoverVersionsFromFiles(): Promise<BibleVersion[]> {
    // Common Bible version abbreviations to try
    const commonVersions = [
      { id: 'kjv', name: 'King James Version', abbr: 'KJV' },
      { id: 'niv', name: 'New International Version', abbr: 'NIV' },
      { id: 'esv', name: 'English Standard Version', abbr: 'ESV' },
      { id: 'nasb', name: 'New American Standard Bible', abbr: 'NASB' },
      { id: 'nkjv', name: 'New King James Version', abbr: 'NKJV' },
      { id: 'nlt', name: 'New Living Translation', abbr: 'NLT' },
      { id: 'asv', name: 'American Standard Version', abbr: 'ASV' },
      { id: 'web', name: 'World English Bible', abbr: 'WEB' },
      { id: 'ylt', name: 'Young\'s Literal Translation', abbr: 'YLT' },
      { id: 'darby', name: 'Darby Translation', abbr: 'DARBY' }
    ];

    const availableVersions: BibleVersion[] = [];

    for (const version of commonVersions) {
      try {
        // Check if this version exists by trying to fetch Genesis 1
        await this.fetchFromGitHub(`data/${version.id}.json`);
        
        availableVersions.push({
          id: version.id,
          name: version.name,
          nameLocal: version.name,
          abbreviation: version.abbr,
          abbreviationLocal: version.abbr,
          description: `${version.name} - Biblical text`,
          language: {
            id: 'en',
            name: 'English',
            nameLocal: 'English',
            script: 'Latin',
            scriptDirection: 'ltr'
          },
          source: 'github-data' as const
        });
        
        console.log(`Found available version: ${version.name}`);
      } catch (error) {
        // Version not available, continue to next
        console.log(`Version ${version.id} not available`);
      }
    }

    return availableVersions;
  }

  async fetchBooksFromGitHub(bibleId: string): Promise<Book[]> {
    try {
      console.log(`Attempting to fetch books for ${bibleId} from GitHub...`);
      
      // First try to get the full Bible data
      const bibleData = await this.fetchFromGitHub(`data/${bibleId}.json`);
      
      if (bibleData && typeof bibleData === 'object') {
        // Extract books from the Bible data structure
        const books = Object.keys(bibleData).map((bookKey, index) => {
          const bookData = bibleData[bookKey];
          const bookName = this.getBookName(bookKey);
          
          return {
            id: bookKey.toUpperCase(),
            bibleId,
            abbreviation: bookKey.toUpperCase(),
            name: bookName,
            nameLong: bookName
          };
        });
        
        console.log(`Found ${books.length} books for ${bibleId}`);
        return books;
      }
      
      throw new Error('Invalid Bible data format');
    } catch (error) {
      console.error(`Error fetching books for ${bibleId}:`, error);
      throw error;
    }
  }

  async fetchChaptersFromGitHub(bibleId: string, bookId: string): Promise<Chapter[]> {
    try {
      console.log(`Attempting to fetch chapters for ${bibleId}:${bookId} from GitHub...`);
      
      const bibleData = await this.fetchFromGitHub(`data/${bibleId}.json`);
      const bookKey = bookId.toLowerCase();
      
      if (bibleData && bibleData[bookKey]) {
        const bookData = bibleData[bookKey];
        const chapters = Object.keys(bookData).map((chapterKey) => ({
          id: `${bibleId}.${bookId}.${chapterKey}`,
          bibleId,
          bookId,
          number: chapterKey,
          reference: `${this.getBookName(bookKey)} ${chapterKey}`
        }));
        
        console.log(`Found ${chapters.length} chapters for ${bibleId}:${bookId}`);
        return chapters;
      }
      
      throw new Error('Book not found in Bible data');
    } catch (error) {
      console.error(`Error fetching chapters for ${bibleId}:${bookId}:`, error);
      throw error;
    }
  }

  async fetchChapterTextFromGitHub(bibleId: string, chapterId: string): Promise<any> {
    try {
      const [, bookId, chapterNum] = chapterId.split('.');
      console.log(`Attempting to fetch chapter text for ${bibleId}:${bookId}:${chapterNum} from GitHub...`);
      
      const bibleData = await this.fetchFromGitHub(`data/${bibleId}.json`);
      const bookKey = bookId.toLowerCase();
      
      if (bibleData && bibleData[bookKey] && bibleData[bookKey][chapterNum]) {
        const chapterData = bibleData[bookKey][chapterNum];
        const bookName = this.getBookName(bookKey);
        
        let content = `<h3>${bookName} ${chapterNum}</h3>`;
        
        // Handle different data structures
        if (Array.isArray(chapterData)) {
          // Array of verses
          chapterData.forEach((verse, index) => {
            const verseNumber = index + 1;
            const verseText = typeof verse === 'string' ? verse : verse.text || verse.content || '';
            content += `<p><sup>${verseNumber}</sup> ${verseText}</p>`;
          });
        } else if (typeof chapterData === 'object') {
          // Object with verse numbers as keys
          Object.keys(chapterData).forEach((verseKey) => {
            const verseText = chapterData[verseKey];
            content += `<p><sup>${verseKey}</sup> ${verseText}</p>`;
          });
        } else if (typeof chapterData === 'string') {
          // Single string content
          content += `<p>${chapterData}</p>`;
        }
        
        return {
          id: chapterId,
          bibleId,
          reference: `${bookName} ${chapterNum}`,
          content
        };
      }
      
      throw new Error('Chapter not found in Bible data');
    } catch (error) {
      console.error(`Error fetching chapter text for ${chapterId}:`, error);
      throw error;
    }
  }

  private getBookName(bookKey: string): string {
    const bookNames: Record<string, string> = {
      // Old Testament
      'genesis': 'Genesis', 'gen': 'Genesis',
      'exodus': 'Exodus', 'exo': 'Exodus',
      'leviticus': 'Leviticus', 'lev': 'Leviticus',
      'numbers': 'Numbers', 'num': 'Numbers',
      'deuteronomy': 'Deuteronomy', 'deu': 'Deuteronomy',
      'joshua': 'Joshua', 'jos': 'Joshua',
      'judges': 'Judges', 'jdg': 'Judges',
      'ruth': 'Ruth', 'rut': 'Ruth',
      '1samuel': '1 Samuel', '1sa': '1 Samuel',
      '2samuel': '2 Samuel', '2sa': '2 Samuel',
      '1kings': '1 Kings', '1ki': '1 Kings',
      '2kings': '2 Kings', '2ki': '2 Kings',
      '1chronicles': '1 Chronicles', '1ch': '1 Chronicles',
      '2chronicles': '2 Chronicles', '2ch': '2 Chronicles',
      'ezra': 'Ezra', 'ezr': 'Ezra',
      'nehemiah': 'Nehemiah', 'neh': 'Nehemiah',
      'esther': 'Esther', 'est': 'Esther',
      'job': 'Job',
      'psalms': 'Psalms', 'psa': 'Psalms', 'psalm': 'Psalms',
      'proverbs': 'Proverbs', 'pro': 'Proverbs',
      'ecclesiastes': 'Ecclesiastes', 'ecc': 'Ecclesiastes',
      'songofsolomon': 'Song of Solomon', 'sng': 'Song of Solomon',
      'isaiah': 'Isaiah', 'isa': 'Isaiah',
      'jeremiah': 'Jeremiah', 'jer': 'Jeremiah',
      'lamentations': 'Lamentations', 'lam': 'Lamentations',
      'ezekiel': 'Ezekiel', 'eze': 'Ezekiel',
      'daniel': 'Daniel', 'dan': 'Daniel',
      'hosea': 'Hosea', 'hos': 'Hosea',
      'joel': 'Joel', 'joe': 'Joel',
      'amos': 'Amos', 'amo': 'Amos',
      'obadiah': 'Obadiah', 'oba': 'Obadiah',
      'jonah': 'Jonah', 'jon': 'Jonah',
      'micah': 'Micah', 'mic': 'Micah',
      'nahum': 'Nahum', 'nah': 'Nahum',
      'habakkuk': 'Habakkuk', 'hab': 'Habakkuk',
      'zephaniah': 'Zephaniah', 'zep': 'Zephaniah',
      'haggai': 'Haggai', 'hag': 'Haggai',
      'zechariah': 'Zechariah', 'zec': 'Zechariah',
      'malachi': 'Malachi', 'mal': 'Malachi',
      
      // New Testament
      'matthew': 'Matthew', 'mat': 'Matthew',
      'mark': 'Mark', 'mar': 'Mark',
      'luke': 'Luke', 'luk': 'Luke',
      'john': 'John', 'joh': 'John',
      'acts': 'Acts', 'act': 'Acts',
      'romans': 'Romans', 'rom': 'Romans',
      '1corinthians': '1 Corinthians', '1co': '1 Corinthians',
      '2corinthians': '2 Corinthians', '2co': '2 Corinthians',
      'galatians': 'Galatians', 'gal': 'Galatians',
      'ephesians': 'Ephesians', 'eph': 'Ephesians',
      'philippians': 'Philippians', 'phi': 'Philippians',
      'colossians': 'Colossians', 'col': 'Colossians',
      '1thessalonians': '1 Thessalonians', '1th': '1 Thessalonians',
      '2thessalonians': '2 Thessalonians', '2th': '2 Thessalonians',
      '1timothy': '1 Timothy', '1ti': '1 Timothy',
      '2timothy': '2 Timothy', '2ti': '2 Timothy',
      'titus': 'Titus', 'tit': 'Titus',
      'philemon': 'Philemon', 'phm': 'Philemon',
      'hebrews': 'Hebrews', 'heb': 'Hebrews',
      'james': 'James', 'jam': 'James',
      '1peter': '1 Peter', '1pe': '1 Peter',
      '2peter': '2 Peter', '2pe': '2 Peter',
      '1john': '1 John', '1jo': '1 John',
      '2john': '2 John', '2jo': '2 John',
      '3john': '3 John', '3jo': '3 John',
      'jude': 'Jude', 'jud': 'Jude',
      'revelation': 'Revelation', 'rev': 'Revelation'
    };
    
    const lowerKey = bookKey.toLowerCase();
    return bookNames[lowerKey] || bookKey.charAt(0).toUpperCase() + bookKey.slice(1);
  }
}

export const bibleDataFetcher = new BibleDataFetcher();
