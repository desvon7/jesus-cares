
import { BibleVersion, Book, Chapter, Verse } from '../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../data/staticBibleVersions';
import { STANDARD_BOOKS, CHAPTER_COUNTS } from '../data/standardBooks';
import { BibleCache } from './bibleCache';

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
      return cachedData;
    }

    try {
      let allVersions = [...STATIC_BIBLE_VERSIONS];
      this.cache.setCachedData(cacheKey, allVersions);
      return allVersions;
    } catch (error) {
      console.error('Error fetching Bible versions:', error);
      return STATIC_BIBLE_VERSIONS;
    }
  }

  async getBooks(bibleId: string): Promise<Book[]> {
    const cacheKey = `books_${bibleId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const books = STANDARD_BOOKS.map(book => ({
        ...book,
        bibleId
      }));
      this.cache.setCachedData(cacheKey, books);
      return books;
    } catch (error) {
      console.error('Error fetching books:', error);
      const books = STANDARD_BOOKS.map(book => ({
        ...book,
        bibleId
      }));
      return books;
    }
  }

  async getChapters(bibleId: string, bookId: string): Promise<Chapter[]> {
    const cacheKey = `chapters_${bibleId}_${bookId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const chapterCounts = CHAPTER_COUNTS[bookId] || 1;
      const chapters = Array.from({ length: chapterCounts }, (_, i) => ({
        id: `${bibleId}.${bookId}.${i + 1}`,
        bibleId,
        bookId,
        number: String(i + 1),
        reference: `${bookId} ${i + 1}`
      }));
      this.cache.setCachedData(cacheKey, chapters);
      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [{
        id: `${bibleId}.${bookId}.1`,
        bibleId,
        bookId,
        number: '1',
        reference: `${bookId} 1`
      }];
    }
  }

  async getChapterText(bibleId: string, chapterId: string): Promise<any> {
    const cacheKey = `chapter_text_${bibleId}_${chapterId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached chapter text for ${bibleId}:${chapterId}`);
      return cachedData;
    }

    console.log(`Fetching chapter text for ${bibleId}:${chapterId}`);

    try {
      const version = STATIC_BIBLE_VERSIONS.find(v => v.id === bibleId);
      const [, bookId, chapterNum] = chapterId.split('.');
      const book = STANDARD_BOOKS.find(b => b.id === bookId);

      if (version) {
        console.log(`Found version: ${version.name} (${version.source})`);

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

        // Static placeholder for demonstration
        if (version.source === 'static') {
          console.log(`Using static placeholder for ${bibleId}`);
          const chapterData = {
            id: chapterId,
            bibleId,
            reference: `${book?.name} ${chapterNum}`,
            content: `<h3>Chapter ${chapterNum}</h3><p>This is placeholder text for ${book?.name} Chapter ${chapterNum} in the ${version.name} (${version.abbreviation}). The full text content will be available when connected to a complete Bible API service.</p><p><sup>1</sup> Sample verse content for demonstration purposes. <sup>2</sup> Additional verse content to show the structure and formatting.</p>`
          };
          this.cache.setCachedData(cacheKey, chapterData);
          return chapterData;
        }
      }

      throw new Error(`No working service available for ${bibleId}`);
    } catch (error) {
      console.error('Error fetching chapter text:', error);
      
      const [, bookId, chapterNum] = chapterId.split('.');
      const book = STANDARD_BOOKS.find(b => b.id === bookId);
      
      return {
        id: chapterId,
        bibleId,
        reference: `${book?.name || bookId} ${chapterNum}`,
        content: `<h3>Chapter ${chapterNum}</h3><p>Chapter content is temporarily unavailable. Please try again later.</p>`
      };
    }
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
