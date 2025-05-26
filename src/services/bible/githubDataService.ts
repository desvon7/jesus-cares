
export class GitHubDataService {
  private githubRepo = 'desvon7/bible-data';
  private baseUrl = `https://raw.githubusercontent.com/${this.githubRepo}/main`;

  async fetchFromGitHub(path: string) {
    const url = `${this.baseUrl}/${path}`;
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
}
