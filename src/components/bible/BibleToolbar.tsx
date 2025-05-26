import React, { useState } from 'react';
import { ChevronDown, BookOpen, Volume2, Settings2, Bookmark, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { BibleVersion, Book, Chapter } from '../../services/comprehensiveBibleService';

interface BibleToolbarProps {
  selectedVersion: BibleVersion;
  selectedBook: Book | null;
  selectedChapter: Chapter | null;
  onVersionChange: (version: BibleVersion) => void;
  onBookSelect: (book: Book) => void;
  onChapterSelect: (chapter: Chapter) => void;
  onSettingsOpen: () => void;
  availableVersions: BibleVersion[];
  availableBooks: Book[];
  availableChapters: Chapter[];
}

const BibleToolbar: React.FC<BibleToolbarProps> = ({
  selectedVersion,
  selectedBook,
  selectedChapter,
  onVersionChange,
  onBookSelect,
  onChapterSelect,
  onSettingsOpen,
  availableVersions,
  availableBooks,
  availableChapters
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVersions = availableVersions.filter(version =>
    version.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    version.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const oldTestamentBooks = availableBooks.filter(book => 
    book.id.includes('GEN') || book.id.includes('EXO') || book.id.includes('LEV') ||
    book.id.includes('NUM') || book.id.includes('DEU') || book.id.includes('JOS') ||
    book.id.includes('JDG') || book.id.includes('RUT') || book.id.includes('1SA') ||
    book.id.includes('2SA') || book.id.includes('1KI') || book.id.includes('2KI') ||
    book.id.includes('1CH') || book.id.includes('2CH') || book.id.includes('EZR') ||
    book.id.includes('NEH') || book.id.includes('EST') || book.id.includes('JOB') ||
    book.id.includes('PSA') || book.id.includes('PRO') || book.id.includes('ECC') ||
    book.id.includes('SNG') || book.id.includes('ISA') || book.id.includes('JER') ||
    book.id.includes('LAM') || book.id.includes('EZK') || book.id.includes('DAN') ||
    book.id.includes('HOS') || book.id.includes('JOL') || book.id.includes('AMO') ||
    book.id.includes('OBA') || book.id.includes('JON') || book.id.includes('MIC') ||
    book.id.includes('NAM') || book.id.includes('HAB') || book.id.includes('ZEP') ||
    book.id.includes('HAG') || book.id.includes('ZEC') || book.id.includes('MAL')
  );

  const newTestamentBooks = availableBooks.filter(book => !oldTestamentBooks.includes(book));

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Version and Navigation */}
        <div className="flex items-center space-x-3">
          {/* Bible Version Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[100px] justify-between text-sm">
                <span className="font-semibold">{selectedVersion.abbreviation}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search versions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredVersions.slice(0, 20).map((version) => (
                  <DropdownMenuItem
                    key={version.id}
                    onClick={() => onVersionChange(version)}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {version.abbreviation}
                        <span className="text-xs bg-slate-100 dark:bg-slate-600 px-1 rounded">
                          {version.language.name}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{version.name}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
                {filteredVersions.length > 20 && (
                  <div className="px-3 py-2 text-xs text-slate-500 text-center">
                    +{filteredVersions.length - 20} more versions available
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Book Selector - Simplified */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[120px] justify-between text-sm">
                <span>{selectedBook ? selectedBook.name : 'Select Book'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {oldTestamentBooks.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Old Testament
                  </div>
                  {oldTestamentBooks.map((book) => (
                    <DropdownMenuItem
                      key={book.id}
                      onClick={() => onBookSelect(book)}
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-2"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm">{book.name}</span>
                        <span className="text-xs text-slate-500">{book.abbreviation}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}
              {newTestamentBooks.length > 0 && (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    New Testament
                  </div>
                  {newTestamentBooks.map((book) => (
                    <DropdownMenuItem
                      key={book.id}
                      onClick={() => onBookSelect(book)}
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-2"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm">{book.name}</span>
                        <span className="text-xs text-slate-500">{book.abbreviation}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chapter Selector - Only show when book is selected */}
          {selectedBook && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[80px] justify-between text-sm">
                  <span>Ch. {selectedChapter ? selectedChapter.number : '1'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="max-h-64 overflow-y-auto p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {availableChapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => onChapterSelect(chapter)}
                        className="p-2 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-colors"
                      >
                        {chapter.number}
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Center Section - Current Location */}
        <div className="flex-1 text-center px-4">
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {selectedBook && selectedChapter 
              ? `${selectedBook.name} ${selectedChapter.number}`
              : selectedBook?.name || 'Genesis 1'
            }
          </span>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onSettingsOpen} className="text-slate-600 dark:text-slate-400">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BibleToolbar;
