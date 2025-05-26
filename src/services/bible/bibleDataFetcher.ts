
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
      
      const bibleData = await this.githubService.fetchFromGitHub(`${bibleId}.json`);
      
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
      
      const bibleData = await this.githubService.fetchFromGitHub(`${bibleId}.json`);
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
      
      const bibleData = await this.githubService.fetchFromGitHub(`${bibleId}.json`);
      const bookKey = bookId.toLowerCase();
      
      // Handle different JSON structures
      let booksData = bibleData.books || bibleData;
      
      if (booksData && booksData[bookKey] && booksData[bookKey][chapterNum]) {
        const chapterData = booksData[bookKey][chapterNum];
        const bookName = BibleBookMapper.getBookName(bookKey);
        
        console.log(`Successfully loaded scripture for ${bibleId}:${bookId}:${chapterNum}`, {
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
      
      throw new Error('Scripture chapter not found in data');
    } catch (error) {
      console.error(`Error loading scripture text for ${chapterId}:`, error);
      throw error;
    }
  }
}

export const bibleDataFetcher = new BibleDataFetcher();
