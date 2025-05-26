
import { Book } from '../../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../../data/staticBibleVersions';
import { STANDARD_BOOKS } from '../../data/standardBooks';
import { BibleCache } from '../bibleCache';
import { bibleDataFetcher } from '../bibleDataFetcher';

export class BibleBookService {
  private cache = new BibleCache();
  private githubService: any;

  constructor() {
    // Import the GitHub service
    import('../githubBibleSources').then(module => {
      this.githubService = module.githubBibleService;
    });
  }

  async getBooks(bibleId: string): Promise<Book[]> {
    const cacheKey = `books_${bibleId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached books for ${bibleId}`);
      return cachedData;
    }

    console.log(`Loading books for ${bibleId}...`);
    
    // Check if this is a bible-data version
    const version = STATIC_BIBLE_VERSIONS.find(v => v.id === bibleId);
    if (version?.source === 'github-data') {
      try {
        const githubBooks = await bibleDataFetcher.fetchBooksFromGitHub(bibleId);
        this.cache.setCachedData(cacheKey, githubBooks);
        console.log(`Loaded ${githubBooks.length} books from bible-data for ${bibleId}`);
        return githubBooks;
      } catch (error) {
        console.warn(`bible-data books fetch failed for ${bibleId}:`, error);
      }
    }
    
    // Check for other GitHub sources
    if (version?.source === 'github-unfolding' && this.githubService) {
      console.log(`Trying GitHub unfoldingWord for books of ${bibleId}`);
      // GitHub unfoldingWord books are not available, fallback to standard books
    }

    if (version?.source === 'github-step' && this.githubService) {
      console.log(`Trying GitHub STEPBible for books of ${bibleId}`);
      // GitHub STEPBible books are not available, fallback to standard books
    }
    
    // Fallback to standard books structure
    const books = STANDARD_BOOKS.map(book => ({
      ...book,
      bibleId
    }));
    
    this.cache.setCachedData(cacheKey, books);
    console.log(`Loaded ${books.length} standard books for ${bibleId}`);
    return books;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const bibleBookService = new BibleBookService();
