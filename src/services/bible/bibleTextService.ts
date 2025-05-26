import { BibleVersion, Book, Chapter, Verse } from '../../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../../data/staticBibleVersions';
import { STANDARD_BOOKS } from '../../data/standardBooks';
import { BibleCache } from '../bibleCache';
import { bibleDataFetcher } from './bibleDataFetcher';
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

    // PRIORITY 1: Try local data files first
    try {
      console.log(`Fetching scripture from local data for ${bibleId}`);
      const content = await bibleDataFetcher.fetchChapterTextFromGitHub(bibleId, chapterId);
      
      // Verify we got real content
      if (content && content.content && !content.content.includes('Sample verse') && !content.content.includes('enhanced content')) {
        console.log(`SUCCESS: Retrieved scripture from local data for ${bibleId}:${chapterId}`);
        this.cache.setCachedData(cacheKey, content);
        return content;
      } else {
        console.warn(`Retrieved content appears to be placeholder for ${bibleId}:${chapterId}`);
      }
    } catch (error) {
      console.error(`FAILED: Local data fetch for ${bibleId}:`, error);
    }

    if (version) {
      console.log(`Found version: ${version.name} (${version.source})`);

      // PRIORITY 2: Try GitHub sources for enhanced versions
      if (version.source === 'github-unfolding' && this.githubService) {
        try {
          console.log(`Trying GitHub unfoldingWord for ${bibleId}`);
          const content = await this.githubService.getUnfoldingWordChapter(bibleId, bookId, parseInt(chapterNum));
          if (content && !content.includes('Sample verse')) {
            const chapterData = {
              id: chapterId,
              bibleId,
              reference: `${book?.name} ${chapterNum}`,
              content
            };
            this.cache.setCachedData(cacheKey, chapterData);
            return chapterData;
          }
        } catch (error) {
          console.warn(`GitHub unfoldingWord failed for ${bibleId}:`, error);
        }
      }

      if (version.source === 'github-step' && this.githubService) {
        try {
          console.log(`Trying GitHub STEPBible for ${bibleId}`);
          const content = await this.githubService.getSTEPBibleChapter(bibleId, bookId, parseInt(chapterNum));
          if (content && !content.includes('Sample verse')) {
            const chapterData = {
              id: chapterId,
              bibleId,
              reference: `${book?.name} ${chapterNum}`,
              content
            };
            this.cache.setCachedData(cacheKey, chapterData);
            return chapterData;
          }
        } catch (error) {
          console.warn(`GitHub STEPBible failed for ${bibleId}:`, error);
        }
      }
    }

    // LAST RESORT: Placeholder content with clear indication
    console.warn(`FALLBACK: No scripture found for ${bibleId}:${chapterId}, using placeholder`);
    const chapterData = {
      id: chapterId,
      bibleId,
      reference: `${book?.name || bookId} ${chapterNum}`,
      content: `<h3>${book?.name || bookId} ${chapterNum}</h3><p><em>Scripture content not available. This version may not have data in the local files.</em></p><p>Try versions like KJV, NIV, ESV, NASB, NKJV, or NLT which should have content in the local data files.</p>`
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
