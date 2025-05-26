
import { BibleVersion } from '../../types/bibleTypes';
import { GitHubDataService } from './githubDataService';

export class BibleVersionDiscovery {
  private githubService: GitHubDataService;

  constructor(githubService: GitHubDataService) {
    this.githubService = githubService;
  }

  async discoverVersionsFromFiles(): Promise<BibleVersion[]> {
    // Extended list of Bible version abbreviations to try based on the repository
    const commonVersions = [
      // Main versions
      { id: 'kjv', name: 'King James Version', abbr: 'KJV' },
      { id: 'niv', name: 'New International Version', abbr: 'NIV' },
      { id: 'esv', name: 'English Standard Version', abbr: 'ESV' },
      { id: 'nasb', name: 'New American Standard Bible', abbr: 'NASB' },
      { id: 'nkjv', name: 'New King James Version', abbr: 'NKJV' },
      { id: 'nlt', name: 'New Living Translation', abbr: 'NLT' },
      { id: 'asv', name: 'American Standard Version', abbr: 'ASV' },
      { id: 'web', name: 'World English Bible', abbr: 'WEB' },
      { id: 'ylt', name: 'Young\'s Literal Translation', abbr: 'YLT' },
      { id: 'darby', name: 'Darby Translation', abbr: 'DARBY' },
      
      // Additional versions from the repository
      { id: 'amp', name: 'Amplified Bible', abbr: 'AMP' },
      { id: 'ampc', name: 'Amplified Bible Classic', abbr: 'AMPC' },
      { id: 'bsb', name: 'Berean Study Bible', abbr: 'BSB' },
      { id: 'ceb', name: 'Common English Bible', abbr: 'CEB' },
      { id: 'cev', name: 'Contemporary English Version', abbr: 'CEV' },
      { id: 'cjb', name: 'Complete Jewish Bible', abbr: 'CJB' },
      { id: 'csb', name: 'Christian Standard Bible', abbr: 'CSB' },
      { id: 'erv', name: 'Easy-to-Read Version', abbr: 'ERV' },
      { id: 'fbv', name: 'Free Bible Version', abbr: 'FBV' },
      { id: 'gnv', name: 'Geneva Bible', abbr: 'GNV' },
      { id: 'gw', name: 'God\'s Word Translation', abbr: 'GW' },
      { id: 'hcsb', name: 'Holman Christian Standard Bible', abbr: 'HCSB' },
      { id: 'icb', name: 'International Children\'s Bible', abbr: 'ICB' },
      { id: 'jub', name: 'Jubilee Bible 2000', abbr: 'JUB' },
      { id: 'kjvaae', name: 'King James Version American Edition', abbr: 'KJVAAE' },
      { id: 'leb', name: 'Lexham English Bible', abbr: 'LEB' },
      { id: 'lsb', name: 'Legacy Standard Bible', abbr: 'LSB' },
      { id: 'mev', name: 'Modern English Version', abbr: 'MEV' },
      { id: 'msg', name: 'The Message', abbr: 'MSG' },
      { id: 'nabre', name: 'New American Bible Revised Edition', abbr: 'NABRE' },
      { id: 'nasb1995', name: 'New American Standard Bible 1995', abbr: 'NASB1995' },
      { id: 'nasb2020', name: 'New American Standard Bible 2020', abbr: 'NASB2020' },
      { id: 'ncv', name: 'New Century Version', abbr: 'NCV' },
      { id: 'net', name: 'New English Translation', abbr: 'NET' },
      { id: 'nirv', name: 'New International Reader\'s Version', abbr: 'NIRV' },
      { id: 'nivuk', name: 'New International Version UK', abbr: 'NIVUK' },
      { id: 'nmv', name: 'New Millennium Version', abbr: 'NMV' },
      { id: 'nrsv', name: 'New Revised Standard Version', abbr: 'NRSV' },
      { id: 'nrsvue', name: 'New Revised Standard Version Updated Edition', abbr: 'NRSVUE' },
      { id: 'rsv', name: 'Revised Standard Version', abbr: 'RSV' },
      { id: 'tlv', name: 'Tree of Life Version', abbr: 'TLV' },
      { id: 'tpt', name: 'The Passion Translation', abbr: 'TPT' },
      { id: 'vulg', name: 'Vulgate', abbr: 'VULG' },
      { id: 'ylt98', name: 'Young\'s Literal Translation 1898', abbr: 'YLT98' }
    ];

    const availableVersions: BibleVersion[] = [];

    for (const version of commonVersions) {
      try {
        // Check if this version exists by trying to fetch the JSON file
        await this.githubService.fetchFromGitHub(`data/${version.id}.json`);
        
        availableVersions.push({
          id: version.id,
          name: version.name,
          nameLocal: version.name,
          abbreviation: version.abbr,
          abbreviationLocal: version.abbr,
          description: `${version.name} - Biblical text`,
          language: {
            id: 'en',
            name: 'English',
            nameLocal: 'English',
            script: 'Latin',
            scriptDirection: 'ltr'
          },
          source: 'github-data' as const
        });
        
        console.log(`Found available version: ${version.name}`);
      } catch (error) {
        // Version not available, continue to next
        console.log(`Version ${version.id} not available`);
      }
    }

    return availableVersions;
  }
}
