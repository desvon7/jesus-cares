
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
      
      // Try to fetch from the data directory structure
      try {
        const versionsData = await this.githubService.fetchFromGitHub('data/versions.json');
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
      return await this.versionDiscovery.discoverVersionsFromFiles();
      
    } catch (error) {
      console.error('Error fetching versions from GitHub:', error);
      return await this.versionDiscovery.discoverVersionsFromFiles();
    }
  }

  async fetchBooksFromGitHub(bibleId: string): Promise<Book[]> {
    try {
      console.log(`Attempting to fetch books for ${bibleId} from GitHub...`);
      
      // First try to get the full Bible data
      const bibleData = await this.githubService.fetchFromGitHub(`data/${bibleId}.json`);
      
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
      
      const bibleData = await this.githubService.fetchFromGitHub(`data/${bibleId}.json`);
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
      
      const bibleData = await this.githubService.fetchFromGitHub(`data/${bibleId}.json`);
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
