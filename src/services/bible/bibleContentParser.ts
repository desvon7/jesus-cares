
export class BibleContentParser {
  static parseChapterContent(chapterData: any, bookName: string, chapterNum: string): string {
    console.log(`Parsing chapter content for ${bookName} ${chapterNum}`, { 
      dataType: typeof chapterData, 
      isArray: Array.isArray(chapterData),
      keys: typeof chapterData === 'object' ? Object.keys(chapterData).slice(0, 10) : 'N/A'
    });
    
    let content = `<h3 class="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-100">${bookName} ${chapterNum}</h3>`;
    
    if (Array.isArray(chapterData)) {
      console.log(`Processing ${chapterData.length} verses as array`);
      chapterData.forEach((verse, index) => {
        if (verse && typeof verse === 'object') {
          // Handle the structure shown in your JSON: { "content": "verse text", "reference": "Job 1:1" }
          const verseContent = verse.content || verse.text || verse.verse || verse.t || '';
          const verseRef = verse.reference || '';
          
          // Extract verse number from reference (e.g., "Job 1:1" -> "1")
          let verseNumber = '';
          if (verseRef) {
            const verseMatch = verseRef.match(/:(\d+)$/);
            verseNumber = verseMatch ? verseMatch[1] : (index + 1).toString();
          } else {
            verseNumber = (index + 1).toString();
          }
          
          if (verseContent && verseContent.trim()) {
            content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${verseNumber}</sup> ${verseContent.trim()}</p>`;
          }
        } else if (typeof verse === 'string' && verse.trim()) {
          content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${index + 1}</sup> ${verse}</p>`;
        }
      });
    } else if (typeof chapterData === 'object' && chapterData !== null) {
      console.log(`Processing verses as object with keys: ${Object.keys(chapterData).slice(0, 10).join(', ')}`);
      
      // Sort verse keys numerically
      const verseKeys = Object.keys(chapterData).sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
      });
      
      console.log(`Found ${verseKeys.length} verse keys:`, verseKeys.slice(0, 5));
      
      verseKeys.forEach((verseKey) => {
        const verse = chapterData[verseKey];
        if (verse) {
          let verseText = '';
          let verseNumber = verseKey;
          
          if (typeof verse === 'string') {
            verseText = verse;
          } else if (typeof verse === 'object' && verse !== null) {
            // Handle the structure from your JSON files
            verseText = verse.content || verse.text || verse.verse || verse.t || verse.v || '';
            
            // If there's a reference, extract the verse number from it
            if (verse.reference) {
              const verseMatch = verse.reference.match(/:(\d+)$/);
              if (verseMatch) {
                verseNumber = verseMatch[1];
              }
            }
            
            // If still no text, try other common patterns
            if (!verseText) {
              const possibleKeys = ['text', 'content', 'verse', 't', 'v', 'value'];
              for (const key of possibleKeys) {
                if (verse[key] && typeof verse[key] === 'string') {
                  verseText = verse[key];
                  break;
                }
              }
            }
          }
          
          if (verseText && verseText.trim() && verseText !== '{}') {
            // Clean up the verse text
            const cleanText = verseText.trim().replace(/\s+/g, ' ');
            content += `<p class="mb-4 leading-relaxed"><sup class="text-blue-600 dark:text-blue-400 font-medium text-sm mr-1">${verseNumber}</sup> ${cleanText}</p>`;
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
    }

    // Check if we actually have verses, if not show error message
    const verseCount = (content.match(/<sup/g) || []).length;
    if (verseCount === 0) {
      console.warn('No verses found in chapter data', { chapterData });
      content += `<div class="text-center py-12">
        <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-slate-400 text-xl">📖</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 font-medium">Scripture content not available in this format.</p>
        <p class="text-sm text-slate-400 mt-2">The data structure for this version may need additional parsing.</p>
        <p class="text-sm text-slate-400 mt-2">Try versions like KJV, ESV, NIV, NASB, or NLT which should have content available.</p>
      </div>`;
    } else {
      console.log(`Generated content with ${verseCount} verses for ${bookName} ${chapterNum}`);
    }
    
    return content;
  }

  static extractVerseText(verseData: any): string {
    if (typeof verseData === 'string') {
      return verseData;
    }
    
    if (typeof verseData === 'object' && verseData !== null) {
      // Try common properties for verse text, including the structure from your JSON files
      return verseData.content || 
             verseData.text || 
             verseData.verse || 
             verseData.t || 
             verseData.v || 
             JSON.stringify(verseData);
    }
    
    return '';
  }
}
