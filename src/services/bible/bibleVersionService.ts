
import { BibleVersion } from '../../types/bibleTypes';
import { STATIC_BIBLE_VERSIONS } from '../../data/staticBibleVersions';
import { BibleCache } from '../bibleCache';
import { bibleDataFetcher } from '../bibleDataFetcher';

export class BibleVersionService {
  private cache = new BibleCache();

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

  clearCache() {
    this.cache.clear();
  }
}

export const bibleVersionService = new BibleVersionService();
