
export class GitHubDataService {
  private githubRepo = 'desvon7/bible-data';
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
    // Try to get available files by checking common Bible file patterns
    const commonFiles = [
      'asv.json', 'kjv.json', 'niv.json', 'esv.json', 'nasb1995.json', 
      'nlt.json', 'nkjv.json', 'amp.json', 'msg.json', 'ylt98.json',
      'bsb.json', 'cjb.json', 'csb.json', 'darby.json', 'erv.json',
      'gnv.json', 'hcsb.json', 'leb.json', 'mev.json', 'net.json',
      'nrsvue.json', 'rsv.json', 'webbe.json'
    ];

    const availableFiles: string[] = [];
    
    for (const file of commonFiles) {
      try {
        const response = await fetch(`${this.baseUrl}/${file}`);
        if (response.ok) {
          availableFiles.push(file);
          console.log(`Found available file: ${file}`);
        }
      } catch (error) {
        // File doesn't exist, continue
      }
    }

    console.log(`Found ${availableFiles.length} available Bible files`);
    return availableFiles;
  }
}
