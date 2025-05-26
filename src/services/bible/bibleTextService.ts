
import { BibleVersion, Book, Chapter, Verse } from '../../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../../data/staticBibleVersions';
import { STANDARD_BOOKS } from '../../data/standardBooks';
import { BibleCache } from '../bibleCache';
import { bibleDataFetcher } from './bibleDataFetcher';

export class BibleTextService {
  private cache = new BibleCache();

  async getChapterText(bibleId: string, chapterId: string): Promise<any> {
    const cacheKey = `chapter_text_${bibleId}_${chapterId}`;
    
    // Clear any cached placeholder content to force fresh fetch
    const cachedData = this.cache.getCachedData(cacheKey);
    if (cachedData && cachedData.content && cachedData.content.includes('Scripture content not available')) {
      console.log(`Clearing cached placeholder for ${bibleId}:${chapterId}`);
      this.cache.removeCachedData(cacheKey);
    } else if (cachedData) {
      console.log(`Using cached chapter text for ${bibleId}:${chapterId}`);
      return cachedData;
    }

    console.log(`Loading chapter text for ${bibleId}:${chapterId}...`);

    const [, bookId, chapterNum] = chapterId.split('.');
    const version = STATIC_BIBLE_VERSIONS.find(v => v.id === bibleId);
    const book = STANDARD_BOOKS.find(b => b.id === bookId);

    // Try to fetch from local data files
    try {
      console.log(`Fetching scripture from local data for ${bibleId}`);
      const content = await bibleDataFetcher.fetchChapterTextFromGitHub(bibleId, chapterId);
      
      // Verify we got real content
      if (content && content.content && 
          !content.content.includes('Scripture content not available') && 
          !content.content.includes('Sample verse') &&
          (content.content.match(/<sup/g) || []).length > 0) {
        console.log(`SUCCESS: Retrieved scripture from local data for ${bibleId}:${chapterId}`);
        this.cache.setCachedData(cacheKey, content);
        return content;
      } else {
        console.warn(`Retrieved content appears to be placeholder for ${bibleId}:${chapterId}`);
      }
    } catch (error) {
      console.error(`FAILED: Local data fetch for ${bibleId}:`, error);
    }

    // Fallback content with clearer messaging
    console.warn(`FALLBACK: No scripture found for ${bibleId}:${chapterId}, using placeholder`);
    const chapterData = {
      id: chapterId,
      bibleId,
      reference: `${book?.name || bookId} ${chapterNum}`,
      content: `<h3>${book?.name || bookId} ${chapterNum}</h3>
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span class="text-slate-400 text-2xl">📖</span>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Scripture content not available</h3>
          <p class="text-slate-500 dark:text-slate-400 mb-4">This version may not have data in the local files.</p>
          <p class="text-sm text-slate-400">Try versions like KJV, NIV, ESV, NASB, NKJV, or NLT which should have content available.</p>
        </div>`
    };
    
    // Don't cache the fallback content so it can retry
    return chapterData;
  }

  async getVerses(bibleId: string, chapterId: string): Promise<Verse[]> {
    const cacheKey = `verses_${bibleId}_${chapterId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      // Try to get the actual chapter data and extract verses
      const chapterData = await this.getChapterText(bibleId, chapterId);
      if (chapterData && chapterData.content) {
        // This is a simplified approach - in reality you'd parse the verses from the content
        const [, bookId, chapterNum] = chapterId.split('.');
        const verses = Array.from({ length: 10 }, (_, i) => ({
          id: `${chapterId}.${i + 1}`,
          orgId: `${chapterId}.${i + 1}`,
          bibleId,
          bookId,
          chapterId,
          reference: `${bookId} ${chapterNum}:${i + 1}`,
          text: `Verse ${i + 1} content from ${bibleId}.`
        }));
        this.cache.setCachedData(cacheKey, verses);
        return verses;
      }

      throw new Error('No chapter data available');
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
