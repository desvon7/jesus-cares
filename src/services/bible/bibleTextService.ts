
import { BibleVersion, Book, Chapter, Verse } from '../../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../../data/staticBibleVersions';
import { STANDARD_BOOKS } from '../../data/standardBooks';
import { BibleCache } from '../bibleCache';
import { bibleDataFetcher } from '../bibleDataFetcher';
import { contentGenerator } from '../contentGenerator';

export class BibleTextService {
  private cache = new BibleCache();
  private githubService: any;

  constructor() {
    // Import the GitHub service
    import('../githubBibleSources').then(module => {
      this.githubService = module.githubBibleService;
    });
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

export const bibleTextService = new BibleTextService();
