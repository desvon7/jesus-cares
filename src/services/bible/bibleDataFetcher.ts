import { BibleVersion, Book, Chapter } from '../../types/bibleTypes';
import { GitHubDataService } from './githubDataService';
import { BibleVersionDiscovery } from './bibleVersionDiscovery';
import { BibleBookMapper } from './bibleBookMapper';
import { BibleContentParser } from './bibleContentParser';

export class BibleDataFetcher {
  private githubService: GitHubDataService;
  private versionDiscovery: BibleVersionDiscovery;

  constructor() {
    this.githubService = new GitHubDataService();
    this.versionDiscovery = new BibleVersionDiscovery();
  }

  async fetchVersionsFromGitHub(): Promise<BibleVersion[]> {
    try {
      console.log('Loading Bible versions from local JSON files...');
      return await this.versionDiscovery.discoverVersionsFromFiles();
    } catch (error) {
      console.error('Error fetching versions from local data:', error);
      return [];
    }
  }

  async fetchBooksFromGitHub(bibleId: string): Promise<Book[]> {
    try {
      console.log(`Loading books for ${bibleId} from local JSON file...`);
      
      // Load the JSON file directly from the data folder
      const response = await fetch(`/data/${bibleId.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${bibleId}.json: ${response.status}`);
      }
      
      const bibleData = await response.json();
      console.log(`Successfully loaded ${bibleId}.json`, { keys: Object.keys(bibleData).length });
      
      if (bibleData && typeof bibleData === 'object') {
        const books = Object.keys(bibleData).map((bookKey) => {
          const bookName = BibleBookMapper.getBookName(bookKey);
          
          return {
            id: bookKey.toUpperCase(),
            bibleId,
            abbreviation: bookKey.toUpperCase(),
            name: bookName,
            nameLong: bookName
          };
        });
        
        console.log(`Successfully loaded ${books.length} books for ${bibleId}`);
        return books;
      }
      
      throw new Error('Invalid JSON structure in Bible file');
    } catch (error) {
      console.error(`Error loading books for ${bibleId}:`, error);
      throw error;
    }
  }

  async fetchChaptersFromGitHub(bibleId: string, bookId: string): Promise<Chapter[]> {
    try {
      console.log(`Loading chapters for ${bibleId}:${bookId} from local JSON file...`);
      
      // Load the JSON file directly
      const response = await fetch(`/data/${bibleId.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${bibleId}.json`);
      }
      
      const bibleData = await response.json();
      const bookKey = bookId.toLowerCase();
      
      if (bibleData && bibleData[bookKey]) {
        const bookData = bibleData[bookKey];
        const chapters = Object.keys(bookData).map((chapterKey) => ({
          id: `${bibleId}.${bookId}.${chapterKey}`,
          bibleId,
          bookId,
          number: chapterKey,
          reference: `${BibleBookMapper.getBookName(bookKey)} ${chapterKey}`
        }));
        
        console.log(`Successfully loaded ${chapters.length} chapters for ${bibleId}:${bookId}`);
        return chapters;
      }
      
      throw new Error(`Book ${bookId} not found in ${bibleId}.json`);
    } catch (error) {
      console.error(`Error loading chapters for ${bibleId}:${bookId}:`, error);
      throw error;
    }
  }

  async fetchChapterTextFromGitHub(bibleId: string, chapterId: string): Promise<any> {
    try {
      const [, bookId, chapterNum] = chapterId.split('.');
      console.log(`Loading scripture text for ${bibleId}:${bookId}:${chapterNum}...`);
      
      // Load the JSON file directly
      const response = await fetch(`/data/${bibleId.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${bibleId}.json: ${response.status}`);
      }
      
      const bibleData = await response.json();
      
      // Map book ID variations
      const bookKeyMappings: Record<string, string[]> = {
        'GEN': ['genesis', 'gen', 'ge'],
        'EXO': ['exodus', 'exo', 'ex'],
        'LEV': ['leviticus', 'lev', 'le'],
        'NUM': ['numbers', 'num', 'nu'],
        'DEU': ['deuteronomy', 'deu', 'dt'],
        'JOS': ['joshua', 'jos', 'jsh'],
        'JDG': ['judges', 'jdg', 'jg'],
        'RUT': ['ruth', 'rut', 'ru'],
        '1SA': ['1samuel', '1sa', '1sm'],
        '2SA': ['2samuel', '2sa', '2sm'],
        '1KI': ['1kings', '1ki', '1kg'],
        '2KI': ['2kings', '2ki', '2kg'],
        '1CH': ['1chronicles', '1ch', '1chr'],
        '2CH': ['2chronicles', '2ch', '2chr'],
        'EZR': ['ezra', 'ezr'],
        'NEH': ['nehemiah', 'neh', 'ne'],
        'EST': ['esther', 'est', 'es'],
        'JOB': ['job', 'job', 'jb'],
        'PSA': ['psalms', 'psa', 'ps'],
        'PRO': ['proverbs', 'pro', 'pr'],
        'ECC': ['ecclesiastes', 'ecc', 'ec'],
        'SNG': ['song', 'sng', 'so'],
        'ISA': ['isaiah', 'isa', 'is'],
        'JER': ['jeremiah', 'jer', 'je'],
        'LAM': ['lamentations', 'lam', 'la'],
        'EZK': ['ezekiel', 'ezk', 'eze'],
        'DAN': ['daniel', 'dan', 'da'],
        'HOS': ['hosea', 'hos', 'ho'],
        'JOL': ['joel', 'jol', 'joe'],
        'AMO': ['amos', 'amo', 'am'],
        'OBA': ['obadiah', 'oba', 'ob'],
        'JON': ['jonah', 'jon', 'jnh'],
        'MIC': ['micah', 'mic', 'mi'],
        'NAM': ['nahum', 'nam', 'na'],
        'HAB': ['habakkuk', 'hab', 'hab'],
        'ZEP': ['zephaniah', 'zep', 'zph'],
        'HAG': ['haggai', 'hag', 'hg'],
        'ZEC': ['zechariah', 'zec', 'zch'],
        'MAL': ['malachi', 'mal', 'ml'],
        'MAT': ['matthew', 'mat', 'mt'],
        'MRK': ['mark', 'mrk', 'mk'],
        'LUK': ['luke', 'luk', 'lk'],
        'JHN': ['john', 'jhn', 'jn'],
        'ACT': ['acts', 'act', 'ac'],
        'ROM': ['romans', 'rom', 'ro'],
        '1CO': ['1corinthians', '1co', '1cor'],
        '2CO': ['2corinthians', '2co', '2cor'],
        'GAL': ['galatians', 'gal', 'ga'],
        'EPH': ['ephesians', 'eph', 'ep'],
        'PHP': ['philippians', 'php', 'phi'],
        'COL': ['colossians', 'col', 'co'],
        '1TH': ['1thessalonians', '1th', '1thess'],
        '2TH': ['2thessalonians', '2th', '2thess'],
        '1TI': ['1timothy', '1ti', '1tim'],
        '2TI': ['2timothy', '2ti', '2tim'],
        'TIT': ['titus', 'tit', 'ti'],
        'PHM': ['philemon', 'phm', 'phile'],
        'HEB': ['hebrews', 'heb', 'he'],
        'JAS': ['james', 'jas', 'jam'],
        '1PE': ['1peter', '1pe', '1pet'],
        '2PE': ['2peter', '2pe', '2pet'],
        '1JN': ['1john', '1jn', '1jo'],
        '2JN': ['2john', '2jn', '2jo'],
        '3JN': ['3john', '3jn', '3jo'],
        'JUD': ['jude', 'jud', 'jude'],
        'REV': ['revelation', 'rev', 're']
      };

      const possibleBookKeys = bookKeyMappings[bookId.toUpperCase()] || [bookId.toLowerCase()];
      
      console.log(`Looking for book using keys: ${possibleBookKeys.join(', ')}`);
      console.log(`Available books in ${bibleId}.json:`, Object.keys(bibleData).slice(0, 10));
      
      let foundBookKey = null;
      let chapterData = null;
      
      // Try to find the book using different key variations
      for (const bookKey of possibleBookKeys) {
        if (bibleData[bookKey] && bibleData[bookKey][chapterNum]) {
          foundBookKey = bookKey;
          chapterData = bibleData[bookKey][chapterNum];
          console.log(`Found chapter data using book key: ${bookKey}`);
          break;
        }
      }
      
      if (chapterData) {
        const bookName = BibleBookMapper.getBookName(foundBookKey);
        
        console.log(`Successfully loaded scripture data for ${bibleId}:${foundBookKey}:${chapterNum}`, {
          dataType: typeof chapterData,
          isArray: Array.isArray(chapterData),
          keyCount: typeof chapterData === 'object' ? Object.keys(chapterData).length : 0,
          sampleKeys: typeof chapterData === 'object' ? Object.keys(chapterData).slice(0, 5) : []
        });
        
        const content = BibleContentParser.parseChapterContent(chapterData, bookName, chapterNum);
        
        return {
          id: chapterId,
          bibleId,
          reference: `${bookName} ${chapterNum}`,
          content
        };
      }
      
      console.log(`Chapter not found: ${possibleBookKeys.join('/')}[${chapterNum}] in ${bibleId}.json`);
      throw new Error(`Scripture chapter not found: ${bookId} ${chapterNum}`);
    } catch (error) {
      console.error(`Error loading scripture text for ${chapterId}:`, error);
      throw error;
    }
  }
}

export const bibleDataFetcher = new BibleDataFetcher();
