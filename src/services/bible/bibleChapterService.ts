import { Chapter } from '../../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../../data/staticBibleVersions';
import { CHAPTER_COUNTS } from '../../data/standardBooks';
import { BibleCache } from '../bibleCache';
import { bibleDataFetcher } from './bibleDataFetcher';

export class BibleChapterService {
  private cache = new BibleCache();
  private githubService: any;

  constructor() {
    // Import the GitHub service
    import('../githubBibleSources').then(module => {
      this.githubService = module.githubBibleService;
    });
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

  clearCache() {
    this.cache.clear();
  }
}

export const bibleChapterService = new BibleChapterService();
