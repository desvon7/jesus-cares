
import { BibleVersion } from '../../types/bibleTypes';
import { GitHubDataService } from './githubDataService';

export class BibleVersionDiscovery {
  constructor(private githubService: GitHubDataService) {}

  async discoverVersionsFromFiles(): Promise<BibleVersion[]> {
    try {
      console.log('Discovering Bible versions from jesus-cares repository...');
      
      const availableFiles = await this.githubService.fetchDirectoryListing();
      const versions: BibleVersion[] = [];

      // Priority versions to test first
      const priorityVersions = ['kjv.json', 'niv.json', 'esv.json', 'nlt.json', 'nasb1995.json'];
      const allFiles = [...priorityVersions, ...availableFiles.filter(f => !priorityVersions.includes(f))];

      for (const file of allFiles.slice(0, 10)) { // Limit to first 10 for performance
        if (file.endsWith('.json')) {
          const versionId = file.replace('.json', '');
          console.log(`Processing Bible file: ${file} -> ${versionId}`);
          
          try {
            const sampleData = await this.githubService.fetchFromGitHub(file);
            
            if (this.isValidBibleData(sampleData)) {
              const version = this.createVersionFromFile(versionId, sampleData);
              versions.push(version);
              console.log(`Added real Bible version: ${version.name}`);
            } else {
              console.warn(`File ${file} does not contain valid Bible data`);
            }
          } catch (error) {
            console.warn(`Could not process ${file}:`, error);
          }
        }
      }

      if (versions.length === 0) {
        console.warn('No valid Bible versions found in repository');
      } else {
        console.log(`Discovered ${versions.length} real Bible versions`);
      }

      return versions;
    } catch (error) {
      console.error('Error discovering versions from files:', error);
      return [];
    }
  }

  private isValidBibleData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const keys = Object.keys(data);
    if (keys.length === 0) return false;
    
    // Check if it looks like Bible data structure
    const sampleKey = keys[0];
    const sampleBook = data[sampleKey];
    
    if (typeof sampleBook === 'object' && sampleBook !== null) {
      const chapterKeys = Object.keys(sampleBook);
      if (chapterKeys.length > 0) {
        const sampleChapter = sampleBook[chapterKeys[0]];
        return Array.isArray(sampleChapter) || (typeof sampleChapter === 'object' && sampleChapter !== null);
      }
    }
    
    return false;
  }

  private createVersionFromFile(versionId: string, data: any): BibleVersion {
    const versionNames: Record<string, string> = {
      'kjv': 'King James Version',
      'niv': 'New International Version',
      'esv': 'English Standard Version',
      'nlt': 'New Living Translation',
      'nasb1995': 'New American Standard Bible 1995',
      'nkjv': 'New King James Version',
      'amp': 'Amplified Bible',
      'msg': 'The Message',
      'asv': 'American Standard Version',
      'bsb': 'Berean Study Bible',
      'csb': 'Christian Standard Bible',
      'net': 'NET Bible',
      'nrsv': 'New Revised Standard Version',
      'rsv': 'Revised Standard Version'
    };

    const name = versionNames[versionId.toLowerCase()] || versionId.toUpperCase();
    
    return {
      id: versionId,
      name,
      nameLocal: name,
      abbreviation: versionId.toUpperCase(),
      abbreviationLocal: versionId.toUpperCase(),
      description: `${name} - Real Scripture from jesus-cares repository`,
      language: {
        id: 'en',
        name: 'English',
        nameLocal: 'English',
        script: 'Latin',
        scriptDirection: 'ltr'
      },
      source: 'github-data'
    };
  }
}
