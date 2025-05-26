
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
    this.versionDiscovery = new BibleVersionDiscovery(this.githubService);
  }

  async fetchVersionsFromGitHub(): Promise<BibleVersion[]> {
    try {
      console.log('Discovering Bible versions from local scripture files...');
      return await this.versionDiscovery.discoverVersionsFromFiles();
    } catch (error) {
      console.error('Error fetching versions from local data:', error);
      return [];
    }
  }

  async fetchBooksFromGitHub(bibleId: string): Promise<Book[]> {
    try {
      console.log(`Loading books for ${bibleId} from scripture data...`);
      
      // Try with fallbacks for different file naming conventions
      const fallbackIds = [
        bibleId.toLowerCase(),
        bibleId.toUpperCase(),
        bibleId
      ].filter((id, index, arr) => arr.indexOf(id) === index);

      let bibleData = null;
      for (const id of fallbackIds) {
        try {
          bibleData = await this.githubService.fetchFromGitHub(`${id}.json`);
          console.log(`Successfully loaded data using ID: ${id}`);
          break;
        } catch (error) {
          console.log(`Failed to load with ID ${id}, trying next...`);
          continue;
        }
      }

      if (!bibleData) {
        throw new Error(`Could not load Bible data for any variant of ${bibleId}`);
      }
      
      // Handle different JSON structures - some have books wrapper, some don't
      let booksData = bibleData;
      if (bibleData.books) {
        booksData = bibleData.books;
      }
      
      if (booksData && typeof booksData === 'object') {
        const books = Object.keys(booksData).map((bookKey, index) => {
          const bookName = BibleBookMapper.getBookName(bookKey);
          
          return {
            id: bookKey.toUpperCase(),
            bibleId,
            abbreviation: bookKey.toUpperCase(),
            name: bookName,
            nameLong: bookName
          };
        });
        
        console.log(`Successfully loaded ${books.length} books for ${bibleId}:`, books.slice(0, 3).map(b => b.name));
        return books;
      }
      
      throw new Error('Invalid scripture data format');
    } catch (error) {
      console.error(`Error loading books for ${bibleId}:`, error);
      throw error;
    }
  }

  async fetchChaptersFromGitHub(bibleId: string, bookId: string): Promise<Chapter[]> {
    try {
      console.log(`Loading chapters for ${bibleId}:${bookId} from scripture data...`);
      
      // Try with fallbacks for different file naming conventions
      const fallbackIds = [
        bibleId.toLowerCase(),
        bibleId.toUpperCase(), 
        bibleId
      ].filter((id, index, arr) => arr.indexOf(id) === index);

      let bibleData = null;
      for (const id of fallbackIds) {
        try {
          bibleData = await this.githubService.fetchFromGitHub(`${id}.json`);
          break;
        } catch (error) {
          continue;
        }
      }

      if (!bibleData) {
        throw new Error(`Could not load Bible data for ${bibleId}`);
      }

      const bookKey = bookId.toLowerCase();
      
      // Handle different JSON structures
      let booksData = bibleData.books || bibleData;
      
      if (booksData && booksData[bookKey]) {
        const bookData = booksData[bookKey];
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
      
      throw new Error('Book not found in scripture data');
    } catch (error) {
      console.error(`Error loading chapters for ${bibleId}:${bookId}:`, error);
      throw error;
    }
  }

  async fetchChapterTextFromGitHub(bibleId: string, chapterId: string): Promise<any> {
    try {
      const [, bookId, chapterNum] = chapterId.split('.');
      console.log(`Loading scripture text for ${bibleId}:${bookId}:${chapterNum}...`);
      
      // Try with fallbacks for different file naming conventions
      const fallbackIds = [
        bibleId.toLowerCase(),
        bibleId.toUpperCase(),
        bibleId
      ].filter((id, index, arr) => arr.indexOf(id) === index);

      let bibleData = null;
      let successfulId = null;
      
      for (const id of fallbackIds) {
        try {
          console.log(`Trying to fetch ${id}.json...`);
          bibleData = await this.githubService.fetchFromGitHub(`${id}.json`);
          successfulId = id;
          console.log(`Successfully loaded ${id}.json`);
          break;
        } catch (error) {
          console.log(`Failed to load ${id}.json:`, error.message);
          continue;
        }
      }

      if (!bibleData) {
        throw new Error(`Could not load Bible data for any variant of ${bibleId}: ${fallbackIds.join(', ')}`);
      }

      // Map common book abbreviations to the keys used in JSON files
      const bookKeyMappings: Record<string, string[]> = {
        'GEN': ['genesis', 'gen', 'ge'],
        'EXO': ['exodus', 'exo', 'ex'],
        'LEV': ['leviticus', 'lev', 'le'],
        'NUM': ['numbers', 'num', 'nu'],
        'DEU': ['deuteronomy', 'deu', 'dt'],
        'JOS': ['joshua', 'jos', 'jsh'],
        'JDG': ['judges', 'jdg', 'jg'],
        'RUT': ['ruth', 'rut', 'ru'],
        'MAT': ['matthew', 'mat', 'mt'],
        'MRK': ['mark', 'mrk', 'mk'],
        'LUK': ['luke', 'luk', 'lk'],
        'JHN': ['john', 'jhn', 'jn'],
        'ACT': ['acts', 'act', 'ac'],
        'ROM': ['romans', 'rom', 'ro'],
        // Add more mappings as needed
      };

      const possibleBookKeys = bookKeyMappings[bookId.toUpperCase()] || [bookId.toLowerCase()];
      
      // Handle different JSON structures
      let booksData = bibleData.books || bibleData;
      
      console.log(`Looking for book using keys: ${possibleBookKeys.join(', ')} in data from ${successfulId}.json`);
      console.log(`Available books:`, Object.keys(booksData).slice(0, 10));
      
      let foundBookKey = null;
      let chapterData = null;
      
      // Try to find the book using different key variations
      for (const bookKey of possibleBookKeys) {
        if (booksData[bookKey] && booksData[bookKey][chapterNum]) {
          foundBookKey = bookKey;
          chapterData = booksData[bookKey][chapterNum];
          break;
        }
      }
      
      if (chapterData) {
        const bookName = BibleBookMapper.getBookName(foundBookKey);
        
        console.log(`Successfully loaded scripture data for ${bibleId}:${foundBookKey}:${chapterNum}`, {
          dataType: typeof chapterData,
          isArray: Array.isArray(chapterData),
          keyCount: typeof chapterData === 'object' ? Object.keys(chapterData).length : 0,
          sampleKeys: typeof chapterData === 'object' ? Object.keys(chapterData).slice(0, 5) : [],
          hasVerses: typeof chapterData === 'object' && Object.keys(chapterData).some(key => !isNaN(parseInt(key))),
          sampleContent: typeof chapterData === 'object' ? 
            Object.values(chapterData).slice(0, 2).map(v => typeof v === 'string' ? v.substring(0, 50) : v) : 
            chapterData
        });
        
        const content = BibleContentParser.parseChapterContent(chapterData, bookName, chapterNum);
        
        return {
          id: chapterId,
          bibleId,
          reference: `${bookName} ${chapterNum}`,
          content
        };
      }
      
      console.log(`Chapter not found: ${possibleBookKeys.join('/')}[${chapterNum}] in ${successfulId}.json`);
      throw new Error(`Scripture chapter not found in data: ${bookId} ${chapterNum}`);
    } catch (error) {
      console.error(`Error loading scripture text for ${chapterId}:`, error);
      throw error;
    }
  }
}

export const bibleDataFetcher = new BibleDataFetcher();
