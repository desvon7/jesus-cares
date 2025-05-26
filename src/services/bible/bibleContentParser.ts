
export class BibleContentParser {
  static parseChapterContent(chapterData: any, bookName: string, chapterNum: string): string {
    console.log(`Parsing chapter content for ${bookName} ${chapterNum}`, { 
      dataType: typeof chapterData, 
      isArray: Array.isArray(chapterData),
      keys: typeof chapterData === 'object' ? Object.keys(chapterData).slice(0, 5) : 'N/A'
    });
    
    let content = `<h3 class="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-100">${bookName} ${chapterNum}</h3>`;
    
    if (Array.isArray(chapterData)) {
      console.log(`Processing ${chapterData.length} verses as array`);
      chapterData.forEach((verse, index) => {
        if (verse && typeof verse === 'object') {
          const verseContent = verse.content || verse.text || verse.verse || '';
          const verseRef = verse.reference || '';
          
          const verseMatch = verseRef.match(/:(\d+)$/);
          const verseNumber = verseMatch ? verseMatch[1] : (index + 1).toString();
          
          if (verseContent) {
            content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${verseNumber}</sup> ${verseContent}</p>`;
          }
        } else if (typeof verse === 'string' && verse.trim()) {
          content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${index + 1}</sup> ${verse}</p>`;
        }
      });
    } else if (typeof chapterData === 'object' && chapterData !== null) {
      console.log(`Processing verses as object with keys: ${Object.keys(chapterData).slice(0, 5).join(', ')}`);
      
      // Handle the actual JSON structure where verses are objects with verse numbers as keys
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
            // Handle nested verse objects - check for common properties
            verseText = verse.text || verse.content || verse.verse || verse.t || verse.v || '';
            if (!verseText && verse.text !== undefined) {
              verseText = String(verse.text);
            }
          } else if (typeof verse === 'string') {
            verseText = verse;
          }
          
          if (verseText && verseText.trim()) {
            // Clean up the verse text
            const cleanText = verseText.trim().replace(/\s+/g, ' ');
            content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${verseKey}</sup> ${cleanText}</p>`;
          }
        }
      });
    } else if (typeof chapterData === 'string' && chapterData.trim()) {
      // Handle plain text content
      const paragraphs = chapterData.split(/\n\s*\n/);
      paragraphs.forEach((para, index) => {
        if (para.trim()) {
          content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${index + 1}</sup> ${para.trim()}</p>`;
        }
      });
    } else {
      console.warn('Could not parse chapter data - unknown format');
      content += `<div class="text-center py-12">
        <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-slate-400 text-xl">📖</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Scripture content not available in this format.</p>
        <p class="text-sm text-slate-400 mt-2">The data structure for this version may need additional parsing.</p>
      </div>`;
    }

    const verseCount = (content.match(/<sup/g) || []).length;
    console.log(`Generated content with ${verseCount} verses for ${bookName} ${chapterNum}`);
    
    return content;
  }

  static extractVerseText(verseData: any): string {
    if (typeof verseData === 'string') {
      return verseData;
    }
    
    if (typeof verseData === 'object' && verseData !== null) {
      // Try common properties for verse text
      return verseData.text || 
             verseData.content || 
             verseData.verse || 
             verseData.t || 
             verseData.v || 
             JSON.stringify(verseData);
    }
    
    return '';
  }
}
