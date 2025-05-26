
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBooks, useChapters, useBibleVersions } from '../../hooks/useComprehensiveBibleData';
import { BibleVersion, Book as BookType, Chapter } from '../../services/comprehensiveBibleService';
import BooksGrid from './BooksGrid';
import ChaptersGrid from './ChaptersGrid';
import VersesReader from './VersesReader';
import BibleToolbar from './BibleToolbar';
import ReadingSettingsPanel from './ReadingSettingsPanel';

interface BibleReaderProps {
  selectedVersion: BibleVersion;
  onBack: () => void;
  autoOpenGenesis?: boolean;
}

type ViewMode = 'books' | 'chapters' | 'verses';

interface ReadingSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'dyslexic';
  theme: 'light' | 'dark' | 'sepia';
  lineSpacing: number;
  showVerseNumbers: boolean;
  showChapterNumbers: boolean;
  paragraphMode: boolean;
}

const BibleReader: React.FC<BibleReaderProps> = ({ selectedVersion, onBack, autoOpenGenesis = false }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('books');
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(selectedVersion);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>({
    fontSize: 16,
    fontFamily: 'serif',
    theme: 'light',
    lineSpacing: 1.5,
    showVerseNumbers: true,
    showChapterNumbers: true,
    paragraphMode: false
  });

  const { versions } = useBibleVersions();
  const { books, loading: booksLoading, error: booksError } = useBooks(currentVersion.id);
  const { chapters, loading: chaptersLoading, error: chaptersError } = useChapters(
    currentVersion.id, 
    selectedBook?.id || null
  );

  // Auto-open Genesis when books are loaded
  useEffect(() => {
    if (autoOpenGenesis && books.length > 0 && !selectedBook) {
      const genesis = books.find(book => 
        book.id.includes('GEN') || 
        book.name.toLowerCase().includes('genesis') ||
        book.abbreviation.toLowerCase() === 'gen'
      );
      if (genesis) {
        setSelectedBook(genesis);
        setViewMode('verses');
      }
    }
  }, [books, autoOpenGenesis, selectedBook]);

  // Auto-select chapter 1 when Genesis is selected
  useEffect(() => {
    if (selectedBook && chapters.length > 0 && !selectedChapter && autoOpenGenesis) {
      const firstChapter = chapters.find(chapter => chapter.number === '1');
      if (firstChapter) {
        setSelectedChapter(firstChapter);
      }
    }
  }, [chapters, selectedBook, selectedChapter, autoOpenGenesis]);

  const handleBookSelect = (book: BookType) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setViewMode('chapters');
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setViewMode('verses');
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setViewMode('books');
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setViewMode('chapters');
  };

  const handleVersionChange = (version: BibleVersion) => {
    setCurrentVersion(version);
    // Reset navigation when version changes
    setSelectedBook(null);
    setSelectedChapter(null);
    setViewMode('books');
  };

  const themeClasses = {
    light: 'bg-white text-slate-900',
    dark: 'bg-slate-900 text-slate-100',
    sepia: 'bg-yellow-50 text-amber-900'
  };

  const containerClass = `min-h-screen ${themeClasses[readingSettings.theme]}`;

  return (
    <div className={containerClass}>
      <BibleToolbar
        selectedVersion={currentVersion}
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        onVersionChange={handleVersionChange}
        onBookSelect={handleBookSelect}
        onChapterSelect={handleChapterSelect}
        onSettingsOpen={() => setShowSettings(true)}
        availableVersions={versions}
        availableBooks={books}
        availableChapters={chapters}
      />

      <div className="relative">
        <div className="max-w-4xl mx-auto p-4">
          {viewMode === 'books' && (
            <BooksGrid 
              books={books}
              loading={booksLoading}
              error={booksError}
              onBookSelect={handleBookSelect}
            />
          )}

          {viewMode === 'chapters' && selectedBook && (
            <ChaptersGrid
              book={selectedBook}
              chapters={chapters}
              loading={chaptersLoading}
              error={chaptersError}
              onChapterSelect={handleChapterSelect}
              onBack={handleBackToBooks}
            />
          )}

          {viewMode === 'verses' && selectedBook && selectedChapter && (
            <VersesReader
              book={selectedBook}
              chapter={selectedChapter}
              onBack={handleBackToChapters}
              readingSettings={readingSettings}
            />
          )}
        </div>

        {/* Settings Panel Overlay */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ReadingSettingsPanel
              settings={readingSettings}
              onSettingsChange={setReadingSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleReader;
