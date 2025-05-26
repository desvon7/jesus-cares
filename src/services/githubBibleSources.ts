// GitHub-based Bible sources integration
interface GitHubBibleSource {
  id: string;
  name: string;
  repo: string;
  branch: string;
  path: string;
  format: 'usfm' | 'json' | 'txt';
  language: string;
}

// STEPBible API source interface
interface STEPBibleSource {
  id: string;
  name: string;
  version: string;
  language: string;
}

// unfoldingWord translations
const UNFOLDING_WORD_SOURCES: GitHubBibleSource[] = [
  {
    id: 'ult',
    name: 'unfoldingWord Literal Text',
    repo: 'unfoldingWord-dev/en_ult',
    branch: 'master',
    path: '',
    format: 'usfm',
    language: 'en'
  },
  {
    id: 'ust',
    name: 'unfoldingWord Simplified Text',
    repo: 'unfoldingWord-dev/en_ust',
    branch: 'master',
    path: '',
    format: 'usfm',
    language: 'en'
  },
  {
    id: 'ulb',
    name: 'unfoldingWord Literal Bible',
    repo: 'unfoldingWord-dev/en_ulb',
    branch: 'master',
    path: '',
    format: 'usfm',
    language: 'en'
  },
  {
    id: 'udb',
    name: 'unfoldingWord Dynamic Bible',
    repo: 'unfoldingWord-dev/en_udb',
    branch: 'master',
    path: '',
    format: 'usfm',
    language: 'en'
  }
];

// STEPBible API sources
const STEP_BIBLE_SOURCES: STEPBibleSource[] = [
  {
    id: 'step-kjv',
    name: 'STEP Bible KJV',
    version: 'KJV',
    language: 'en'
  },
  {
    id: 'step-esv',
    name: 'STEP Bible ESV',
    version: 'ESV',
    language: 'en'
  },
  {
    id: 'step-niv',
    name: 'STEP Bible NIV',
    version: 'NIV',
    language: 'en'
  },
  {
    id: 'step-nasb',
    name: 'STEP Bible NASB',
    version: 'NASB',
    language: 'en'
  },
  {
    id: 'step-hebrew',
    name: 'STEP Bible Hebrew',
    version: 'OSMHB',
    language: 'he'
  },
  {
    id: 'step-greek',
    name: 'STEP Bible Greek',
    version: 'SBLGNT',
    language: 'el'
  }
];

