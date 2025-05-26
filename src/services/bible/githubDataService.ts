
export class GitHubDataService {
  private baseUrl = '/data';

  async fetchFromGitHub(path: string) {
    const url = `${this.baseUrl}/${path}`;
    console.log(`Fetching scripture data from: ${url}`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`HTTP ${response.status} for ${path}: ${response.statusText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Log the actual structure we received
      console.log(`Successfully loaded ${path}:`, {
        type: typeof data,
        hasBooks: !!data.books,
        directStructure: typeof data === 'object' && !data.books ? Object.keys(data).slice(0, 5) : null,
        sampleKeys: data.books ? Object.keys(data.books).slice(0, 3) : Object.keys(data).slice(0, 3)
      });
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch scripture from ${path}:`, error);
      throw error;
    }
  }

  async fetchDirectoryListing(): Promise<string[]> {
    // Return the actual Bible translation files that exist in the data directory
    const availableFiles = [
      'amp.json', 'ampc.json', 'asv.json', 'bsb.json', 'ceb.json', 'cev.json', 
      'cevdci.json', 'cevuk.json', 'cjb.json', 'cpdv.json', 'csb.json', 'darby.json',
      'drc1752.json', 'easy.json', 'erv.json', 'esv.json', 'fbv.json', 'fnvnt.json',
      'gnbdc.json', 'gnbdk.json', 'gnbuk.json', 'gnt.json', 'gntd.json', 'gnv.json',
      'gw.json', 'gwc.json', 'hcsb.json', 'icb.json', 'icl00d.json', 'jub.json',
      'kjv.json', 'kjvaae.json', 'kjvae.json', 'leb.json', 'lsb.json', 'mev.json',
      'mp1650.json', 'mp1781.json', 'msg.json', 'nabre.json', 'nasb1995.json', 
      'nasb2020.json', 'ncv.json', 'net.json', 'nirv.json', 'niv.json', 'nivuk.json',
      'nkjv.json', 'nlt.json', 'nmv.json', 'nr06.json', 'nrsv.json', 'nrsvue.json',
      'pev.json', 'rad.json', 'rsv.json', 'rsvci.json', 'rv1885.json', 'rv1895.json',
      'tcent.json', 'teg.json', 'tlv.json', 'tojb2011.json', 'tpt.json', 'ts2009.json',
      'vulg.json', 'wbms.json', 'webbe.json', 'webus.json', 'wmb.json', 'wmbbe.json',
      'ylt98.json'
    ];

    console.log(`Available Bible translation files: ${availableFiles.length} versions`);
    return availableFiles;
  }

  async validateFileExists(filename: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${filename}`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}
