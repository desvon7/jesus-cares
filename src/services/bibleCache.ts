
export class BibleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    try {
      const cached = localStorage.getItem('comprehensive_bible_cache');
      if (cached) {
        const parsedCache = JSON.parse(cached);
        this.cache = new Map(parsedCache);
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  }

  private saveCache() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      localStorage.setItem('comprehensive_bible_cache', JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  getCachedData(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
    this.saveCache();
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem('comprehensive_bible_cache');
  }
}
