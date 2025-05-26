import { BibleVersion, Book, Chapter, Verse } from '../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../data/staticBibleVersions';
import { STANDARD_BOOKS, CHAPTER_COUNTS } from '../data/standardBooks';
import { BibleCache } from './bibleCache';
import { contentGenerator } from './contentGenerator';
import { bibleDataFetcher } from './bibleDataFetcher';

class ComprehensiveBibleService {
  private cache = new BibleCache();
  private githubService: any;

  constructor() {
    // Import the GitHub service
    import('./githubBibleSources').then(module => {
      this.githubService = module.githubBibleService;
    });
  }

  async getBibleVersions(): Promise<BibleVersion[]> {
    const cacheKey = 'all_versions';
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached versions');
      return cachedData;
    }

    console.log('Fetching Bible versions from bible-data repository and static sources...');
    
    let allVersions = [...STATIC_BIBLE_VERSIONS];
    
    // Try to fetch from bible-data repository
    try {
      const githubVersions = await bibleDataFetcher.fetchVersionsFromGitHub();
      console.log(`Found ${githubVersions.length} versions from bible-data repository`);
      allVersions = [...allVersions, ...githubVersions];
    } catch (error) {
      console.warn('Could not fetch from bible-data repository, using static versions:', error);
    }

    // Remove duplicates based on ID
    const uniqueVersions = allVersions.filter((version, index, arr) => 
      arr.findIndex(v => v.id === version.id) === index
    );

    this.cache.setCachedData(cacheKey, uniqueVersions);
    console.log(`Loaded ${uniqueVersions.length} unique Bible versions`);
    return uniqueVersions;
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

  async getChapters(bibleId: string, bookId: string): Promise<Chapter[]> {
    const cacheKey = `chapters_${bibleId}_${bookId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached chapters for ${bibleId}:${bookId}`);
      return cachedData;
    }

    console.log(`Loading chapters for ${bibleId}:${bookId}...`);
    
    // Check if this is a bible-data version
    const version = STATIC_BIBLE_VERSIONS.find(v => v.id === bibleId);
    if (version?.source === 'github-data') {
      try {
        const githubChapters = await bibleDataFetcher.fetchChaptersFromGitHub(bibleId, bookId);
        this.cache.setCachedData(cacheKey, githubChapters);
        console.log(`Loaded ${githubChapters.length} chapters from bible-data for ${bibleId}:${bookId}`);
        return githubChapters;
      } catch (error) {
        console.warn(`bible-data chapters fetch failed for ${bibleId}:${bookId}:`, error);
      }
    }
    
    // Check for other GitHub sources
    if (version?.source === 'github-unfolding' && this.githubService) {
      console.log(`Trying GitHub unfoldingWord for chapters of ${bibleId}:${bookId}`);
      // GitHub unfoldingWord chapters are not available, fallback to standard chapters
    }

    if (version?.source === 'github-step' && this.githubService) {
      console.log(`Trying GitHub STEPBible for chapters of ${bibleId}:${bookId}`);
      // GitHub STEPBible chapters are not available, fallback to standard chapters
    }
    
    // Fallback to standard chapter counts
    const chapterCounts = CHAPTER_COUNTS[bookId] || 1;
    const chapters = Array.from({ length: chapterCounts }, (_, i) => ({
      id: `${bibleId}.${bookId}.${i + 1}`,
      bibleId,
      bookId,
      number: String(i + 1),
      reference: `${bookId} ${i + 1}`
    }));
    
    this.cache.setCachedData(cacheKey, chapters);
    console.log(`Loaded ${chapters.length} standard chapters for ${bibleId}:${bookId}`);
    return chapters;
  }

  async getChapterText(bibleId: string, chapterId: string): Promise<any> {
    const cacheKey = `chapter_text_${bibleId}_${chapterId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached chapter text for ${bibleId}:${chapterId}`);
      return cachedData;
    }

    console.log(`Loading chapter text for ${bibleId}:${chapterId}...`);

    const [, bookId, chapterNum] = chapterId.split('.');
    const version = STATIC_BIBLE_VERSIONS.find(v => v.id === bibleId);
    const book = STANDARD_BOOKS.find(b => b.id === bookId);

    if (version) {
      console.log(`Found version: ${version.name} (${version.source})`);

      // Try bible-data repository first if it's a github-data source
      if (version.source === 'github-data') {
        try {
          console.log(`Trying bible-data repository for ${bibleId}`);
          const content = await bibleDataFetcher.fetchChapterTextFromGitHub(bibleId, chapterId);
          this.cache.setCachedData(cacheKey, content);
          return content;
        } catch (error) {
          console.warn(`bible-data repository failed for ${bibleId}:`, error);
        }
      }

      // Try GitHub sources for enhanced versions
      if (version.source === 'github-unfolding' && this.githubService) {
        try {
          console.log(`Trying GitHub unfoldingWord for ${bibleId}`);
          const content = await this.githubService.getUnfoldingWordChapter(bibleId, bookId, parseInt(chapterNum));
          const chapterData = {
            id: chapterId,
            bibleId,
            reference: `${book?.name} ${chapterNum}`,
            content
          };
          this.cache.setCachedData(cacheKey, chapterData);
          return chapterData;
        } catch (error) {
          console.warn(`GitHub unfoldingWord failed for ${bibleId}:`, error);
        }
      }

      if (version.source === 'github-step' && this.githubService) {
        try {
          console.log(`Trying GitHub STEPBible for ${bibleId}`);
          const content = await this.githubService.getSTEPBibleChapter(bibleId, bookId, parseInt(chapterNum));
          const chapterData = {
            id: chapterId,
            bibleId,
            reference: `${book?.name} ${chapterNum}`,
            content
          };
          this.cache.setCachedData(cacheKey, chapterData);
          return chapterData;
        } catch (error) {
          console.warn(`GitHub STEPBible failed for ${bibleId}:`, error);
        }
      }

      // Enhanced placeholder content for demonstration
      if (version.source === 'static') {
        console.log(`Using enhanced content for ${bibleId}`);
        const chapterData = {
          id: chapterId,
          bibleId,
          reference: `${book?.name} ${chapterNum}`,
          content: contentGenerator.generateEnhancedContent(book?.name || bookId, chapterNum, version.name)
        };
        this.cache.setCachedData(cacheKey, chapterData);
        return chapterData;
      }
    }

    // Default fallback
    const chapterData = {
      id: chapterId,
      bibleId,
      reference: `${book?.name || bookId} ${chapterNum}`,
      content: contentGenerator.generateEnhancedContent(book?.name || bookId, chapterNum, 'Bible')
    };
    this.cache.setCachedData(cacheKey, chapterData);
    return chapterData;
  }

  async getVerses(bibleId: string, chapterId: string): Promise<Verse[]> {
    const cacheKey = `verses_${bibleId}_${chapterId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const version = STATIC_BIBLE_VERSIONS.find(v => v.id === bibleId);
      if (version) {
        const [, bookId, chapterNum] = chapterId.split('.');
        const verses = Array.from({ length: 10 }, (_, i) => ({
          id: `${chapterId}.${i + 1}`,
          orgId: `${chapterId}.${i + 1}`,
          bibleId,
          bookId,
          chapterId,
          reference: `${bookId} ${chapterNum}:${i + 1}`,
          text: `Sample verse ${i + 1} content for ${version.name}.`
        }));
        this.cache.setCachedData(cacheKey, verses);
        return verses;
      }

      throw new Error('No service available for this Bible version');
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const comprehensiveBibleService = new ComprehensiveBibleService();
export type { BibleVersion, Book, Chapter, Verse };
