
export class BibleContentParser {
  static parseChapterContent(chapterData: any, bookName: string, chapterNum: string): string {
    let content = `<h3>${bookName} ${chapterNum}</h3>`;
    
    // Handle the specific format from the repository
    if (Array.isArray(chapterData)) {
      // Array of verse objects with "content" and "reference" fields
      chapterData.forEach((verse, index) => {
        if (verse && typeof verse === 'object') {
          const verseContent = verse.content || verse.text || '';
          const verseRef = verse.reference || '';
          
          // Extract verse number from reference (e.g. "Job 1:1" -> "1")
          const verseMatch = verseRef.match(/:(\d+)$/);
          const verseNumber = verseMatch ? verseMatch[1] : (index + 1).toString();
          
          content += `<p><sup>${verseNumber}</sup> ${verseContent}</p>`;
        } else if (typeof verse === 'string') {
          // Fallback for simple string verses
          content += `<p><sup>${index + 1}</sup> ${verse}</p>`;
        }
      });
    } else if (typeof chapterData === 'object') {
      // Object with verse numbers as keys
      Object.keys(chapterData).forEach((verseKey) => {
        const verse = chapterData[verseKey];
        if (verse && typeof verse === 'object' && verse.content) {
          // Handle verse objects with content field
          content += `<p><sup>${verseKey}</sup> ${verse.content}</p>`;
        } else {
          // Handle simple string verses
          const verseText = typeof verse === 'string' ? verse : verse.text || verse.content || '';
          content += `<p><sup>${verseKey}</sup> ${verseText}</p>`;
        }
      });
    } else if (typeof chapterData === 'string') {
      // Single string content
      content += `<p>${chapterData}</p>`;
    }

    return content;
  }
}
