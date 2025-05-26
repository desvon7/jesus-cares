
import { BibleVersion } from '../../types/bibleTypes';
import { GitHubDataService } from './githubDataService';

export class BibleVersionDiscovery {
  constructor(private githubService: GitHubDataService) {}

  async discoverVersionsFromFiles(): Promise<BibleVersion[]> {
    try {
      console.log('Discovering real Bible versions from repository files...');
      
      const availableFiles = await this.githubService.fetchDirectoryListing();
      const versions: BibleVersion[] = [];

      for (const file of availableFiles) {
        if (file.endsWith('.json')) {
          const versionId = file.replace('.json', '');
          console.log(`Processing Bible file: ${file} -> ${versionId}`);
          
          try {
            // Try to fetch a small sample to verify the file contains real Bible data
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
    
    // Check if it looks like Bible data structure
    const keys = Object.keys(data);
    if (keys.length === 0) return false;
    
    // Look for book-like structures
    const sampleKey = keys[0];
    const sampleBook = data[sampleKey];
    
    if (typeof sampleBook === 'object' && sampleBook !== null) {
      const chapterKeys = Object.keys(sampleBook);
      if (chapterKeys.length > 0) {
        const sampleChapter = sampleBook[chapterKeys[0]];
        // Check if chapter contains verse-like data
        return Array.isArray(sampleChapter) || (typeof sampleChapter === 'object' && sampleChapter !== null);
      }
    }
    
    return false;
  }

  private createVersionFromFile(versionId: string, data: any): BibleVersion {
    // Map common version IDs to proper names
    const versionNames: Record<string, string> = {
      'asv': 'American Standard Version',
      'kjv': 'King James Version',
      'niv': 'New International Version',
      'esv': 'English Standard Version',
      'nasb1995': 'New American Standard Bible 1995',
      'nlt': 'New Living Translation',
      'nkjv': 'New King James Version',
      'amp': 'Amplified Bible',
      'msg': 'The Message',
      'ylt98': 'Young\'s Literal Translation 1898',
      'bsb': 'Berean Study Bible',
      'cjb': 'Complete Jewish Bible',
      'csb': 'Christian Standard Bible',
      'darby': 'Darby Translation',
      'erv': 'Easy-to-Read Version',
      'gnv': 'Geneva Bible 1599',
      'hcsb': 'Holman Christian Standard Bible',
      'leb': 'Lexham English Bible',
      'mev': 'Modern English Version',
      'net': 'NET Bible',
      'nrsvue': 'New Revised Standard Version Updated Edition',
      'rsv': 'Revised Standard Version',
      'webbe': 'World English Bible British Edition'
    };

    const name = versionNames[versionId.toLowerCase()] || versionId.toUpperCase();
    
    return {
      id: versionId,
      name,
      nameLocal: name,
      abbreviation: versionId.toUpperCase(),
      abbreviationLocal: versionId.toUpperCase(),
      description: `${name} - Real Scripture from GitHub repository`,
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
