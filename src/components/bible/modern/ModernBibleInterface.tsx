
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBibleReaderContext } from '../providers/BibleReaderProvider';
import { ModernHeader } from './components/ModernHeader';
import { ModernReaderView } from './components/ModernReaderView';
import { ModernBottomNav } from './components/ModernBottomNav';
import { ModernVersionSelector } from './components/ModernVersionSelector';
import { ModernReadingSettings } from './components/ModernReadingSettings';
import { ModernBookSelector } from './components/ModernBookSelector';
import { ModernChapterSelector } from './components/ModernChapterSelector';

interface ModernBibleInterfaceProps {
  onBack: () => void;
}

export const ModernBibleInterface: React.FC<ModernBibleInterfaceProps> = ({ onBack }) => {
  const isMobile = useIsMobile();
  const [showVersionSelector, setShowVersionSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);

  const {
    currentVersion,
    currentBook,
    currentChapter,
    readingSettings,
    setReadingSettings,
    setCurrentVersion,
    setCurrentBook,
    setCurrentChapter,
    setViewMode,
    versions,
    books,
    chapters
  } = useBibleReaderContext();

  const handleVersionSelect = (version: any) => {
    setCurrentVersion(version);
    setCurrentBook(null);
    setCurrentChapter(null);
    setViewMode('books');
    setShowVersionSelector(false);
  };

  const handleBookSelect = (book: any) => {
    setCurrentBook(book);
    setCurrentChapter(null);
    setViewMode('chapters');
    setShowBookSelector(false);
  };

  const handleChapterSelect = (chapter: any) => {
    setCurrentChapter(chapter);
    setViewMode('verses');
    setShowChapterSelector(false);
  };

  return (
    <div className="h-screen bg-white dark:bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <ModernHeader
        currentVersion={currentVersion}
        currentBook={currentBook}
        currentChapter={currentChapter}
        onBack={onBack}
        onVersionSelect={() => setShowVersionSelector(true)}
        onBookSelect={() => setShowBookSelector(true)}
        onChapterSelect={() => setShowChapterSelector(true)}
        onSettingsOpen={() => setShowSettings(true)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ModernReaderView />
      </div>

      {/* Bottom Navigation */}
      {isMobile && (
        <ModernBottomNav
          onVersionSelect={() => setShowVersionSelector(true)}
          onBookSelect={() => setShowBookSelector(true)}
          onChapterSelect={() => setShowChapterSelector(true)}
          onSettingsOpen={() => setShowSettings(true)}
        />
      )}

      {/* Modals */}
      {showVersionSelector && (
        <ModernVersionSelector
          versions={versions}
          selectedVersion={currentVersion}
          onSelect={handleVersionSelect}
          onClose={() => setShowVersionSelector(false)}
        />
      )}

      {showBookSelector && (
        <ModernBookSelector
          books={books}
          selectedBook={currentBook}
          onSelect={handleBookSelect}
          onClose={() => setShowBookSelector(false)}
        />
      )}

      {showChapterSelector && currentBook && (
        <ModernChapterSelector
          chapters={chapters}
          selectedChapter={currentChapter}
          book={currentBook}
          onSelect={handleChapterSelect}
          onClose={() => setShowChapterSelector(false)}
        />
      )}

      {showSettings && (
        <ModernReadingSettings
          settings={readingSettings}
          onSettingsChange={setReadingSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};
