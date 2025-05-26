
import { BibleVersion, Book, Chapter, Verse } from '../types/bibleTypes';
import { bibleVersionService } from './bible/bibleVersionService';
import { bibleBookService } from './bible/bibleBookService';
import { bibleChapterService } from './bible/bibleChapterService';
import { bibleTextService } from './bible/bibleTextService';

class ComprehensiveBibleService {
  async getBibleVersions(): Promise<BibleVersion[]> {
    return bibleVersionService.getBibleVersions();
  }

  async getBooks(bibleId: string): Promise<Book[]> {
    return bibleBookService.getBooks(bibleId);
  }

  async getChapters(bibleId: string, bookId: string): Promise<Chapter[]> {
    return bibleChapterService.getChapters(bibleId, bookId);
  }

  async getChapterText(bibleId: string, chapterId: string): Promise<any> {
    return bibleTextService.getChapterText(bibleId, chapterId);
  }

  async getVerses(bibleId: string, chapterId: string): Promise<Verse[]> {
    return bibleTextService.getVerses(bibleId, chapterId);
  }

  clearCache() {
    bibleVersionService.clearCache();
    bibleBookService.clearCache();
    bibleChapterService.clearCache();
    bibleTextService.clearCache();
  }
}

export const comprehensiveBibleService = new ComprehensiveBibleService();
export type { BibleVersion, Book, Chapter, Verse };
