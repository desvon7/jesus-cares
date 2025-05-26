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
      console.log('Discovering Bible versions from bible-data repository...');
      
      // Try to fetch from the data directory structure
      try {
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
      } catch (error) {
        console.log('No versions.json found, scanning for available Bible files...');
      }
      
      // If versions.json doesn't exist, discover from available JSON files
      return await this.discoverVersionsFromFiles();
      
    } catch (error) {
      console.error('Error fetching versions from GitHub:', error);
      return await this.discoverVersionsFromFiles();
    }
  }

  private async discoverVersionsFromFiles(): Promise<BibleVersion[]> {
    // Extended list of Bible version abbreviations to try based on your repository
    const commonVersions = [
      // Main versions
      { id: 'kjv', name: 'King James Version', abbr: 'KJV' },
      { id: 'niv', name: 'New International Version', abbr: 'NIV' },
      { id: 'esv', name: 'English Standard Version', abbr: 'ESV' },
      { id: 'nasb', name: 'New American Standard Bible', abbr: 'NASB' },
      { id: 'nkjv', name: 'New King James Version', abbr: 'NKJV' },
      { id: 'nlt', name: 'New Living Translation', abbr: 'NLT' },
      { id: 'asv', name: 'American Standard Version', abbr: 'ASV' },
      { id: 'web', name: 'World English Bible', abbr: 'WEB' },
      { id: 'ylt', name: 'Young\'s Literal Translation', abbr: 'YLT' },
      { id: 'darby', name: 'Darby Translation', abbr: 'DARBY' },
      
      // Additional versions from your repository
      { id: 'amp', name: 'Amplified Bible', abbr: 'AMP' },
      { id: 'ampc', name: 'Amplified Bible Classic', abbr: 'AMPC' },
      { id: 'bsb', name: 'Berean Study Bible', abbr: 'BSB' },
      { id: 'ceb', name: 'Common English Bible', abbr: 'CEB' },
      { id: 'cev', name: 'Contemporary English Version', abbr: 'CEV' },
      { id: 'cjb', name: 'Complete Jewish Bible', abbr: 'CJB' },
      { id: 'csb', name: 'Christian Standard Bible', abbr: 'CSB' },
      { id: 'erv', name: 'Easy-to-Read Version', abbr: 'ERV' },
      { id: 'fbv', name: 'Free Bible Version', abbr: 'FBV' },
      { id: 'gnv', name: 'Geneva Bible', abbr: 'GNV' },
      { id: 'gw', name: 'God\'s Word Translation', abbr: 'GW' },
      { id: 'hcsb', name: 'Holman Christian Standard Bible', abbr: 'HCSB' },
      { id: 'icb', name: 'International Children\'s Bible', abbr: 'ICB' },
      { id: 'jub', name: 'Jubilee Bible 2000', abbr: 'JUB' },
      { id: 'kjvaae', name: 'King James Version American Edition', abbr: 'KJVAAE' },
      { id: 'leb', name: 'Lexham English Bible', abbr: 'LEB' },
      { id: 'lsb', name: 'Legacy Standard Bible', abbr: 'LSB' },
      { id: 'mev', name: 'Modern English Version', abbr: 'MEV' },
      { id: 'msg', name: 'The Message', abbr: 'MSG' },
      { id: 'nabre', name: 'New American Bible Revised Edition', abbr: 'NABRE' },
      { id: 'nasb1995', name: 'New American Standard Bible 1995', abbr: 'NASB1995' },
      { id: 'nasb2020', name: 'New American Standard Bible 2020', abbr: 'NASB2020' },
      { id: 'ncv', name: 'New Century Version', abbr: 'NCV' },
      { id: 'net', name: 'New English Translation', abbr: 'NET' },
      { id: 'nirv', name: 'New International Reader\'s Version', abbr: 'NIRV' },
      { id: 'nivuk', name: 'New International Version UK', abbr: 'NIVUK' },
      { id: 'nmv', name: 'New Millennium Version', abbr: 'NMV' },
      { id: 'nrsv', name: 'New Revised Standard Version', abbr: 'NRSV' },
      { id: 'nrsvue', name: 'New Revised Standard Version Updated Edition', abbr: 'NRSVUE' },
      { id: 'rsv', name: 'Revised Standard Version', abbr: 'RSV' },
      { id: 'tlv', name: 'Tree of Life Version', abbr: 'TLV' },
      { id: 'tpt', name: 'The Passion Translation', abbr: 'TPT' },
      { id: 'vulg', name: 'Vulgate', abbr: 'VULG' },
      { id: 'ylt98', name: 'Young\'s Literal Translation 1898', abbr: 'YLT98' }
    ];

    const availableVersions: BibleVersion[] = [];

    for (const version of commonVersions) {
      try {
        // Check if this version exists by trying to fetch the JSON file
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
        
        // Handle the specific format from your repository
        if (Array.isArray(chapterData)) {
          // Array of verse objects with "content" and "reference" fields
          chapterData.forEach((verse, index) => {
            if (verse && typeof verse === 'object') {
              const verseContent = verse.content || verse.text || '';
              const verseRef = verse.reference || '';
              
              // Extract verse number from reference (e.g. "Job 1:1" -> "1")
              const verseMatch = verseRef.match(/:(\d+)$/);
              const verseNumber = verseMatch ? verseMatch[1] : (index + 1).toString();
              
              content += `<p><sup>${verseNumber}</sup> ${verseContent}</p>`;
            } else if (typeof verse === 'string') {
              // Fallback for simple string verses
              content += `<p><sup>${index + 1}</sup> ${verse}</p>`;
            }
          });
        } else if (typeof chapterData === 'object') {
          // Object with verse numbers as keys
          Object.keys(chapterData).forEach((verseKey) => {
            const verse = chapterData[verseKey];
            if (verse && typeof verse === 'object' && verse.content) {
              // Handle verse objects with content field
              content += `<p><sup>${verseKey}</sup> ${verse.content}</p>`;
            } else {
              // Handle simple string verses
              const verseText = typeof verse === 'string' ? verse : verse.text || verse.content || '';
              content += `<p><sup>${verseKey}</sup> ${verseText}</p>`;
            }
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
      'genesis': 'Genesis',
      'gen': 'Genesis',
      'exodus': 'Exodus',
      'exo': 'Exodus',
      'leviticus': 'Leviticus',
      'lev': 'Leviticus',
      'numbers': 'Numbers',
      'num': 'Numbers',
      'deuteronomy': 'Deuteronomy',
      'deu': 'Deuteronomy',
      'joshua': 'Joshua',
      'jos': 'Joshua',
      'judges': 'Judges',
      'jdg': 'Judges',
      'ruth': 'Ruth',
      'rut': 'Ruth',
      '1samuel': '1 Samuel',
      '1sa': '1 Samuel',
      '2samuel': '2 Samuel',
      '2sa': '2 Samuel',
      '1kings': '1 Kings',
      '1ki': '1 Kings',
      '2kings': '2 Kings',
      '2ki': '2 Kings',
      '1chronicles': '1 Chronicles',
      '1ch': '1 Chronicles',
      '2chronicles': '2 Chronicles',
      '2ch': '2 Chronicles',
      'ezra': 'Ezra',
      'ezr': 'Ezra',
      'nehemiah': 'Nehemiah',
      'neh': 'Nehemiah',
      'esther': 'Esther',
      'est': 'Esther',
      'job': 'Job',
      'psalms': 'Psalms',
      'psa': 'Psalms',
      'psalm': 'Psalms',
      'proverbs': 'Proverbs',
      'pro': 'Proverbs',
      'ecclesiastes': 'Ecclesiastes',
      'ecc': 'Ecclesiastes',
      'songofsolomon': 'Song of Solomon',
      'sng': 'Song of Solomon',
      'isaiah': 'Isaiah',
      'isa': 'Isaiah',
      'jeremiah': 'Jeremiah',
      'jer': 'Jeremiah',
      'lamentations': 'Lamentations',
      'lam': 'Lamentations',
      'ezekiel': 'Ezekiel',
      'eze': 'Ezekiel',
      'daniel': 'Daniel',
      'dan': 'Daniel',
      'hosea': 'Hosea',
      'hos': 'Hosea',
      'joel': 'Joel',
      'joe': 'Joel',
      'amos': 'Amos',
      'amo': 'Amos',
      'obadiah': 'Obadiah',
      'oba': 'Obadiah',
      'jonah': 'Jonah',
      'jon': 'Jonah',
      'micah': 'Micah',
      'mic': 'Micah',
      'nahum': 'Nahum',
      'nah': 'Nahum',
      'habakkuk': 'Habakkuk',
      'hab': 'Habakkuk',
      'zephaniah': 'Zephaniah',
      'zep': 'Zephaniah',
      'haggai': 'Haggai',
      'hag': 'Haggai',
      'zechariah': 'Zechariah',
      'zec': 'Zechariah',
      'malachi': 'Malachi',
      'mal': 'Malachi',
      
      // New Testament
      'matthew': 'Matthew',
      'mat': 'Matthew',
      'mark': 'Mark',
      'mar': 'Mark',
      'luke': 'Luke',
      'luk': 'Luke',
      'john': 'John',
      'joh': 'John',
      'acts': 'Acts',
      'act': 'Acts',
      'romans': 'Romans',
      'rom': 'Romans',
      '1corinthians': '1 Corinthians',
      '1co': '1 Corinthians',
      '2corinthians': '2 Corinthians',
      '2co': '2 Corinthians',
      'galatians': 'Galatians',
      'gal': 'Galatians',
      'ephesians': 'Ephesians',
      'eph': 'Ephesians',
      'philippians': 'Philippians',
      'phi': 'Philippians',
      'colossians': 'Colossians',
      'col': 'Colossians',
      '1thessalonians': '1 Thessalonians',
      '1th': '1 Thessalonians',
      '2thessalonians': '2 Thessalonians',
      '2th': '2 Thessalonians',
      '1timothy': '1 Timothy',
      '1ti': '1 Timothy',
      '2timothy': '2 Timothy',
      '2ti': '2 Timothy',
      'titus': 'Titus',
      'tit': 'Titus',
      'philemon': 'Philemon',
      'phm': 'Philemon',
      'hebrews': 'Hebrews',
      'heb': 'Hebrews',
      'james': 'James',
      'jam': 'James',
      '1peter': '1 Peter',
      '1pe': '1 Peter',
      '2peter': '2 Peter',
      '2pe': '2 Peter',
      '1john': '1 John',
      '1jo': '1 John',
      '2john': '2 John',
      '2jo': '2 John',
      '3john': '3 John',
      '3jo': '3 John',
      'jude': 'Jude',
      'jud': 'Jude',
      'revelation': 'Revelation',
      'rev': 'Revelation'
    };
    
    const lowerKey = bookKey.toLowerCase();
    return bookNames[lowerKey] || bookKey.charAt(0).toUpperCase() + bookKey.slice(1);
  }
}

export const bibleDataFetcher = new BibleDataFetcher();
