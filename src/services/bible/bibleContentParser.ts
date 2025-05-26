
export class BibleContentParser {
  static parseChapterContent(chapterData: any, bookName: string, chapterNum: string): string {
    console.log(`Parsing chapter content for ${bookName} ${chapterNum}`, { 
      dataType: typeof chapterData, 
      isArray: Array.isArray(chapterData),
      keys: typeof chapterData === 'object' ? Object.keys(chapterData).slice(0, 5) : 'N/A'
    });
    
    let content = `<h3>${bookName} ${chapterNum}</h3>`;
    
    // Handle the specific format from the repository
    if (Array.isArray(chapterData)) {
      console.log(`Processing ${chapterData.length} verses as array`);
      // Array of verse objects with "content" and "reference" fields
      chapterData.forEach((verse, index) => {
        if (verse && typeof verse === 'object') {
          const verseContent = verse.content || verse.text || verse.verse || '';
          const verseRef = verse.reference || '';
          
          // Extract verse number from reference (e.g. "Job 1:1" -> "1")
          const verseMatch = verseRef.match(/:(\d+)$/);
          const verseNumber = verseMatch ? verseMatch[1] : (index + 1).toString();
          
          if (verseContent) {
            content += `<p><sup>${verseNumber}</sup> ${verseContent}</p>`;
          }
        } else if (typeof verse === 'string' && verse.trim()) {
          // Fallback for simple string verses
          content += `<p><sup>${index + 1}</sup> ${verse}</p>`;
        }
      });
    } else if (typeof chapterData === 'object' && chapterData !== null) {
      console.log(`Processing verses as object with keys: ${Object.keys(chapterData).slice(0, 5).join(', ')}`);
      // Object with verse numbers as keys
      const verseKeys = Object.keys(chapterData).sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
      });
      
      verseKeys.forEach((verseKey) => {
        const verse = chapterData[verseKey];
        if (verse) {
          let verseText = '';
          
          if (typeof verse === 'object' && verse !== null) {
            // Handle verse objects with content field
            verseText = verse.content || verse.text || verse.verse || '';
          } else if (typeof verse === 'string') {
            // Handle simple string verses
            verseText = verse;
          }
          
          if (verseText && verseText.trim()) {
            content += `<p><sup>${verseKey}</sup> ${verseText.trim()}</p>`;
          }
        }
      });
    } else if (typeof chapterData === 'string' && chapterData.trim()) {
      // Single string content
      content += `<p>${chapterData}</p>`;
    } else {
      console.warn('Could not parse chapter data - unknown format');
      content += `<p><em>Chapter content could not be parsed from the source data.</em></p>`;
    }

    const verseCount = (content.match(/<sup>/g) || []).length;
    console.log(`Generated content with ${verseCount} verses for ${bookName} ${chapterNum}`);
    
    return content;
  }
}
