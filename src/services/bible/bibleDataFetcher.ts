
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
      console.log('Discovering Bible versions from bible-data repository...');
      return await this.versionDiscovery.discoverVersionsFromFiles();
    } catch (error) {
      console.error('Error fetching versions from GitHub:', error);
      return [];
    }
  }

  async fetchBooksFromGitHub(bibleId: string): Promise<Book[]> {
    try {
      console.log(`Attempting to fetch books for ${bibleId} from GitHub...`);
      
      // Fetch the Bible data directly from root (not /data/ path)
      const bibleData = await this.githubService.fetchFromGitHub(`${bibleId}.json`);
      
      if (bibleData && typeof bibleData === 'object') {
        // Extract books from the Bible data structure
        const books = Object.keys(bibleData).map((bookKey, index) => {
          const bookData = bibleData[bookKey];
          const bookName = BibleBookMapper.getBookName(bookKey);
          
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
      
      // Fetch directly from root path
      const bibleData = await this.githubService.fetchFromGitHub(`${bibleId}.json`);
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
      
      // Fetch directly from root path
      const bibleData = await this.githubService.fetchFromGitHub(`${bibleId}.json`);
      const bookKey = bookId.toLowerCase();
      
      if (bibleData && bibleData[bookKey] && bibleData[bookKey][chapterNum]) {
        const chapterData = bibleData[bookKey][chapterNum];
        const bookName = BibleBookMapper.getBookName(bookKey);
        
        const content = BibleContentParser.parseChapterContent(chapterData, bookName, chapterNum);
        
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
}

export const bibleDataFetcher = new BibleDataFetcher();
