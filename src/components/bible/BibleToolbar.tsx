
import React from 'react';
import { ArrowLeft, Settings, Home, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleVersionChange = (versionId: string) => {
    console.log('Version change requested:', versionId);
    const version = availableVersions.find(v => v.id === versionId);
    if (version) {
      console.log('Found version:', version);
      onVersionChange(version);
    } else {
      console.error('Version not found:', versionId);
    }
  };

  const handleLanguageChange = (languageId: string) => {
    // Find versions in the selected language
    const languageVersions = availableVersions.filter(v => v.language.id === languageId);
    if (languageVersions.length > 0) {
      onVersionChange(languageVersions[0]);
    }
  };

  // Get unique languages from available versions
  const availableLanguages = Array.from(
    new Map(
      availableVersions.map(v => [v.language.id, v.language])
    ).values()
  );

  // Filter versions by current language for the version selector
  const versionsInCurrentLanguage = availableVersions.filter(
    v => v.language.id === selectedVersion.language.id
  );

  return (
    <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Home button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHomeClick}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>

          {/* Center - Bible navigation */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            {availableLanguages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline">{selectedVersion.language.nameLocal}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableLanguages.map((language) => (
                    <DropdownMenuItem 
                      key={language.id}
                      onClick={() => handleLanguageChange(language.id)}
                    >
                      {language.nameLocal}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Version selector */}
            <Select 
              value={selectedVersion.id} 
              onValueChange={handleVersionChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue>{selectedVersion.abbreviation}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {versionsInCurrentLanguage.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    {version.abbreviation} - {version.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Book selector */}
            {availableBooks.length > 0 && (
              <Select 
                value={selectedBook?.id || ''} 
                onValueChange={(value) => {
                  const book = availableBooks.find(b => b.id === value);
                  if (book) onBookSelect(book);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Book">
                    {selectedBook?.name || 'Select Book'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Chapter selector */}
            {availableChapters.length > 0 && selectedBook && (
              <Select 
                value={selectedChapter?.id || ''} 
                onValueChange={(value) => {
                  const chapter = availableChapters.find(c => c.id === value);
                  if (chapter) onChapterSelect(chapter);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chapter">
                    {selectedChapter ? `Ch. ${selectedChapter.number}` : 'Chapter'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableChapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      Chapter {chapter.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Right side - Settings */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsOpen}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleToolbar;
