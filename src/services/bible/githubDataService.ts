
export class GitHubDataService {
  private githubRepo = 'desvon7/jesus-cares';
  private baseUrl = `https://raw.githubusercontent.com/${this.githubRepo}/main`;

  async fetchFromGitHub(path: string) {
    const url = `${this.baseUrl}/${path}`;
    console.log(`Attempting to fetch from GitHub: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`HTTP ${response.status} for ${path}: ${response.statusText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched ${path}. Data type:`, typeof data, 'Keys:', Object.keys(data).slice(0, 5));
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${path}:`, error);
      throw error;
    }
  }

  async fetchDirectoryListing(): Promise<string[]> {
    // These are the actual files available in your repository
    const availableFiles = [
      'kjv.json', 'niv.json', 'esv.json', 'nlt.json', 'nasb1995.json', 'nkjv.json'
    ];

    console.log(`Found ${availableFiles.length} available Bible files`);
    return availableFiles;
  }
}
