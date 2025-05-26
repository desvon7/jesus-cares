
import { BibleVersion } from '../../types/bibleTypes';

export class BibleVersionDiscovery {
  constructor() {}

  async discoverVersionsFromFiles(): Promise<BibleVersion[]> {
    try {
      console.log('Discovering Bible versions from local JSON files...');
      
      // List of all available Bible version files
      const availableVersions = [
        'amp', 'ampc', 'asv', 'bsb', 'ceb', 'cev', 'cevdci', 'cevuk', 'cjb', 'cpdv', 
        'csb', 'darby', 'drc1752', 'easy', 'erv', 'esv', 'fbv', 'fnvnt', 'gnbdc', 
        'gnbdk', 'gnbuk', 'gnt', 'gntd', 'gnv', 'gw', 'gwc', 'hcsb', 'icb', 'icl00d', 
        'jub', 'kjv', 'kjvaae', 'kjvae', 'leb', 'lsb', 'mev', 'mp1650', 'mp1781', 
        'msg', 'nabre', 'nasb1995', 'nasb2020', 'ncv', 'net', 'nirv', 'niv', 'nivuk', 
        'nkjv', 'nlt', 'nmv', 'nr06', 'nrsv', 'nrsvue', 'pev', 'rad', 'rsv', 'rsvci', 
        'rv1885', 'rv1895', 'tcent', 'teg', 'tlv', 'tojb2011', 'tpt', 'ts2009', 
        'vulg', 'wbms', 'webbe', 'webus', 'wmb', 'wmbbe', 'ylt98'
      ];

      const versions: BibleVersion[] = [];

      // Test each file to see if it's accessible
      for (const versionId of availableVersions) {
        try {
          const response = await fetch(`/data/${versionId}.json`);
          if (response.ok) {
            const sampleData = await response.json();
            
            if (this.isValidBibleData(sampleData)) {
              const version = this.createVersionFromFile(versionId, sampleData);
              versions.push(version);
              console.log(`Added Bible version: ${version.name} (${version.abbreviation})`);
            }
          }
        } catch (error) {
          console.warn(`Could not access ${versionId}.json:`, error);
        }
      }

      console.log(`Discovered ${versions.length} Bible versions from local JSON files`);
      return versions;
    } catch (error) {
      console.error('Error discovering versions from local files:', error);
      return [];
    }
  }

  private isValidBibleData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const keys = Object.keys(data);
    if (keys.length === 0) return false;
    