class GitHubBibleService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour

  private getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async fetchFromGitHub(source: GitHubBibleSource, filePath?: string): Promise<string> {
    const cacheKey = `github_${source.id}_${filePath || 'root'}`;
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const path = filePath || source.path;
      const url = `https://raw.githubusercontent.com/${source.repo}/${source.branch}/${path}`;
      
      console.log(`Fetching from GitHub: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const content = await response.text();
      this.setCachedData(cacheKey, content);
      return content;
    } catch (error) {
      console.error(`Error fetching from GitHub source ${source.id}:`, error);
      throw error;
    }
  }

  async fetchFromSTEPBible(version: string, bookId: string, chapter: number): Promise<string> {
    const cacheKey = `stepbible_${version}_${bookId}_${chapter}`;
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      // Use STEPBible direct API endpoint
      const url = `https://www.stepbible.org/api/getBibleText.jsp?version=${version}&reference=${bookId}.${chapter}&options=HNVUG`;
      
      console.log(`Fetching from STEPBible API: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from STEPBible: ${response.status}`);
      }
      
      const text = await response.text();
      this.setCachedData(cacheKey, text);
      return text;
    } catch (error) {
      console.error(`Error fetching from STEPBible API:`, error);
      throw error;
    }
  }

  async getUnfoldingWordChapter(sourceId: string, bookId: string, chapter: number): Promise<string> {
    const source = UNFOLDING_WORD_SOURCES.find(s => s.id === sourceId);
    if (!source) {
      throw new Error(`Unknown unfoldingWord source: ${sourceId}`);
    }

    try {
      // unfoldingWord uses USFM format with specific file structure
      const bookFile = `${bookId.toLowerCase()}.usfm`;
      const content = await this.fetchFromGitHub(source, bookFile);
      
      // Parse USFM content to extract chapter
      return this.parseUSFMChapter(content, chapter);
    } catch (error) {
      console.error(`Error fetching unfoldingWord chapter:`, error);
      throw error;
    }
  }

  async getSTEPBibleChapter(sourceId: string, bookId: string, chapter: number): Promise<string> {
    // Map our sourceId to STEPBible version
    let version = 'ESV'; // default
    if (sourceId === 'step-kjv') version = 'KJV';
    else if (sourceId === 'step-esv') version = 'ESV';
    else if (sourceId === 'step-niv') version = 'NIV';
    else if (sourceId === 'step-nasb') version = 'NASB';
    else if (sourceId === 'step-hebrew') version = 'OSMHB';
    else if (sourceId === 'step-greek') version = 'SBLGNT';

    try {
      // Use STEPBible API directly
      const text = await this.fetchFromSTEPBible(version, bookId, chapter);
      
      // Parse STEPBible response - it returns plain text
      return this.parseSTEPBibleText(text, chapter);
    } catch (error) {
      console.error(`Error fetching STEPBible chapter:`, error);
      throw error;
    }
  }

  private parseUSFMChapter(usfmContent: string, chapterNumber: number): string {
    // Basic USFM parsing - look for chapter markers
    const lines = usfmContent.split('\n');
    const chapterStart = lines.findIndex(line => line.includes(`\\c ${chapterNumber}`));
    
    if (chapterStart === -1) {
      throw new Error(`Chapter ${chapterNumber} not found`);
    }

    const nextChapter = lines.findIndex((line, index) => 
      index > chapterStart && line.includes(`\\c ${chapterNumber + 1}`)
    );

    const chapterLines = nextChapter === -1 
      ? lines.slice(chapterStart) 
      : lines.slice(chapterStart, nextChapter);

    // Convert USFM to HTML
    let html = `<h3>Chapter ${chapterNumber}</h3>`;
    let verseNumber = 1;

    for (const line of chapterLines) {
      if (line.includes('\\v ')) {
        const verseMatch = line.match(/\\v (\d+)(.*)/);
        if (verseMatch) {
          verseNumber = parseInt(verseMatch[1]);
          const verseText = verseMatch[2].trim();
          html += `<p><sup>${verseNumber}</sup> ${verseText}</p>`;
        }
      } else if (line.includes('\\p')) {
        // Paragraph marker
        html += '<br>';
      } else if (line.trim() && !line.startsWith('\\')) {
        // Regular text
        html += `<p><sup>${verseNumber}</sup> ${line.trim()}</p>`;
        verseNumber++;
      }
    }

    return html;
  }

  private parseSTEPBibleText(text: string, chapterNumber: number): string {
    try {
      let html = `<h3>Chapter ${chapterNumber}</h3>`;
      
      // STEPBible returns text with verse markers
      const lines = text.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.trim()) {
          // Look for verse numbers at the start of lines
          const verseMatch = line.match(/^(\d+)\s*(.*)/);
          if (verseMatch) {
            const verseNum = verseMatch[1];
            const verseText = verseMatch[2].trim();
            html += `<p><sup>${verseNum}</sup> ${verseText}</p>`;
          } else {
            // If no verse number, just add as paragraph
            html += `<p>${line.trim()}</p>`;
          }
        }
      }

      return html || `<h3>Chapter ${chapterNumber}</h3><p>Content received but could not be parsed properly.</p>`;
    } catch (error) {
      console.error('Error parsing STEPBible text:', error);
      return `<h3>Chapter ${chapterNumber}</h3><p>Content available but could not be formatted properly.</p>`;
    }
  }

  getAllSources(): Array<GitHubBibleSource | STEPBibleSource> {
    return [...UNFOLDING_WORD_SOURCES, ...STEP_BIBLE_SOURCES];
  }
}

export const githubBibleService = new GitHubBibleService();
export { UNFOLDING_WORD_SOURCES, STEP_BIBLE_SOURCES };
export type { GitHubBibleSource, STEPBibleSource };
