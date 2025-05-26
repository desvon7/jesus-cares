
export class BibleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  setCachedData(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCachedData(key: string): any {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    // Check if cache is still valid
    if (Date.now() - cachedItem.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data;
  }

  removeCachedData(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}