    // Check if it looks like Bible data structure with books
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
    const versionNames: Record<string, { name: string; language: string }> = {
      'amp': { name: 'Amplified Bible', language: 'en' },
      'ampc': { name: 'Amplified Bible Classic', language: 'en' },
      'asv': { name: 'American Standard Version', language: 'en' },
      'bsb': { name: 'Berean Study Bible', language: 'en' },
      'ceb': { name: 'Common English Bible', language: 'en' },
      'cev': { name: 'Contemporary English Version', language: 'en' },
      'cevdci': { name: 'CEV Deuterocanonicals', language: 'en' },
      'cevuk': { name: 'CEV UK', language: 'en' },
      'cjb': { name: 'Complete Jewish Bible', language: 'en' },
      'cpdv': { name: 'Catholic Public Domain Version', language: 'en' },
      'csb': { name: 'Christian Standard Bible', language: 'en' },
      'darby': { name: 'Darby Translation', language: 'en' },
      'drc1752': { name: 'Douay-Rheims 1752', language: 'en' },
      'easy': { name: 'Easy-to-Read Version', language: 'en' },
      'erv': { name: 'English Revised Version', language: 'en' },
      'esv': { name: 'English Standard Version', language: 'en' },
      'fbv': { name: 'Free Bible Version', language: 'en' },
      'fnvnt': { name: 'First Nations Version NT', language: 'en' },
      'gnbdc': { name: 'Good News Bible DC', language: 'en' },
      'gnbdk': { name: 'Good News Bible DK', language: 'en' },
      'gnbuk': { name: 'Good News Bible UK', language: 'en' },
      'gnt': { name: 'Good News Translation', language: 'en' },
      'gntd': { name: 'Good News Translation Deuterocanonicals', language: 'en' },
      'gnv': { name: 'Geneva Bible', language: 'en' },
      'gw': { name: 'God\'s Word Translation', language: 'en' },
      'gwc': { name: 'God\'s Word Catholic', language: 'en' },
      'hcsb': { name: 'Holman Christian Standard Bible', language: 'en' },
      'icb': { name: 'International Children\'s Bible', language: 'en' },
      'icl00d': { name: 'Interconfessional Lectionary', language: 'en' },
      'jub': { name: 'Jubilee Bible 2000', language: 'en' },
      'kjv': { name: 'King James Version', language: 'en' },
      'kjvaae': { name: 'KJV American Anglicized Edition', language: 'en' },
      'kjvae': { name: 'KJV Anglicized Edition', language: 'en' },
      'leb': { name: 'Lexham English Bible', language: 'en' },
      'lsb': { name: 'Legacy Standard Bible', language: 'en' },
      'mev': { name: 'Modern English Version', language: 'en' },
      'mp1650': { name: 'Matthew Parker Bible 1650', language: 'en' },
      'mp1781': { name: 'Matthew Parker Bible 1781', language: 'en' },
      'msg': { name: 'The Message', language: 'en' },
      'nabre': { name: 'New American Bible Revised Edition', language: 'en' },
      'nasb1995': { name: 'New American Standard Bible 1995', language: 'en' },
      'nasb2020': { name: 'New American Standard Bible 2020', language: 'en' },
      'ncv': { name: 'New Century Version', language: 'en' },
      'net': { name: 'New English Translation', language: 'en' },
      'nirv': { name: 'New International Reader\'s Version', language: 'en' },
      'niv': { name: 'New International Version', language: 'en' },
      'nivuk': { name: 'New International Version UK', language: 'en' },
      'nkjv': { name: 'New King James Version', language: 'en' },
      'nlt': { name: 'New Living Translation', language: 'en' },
      'nmv': { name: 'New Millennium Version', language: 'en' },
      'nr06': { name: 'Nuova Riveduta 2006', language: 'it' },
      'nrsv': { name: 'New Revised Standard Version', language: 'en' },
      'nrsvue': { name: 'NRSV Updated Edition', language: 'en' },
      'pev': { name: 'Plain English Version', language: 'en' },
      'rad': { name: 'Radak Commentary', language: 'en' },
      'rsv': { name: 'Revised Standard Version', language: 'en' },
      'rsvci': { name: 'RSV Catholic Interconfessional', language: 'en' },
      'rv1885': { name: 'Revised Version 1885', language: 'en' },
      'rv1895': { name: 'Revised Version 1895', language: 'en' },
      'tcent': { name: 'Twentieth Century New Testament', language: 'en' },
      'teg': { name: 'The English Gospel', language: 'en' },
      'tlv': { name: 'Tree of Life Version', language: 'en' },
      'tojb2011': { name: 'Tree of Life Bible 2011', language: 'en' },
      'tpt': { name: 'The Passion Translation', language: 'en' },
      'ts2009': { name: 'The Scriptures 2009', language: 'en' },
      'vulg': { name: 'Vulgate', language: 'la' },
      'wbms': { name: 'Webster Bible', language: 'en' },
      'webbe': { name: 'World English Bible British Edition', language: 'en' },
      'webus': { name: 'World English Bible US Edition', language: 'en' },
      'wmb': { name: 'World Messianic Bible', language: 'en' },
      'wmbbe': { name: 'World Messianic Bible British Edition', language: 'en' },
      'ylt98': { name: 'Young\'s Literal Translation 1898', language: 'en' }
    };

    const versionInfo = versionNames[versionId.toLowerCase()] || { name: versionId.toUpperCase(), language: 'en' };
    const languageNames: Record<string, string> = {
      'en': 'English',
      'it': 'Italian',
      'la': 'Latin'
    };
    
    return {
      id: versionId,
      name: versionInfo.name,
      nameLocal: versionInfo.name,
      abbreviation: versionId.toUpperCase(),
      abbreviationLocal: versionId.toUpperCase(),
      description: `${versionInfo.name} - Scripture from local data`,
      language: {
        id: versionInfo.language,
        name: languageNames[versionInfo.language] || 'English',
        nameLocal: languageNames[versionInfo.language] || 'English',
        script: versionInfo.language === 'la' ? 'Latin' : 'Latin',
        scriptDirection: 'ltr'
      },
      source: 'local-json'
    };
  }
}
