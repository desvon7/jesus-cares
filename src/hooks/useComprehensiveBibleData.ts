
import { useState, useEffect } from 'react';
import { comprehensiveBibleService, BibleVersion, Book, Chapter, Verse } from '../services/comprehensiveBibleService';

export const useBibleVersions = () => {
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await comprehensiveBibleService.getBibleVersions();
      setVersions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Bible versions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  return { versions, loading, error, refetch: fetchVersions };
};

export const useBooks = (bibleId: string | null) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bibleId) return;

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await comprehensiveBibleService.getBooks(bibleId);
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [bibleId]);

  return { books, loading, error };
};

export const useChapters = (bibleId: string | null, bookId: string | null) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bibleId || !bookId) return;

    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await comprehensiveBibleService.getChapters(bibleId, bookId);
        setChapters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chapters');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [bibleId, bookId]);

  return { chapters, loading, error };
};

export const useChapterText = (bibleId: string | null, chapterId: string | null) => {
  const [chapterData, setChapterData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bibleId || !chapterId) return;

    const fetchChapterText = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await comprehensiveBibleService.getChapterText(bibleId, chapterId);
        setChapterData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chapter text');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterText();
  }, [bibleId, chapterId]);

  return { chapterData, loading, error };
};

export const useVerses = (bibleId: string | null, chapterId: string | null) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bibleId || !chapterId) return;

    const fetchVerses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await comprehensiveBibleService.getVerses(bibleId, chapterId);
        setVerses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch verses');
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [bibleId, chapterId]);

  return { verses, loading, error };
};
