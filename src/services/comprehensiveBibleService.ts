import { BibleVersion, Book, Chapter, Verse } from '../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../data/staticBibleVersions';
import { STANDARD_BOOKS, CHAPTER_COUNTS } from '../data/standardBooks';
import { BibleCache } from './bibleCache';

class ComprehensiveBibleService {
  private cache = new BibleCache();
  private githubService: any;
  private githubRepo = 'your-username/bible-data'; // Update this with your actual repo

  constructor() {
    // Import the GitHub service
    import('./githubBibleSources').then(module => {
      this.githubService = module.githubBibleService;
    });
  }

  private async fetchFromGitHub(path: string) {
    const url = `https://raw.githubusercontent.com/${this.githubRepo}/main/${path}`;
    console.log(`Fetching from GitHub: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched ${path}:`, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${path}:`, error);
      throw error;
    }
  }

  async getBibleVersions(): Promise<BibleVersion[]> {
    const cacheKey = 'all_versions';
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached versions');
      return cachedData;
    }

    console.log('Fetching Bible versions from GitHub...');

    try {
      // Try to fetch versions from GitHub bible-data repo
      const githubVersions = await this.fetchFromGitHub('versions.json');
      
      // Transform GitHub data to match our interface
      const versions: BibleVersion[] = githubVersions.map((version: any) => ({
        id: version.id,
        name: version.name,
        nameLocal: version.nameLocal || version.name,
        abbreviation: version.abbreviation,
        abbreviationLocal: version.abbreviationLocal || version.abbreviation,
        description: version.description || `${version.name} Bible translation`,
        language: {
          id: version.language?.id || 'en',
          name: version.language?.name || 'English',
          nameLocal: version.language?.nameLocal || 'English',
          script: version.language?.script || 'Latin',
          scriptDirection: version.language?.scriptDirection || 'ltr'
        },
        source: 'github-data' as const
      }));

      console.log(`Found ${versions.length} versions from GitHub`);
      this.cache.setCachedData(cacheKey, versions);
      return versions;
    } catch (error) {
      console.error('Error fetching from GitHub, falling back to static versions:', error);
      // Fallback to static versions
      let allVersions = [...STATIC_BIBLE_VERSIONS];
      this.cache.setCachedData(cacheKey, allVersions);
      return allVersions;
    }
  }

  async getBooks(bibleId: string): Promise<Book[]> {
    const cacheKey = `books_${bibleId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached books for ${bibleId}`);
      return cachedData;
    }

    console.log(`Fetching books for ${bibleId} from GitHub...`);

    try {
      // Try to fetch books from GitHub
      const githubBooks = await this.fetchFromGitHub(`${bibleId}/books.json`);
      
      const books: Book[] = githubBooks.map((book: any) => ({
        id: book.id,
        bibleId,
        abbreviation: book.abbreviation,
        name: book.name,
        nameLong: book.nameLong || book.name
      }));

      console.log(`Found ${books.length} books for ${bibleId}`);
      this.cache.setCachedData(cacheKey, books);
      return books;
    } catch (error) {
      console.error(`Error fetching books for ${bibleId}, falling back to standard books:`, error);
      // Fallback to standard books
      const books = STANDARD_BOOKS.map(book => ({
        ...book,
        bibleId
      }));
      this.cache.setCachedData(cacheKey, books);
      return books;
    }
  }

  async getChapters(bibleId: string, bookId: string): Promise<Chapter[]> {
    const cacheKey = `chapters_${bibleId}_${bookId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached chapters for ${bibleId}:${bookId}`);
      return cachedData;
    }

    console.log(`Fetching chapters for ${bibleId}:${bookId} from GitHub...`);

    try {
      // Try to fetch chapters from GitHub
      const githubChapters = await this.fetchFromGitHub(`${bibleId}/${bookId}/chapters.json`);
      
      const chapters: Chapter[] = githubChapters.map((chapter: any) => ({
        id: `${bibleId}.${bookId}.${chapter.number}`,
        bibleId,
        bookId,
        number: String(chapter.number),
        reference: `${bookId} ${chapter.number}`
      }));

      console.log(`Found ${chapters.length} chapters for ${bibleId}:${bookId}`);
      this.cache.setCachedData(cacheKey, chapters);
      return chapters;
    } catch (error) {
      console.error(`Error fetching chapters for ${bibleId}:${bookId}, falling back to standard:`, error);
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
      return chapters;
    }
  }

  async getChapterText(bibleId: string, chapterId: string): Promise<any> {
    const cacheKey = `chapter_text_${bibleId}_${chapterId}`;
    const cachedData = this.cache.getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached chapter text for ${bibleId}:${chapterId}`);
      return cachedData;
    }

    console.log(`Fetching chapter text for ${bibleId}:${chapterId} from GitHub...`);

    try {
      const [, bookId, chapterNum] = chapterId.split('.');
      
      // Try to fetch chapter content from GitHub
      const githubChapter = await this.fetchFromGitHub(`${bibleId}/${bookId}/chapter-${chapterNum}.json`);
      
      const book = STANDARD_BOOKS.find(b => b.id === bookId);
      const chapterData = {
        id: chapterId,
        bibleId,
        reference: `${book?.name || bookId} ${chapterNum}`,
        content: githubChapter.content || githubChapter.text || 'No content available'
      };

      console.log(`Successfully fetched chapter text for ${bibleId}:${chapterId}`);
      this.cache.setCachedData(cacheKey, chapterData);
      return chapterData;
    } catch (error) {
      console.error(`Error fetching chapter text for ${bibleId}:${chapterId}:`, error);
      
      // Fallback logic for other sources
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
