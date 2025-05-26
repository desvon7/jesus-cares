
import { BibleVersion, Book, Chapter, Verse } from '../types/bibleTypes';

export class BibleDataFetcher {
  private githubRepo = 'scrollmapper/bible_databases';

  async fetchFromGitHub(path: string) {
    const url = `https://raw.githubusercontent.com/${this.githubRepo}/master/${path}`;
    console.log(`Attempting to fetch from GitHub: ${url}`);
    
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

  async fetchVersionsFromGitHub(): Promise<BibleVersion[]> {
    try {
      console.log('Attempting to fetch Bible versions from GitHub...');
      const versionsData = await this.fetchFromGitHub('versions.json');
      
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
      
      throw new Error('Invalid versions data format');
    } catch (error) {
      console.error('Error fetching versions from GitHub:', error);
      throw error;
    }
  }

  async fetchBooksFromGitHub(bibleId: string): Promise<Book[]> {
    try {
      console.log(`Attempting to fetch books for ${bibleId} from GitHub...`);
      const booksData = await this.fetchFromGitHub(`${bibleId}/books.json`);
      
      if (Array.isArray(booksData)) {
        return booksData.map((book: any) => ({
          id: book.id || book.abbreviation,
          bibleId,
          abbreviation: book.abbreviation || book.id,
          name: book.name || book.title,
          nameLong: book.nameLong || book.name || book.title
        }));
      }
      
      throw new Error('Invalid books data format');
    } catch (error) {
      console.error(`Error fetching books for ${bibleId}:`, error);
      throw error;
    }
  }

  async fetchChaptersFromGitHub(bibleId: string, bookId: string): Promise<Chapter[]> {
    try {
      console.log(`Attempting to fetch chapters for ${bibleId}:${bookId} from GitHub...`);
      const chaptersData = await this.fetchFromGitHub(`${bibleId}/${bookId}/chapters.json`);
      
      if (Array.isArray(chaptersData)) {
        return chaptersData.map((chapter: any) => ({
          id: `${bibleId}.${bookId}.${chapter.number || chapter.id}`,
          bibleId,
          bookId,
          number: String(chapter.number || chapter.id),
          reference: `${bookId} ${chapter.number || chapter.id}`
        }));
      }
      
      throw new Error('Invalid chapters data format');
    } catch (error) {
      console.error(`Error fetching chapters for ${bibleId}:${bookId}:`, error);
      throw error;
    }
  }

  async fetchChapterTextFromGitHub(bibleId: string, chapterId: string): Promise<any> {
    try {
      const [, bookId, chapterNum] = chapterId.split('.');
      console.log(`Attempting to fetch chapter text for ${bibleId}:${bookId}:${chapterNum} from GitHub...`);
      
      const chapterData = await this.fetchFromGitHub(`${bibleId}/${bookId}/${chapterNum}.json`);
      
      if (chapterData && (chapterData.verses || chapterData.content)) {
        let content = `<h3>Chapter ${chapterNum}</h3>`;
        
        if (chapterData.verses && Array.isArray(chapterData.verses)) {
          chapterData.verses.forEach((verse: any) => {
            content += `<p><sup>${verse.number || verse.verse}</sup> ${verse.text || verse.content}</p>`;
          });
        } else if (typeof chapterData.content === 'string') {
          content += chapterData.content;
        }
        
        return {
          id: chapterId,
          bibleId,
          reference: `${bookId} ${chapterNum}`,
          content
        };
      }
      
      throw new Error('Invalid chapter data format');
    } catch (error) {
      console.error(`Error fetching chapter text for ${chapterId}:`, error);
      throw error;
    }
  }
}

export const bibleDataFetcher = new BibleDataFetcher();
