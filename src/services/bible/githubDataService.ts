
export class GitHubDataService {
  private githubRepo = 'desvon7/jesus-cares';
  private baseUrl = `https://raw.githubusercontent.com/${this.githubRepo}/main/data`;

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
    // Based on your repository structure, these are the available Bible versions
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

    console.log(`Found ${availableFiles.length} available Bible files`);
    return availableFiles;
  }
}
