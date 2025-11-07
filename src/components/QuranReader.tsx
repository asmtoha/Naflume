import React, { useState, useEffect, useCallback } from 'react';
import { dynamicVerseService, QuranVerse } from '../services/dynamicVerseService';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  bengaliName?: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  timestamp: Date;
}

const QuranReader: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [currentSurah, setCurrentSurah] = useState<number>(1);
  const [currentAyah, setCurrentAyah] = useState<number>(1);
  const [verses, setVerses] = useState<QuranVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [readingMode, setReadingMode] = useState<'surah' | 'bookmarks'>('surah');

  // Load surahs list
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsData = await dynamicVerseService.getSurahs();
        setSurahs(surahsData);
      } catch (error) {
        console.error('Error loading surahs:', error);
      }
    };
    loadSurahs();
  }, []);

  // Load verses for current surah
  const loadVerses = useCallback(async (surahNumber: number) => {
    setLoading(true);
    try {
      const versesData: QuranVerse[] = [];
      // Load first 10 verses to start
      for (let ayah = 1; ayah <= 10; ayah++) {
        const verse = await dynamicVerseService.getVerse(surahNumber, ayah);
        if (verse) {
          versesData.push(verse);
        }
      }
      setVerses(versesData);
    } catch (error) {
      console.error('Error loading verses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more verses (pagination)
  const loadMoreVerses = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const currentSurahData = surahs.find(s => s.number === currentSurah);
      if (!currentSurahData) return;

      const startAyah = verses.length + 1;
      const endAyah = Math.min(startAyah + 10, currentSurahData.numberOfAyahs);
      
      const newVerses: QuranVerse[] = [];
      for (let ayah = startAyah; ayah <= endAyah; ayah++) {
        const verse = await dynamicVerseService.getVerse(currentSurah, ayah);
        if (verse) {
          newVerses.push(verse);
        }
      }
      
      setVerses(prev => [...prev, ...newVerses]);
    } catch (error) {
      console.error('Error loading more verses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load verses when surah changes
  useEffect(() => {
    if (currentSurah && surahs.length > 0) {
      loadVerses(currentSurah);
      setCurrentAyah(1);
    }
  }, [currentSurah, surahs, loadVerses]);


  // Bookmark management
  const addBookmark = (surahNumber: number, ayahNumber: number) => {
    const newBookmark: Bookmark = {
      surahNumber,
      ayahNumber,
      timestamp: new Date()
    };
    setBookmarks(prev => [...prev, newBookmark]);
  };

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)));
  };

  const isBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  };

  const goToBookmark = (bookmark: Bookmark) => {
    setCurrentSurah(bookmark.surahNumber);
    setCurrentAyah(bookmark.ayahNumber);
    setReadingMode('surah');
  };

  // Navigation
  const goToSurah = (surahNumber: number) => {
    setCurrentSurah(surahNumber);
    setReadingMode('surah');
  };

  const goToAyah = (ayahNumber: number) => {
    setCurrentAyah(ayahNumber);
    // Scroll to the verse
    const element = document.getElementById(`ayah-${ayahNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentSurahData = surahs.find(s => s.number === currentSurah);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 shadow-xl border mb-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">📖 Quran Reader</h1>
          <p className="text-green-100 text-lg">Read and explore the Holy Quran with translations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setReadingMode('surah')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              readingMode === 'surah' 
                ? 'bg-white text-green-700 shadow-lg' 
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
          >
            📚 Surah Reading
          </button>
          <button
            onClick={() => setReadingMode('bookmarks')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              readingMode === 'bookmarks' 
                ? 'bg-white text-green-700 shadow-lg' 
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
          >
            ⭐ Bookmarks ({bookmarks.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Surah List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-xl border sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">📚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Surahs</h3>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {surahs.map(surah => (
                <button
                  key={surah.number}
                  onClick={() => goToSurah(surah.number)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    currentSurah === surah.number
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'hover:bg-green-50 text-gray-700 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{surah.englishName}</div>
                    <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {surah.number}
                    </div>
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    {surah.numberOfAyahs} verses • {surah.revelationType}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {readingMode === 'surah' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border">
              {currentSurahData && (
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-3 bg-green-50 px-6 py-3 rounded-full mb-4">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {currentSurahData.number}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {currentSurahData.englishName}
                    </h2>
                  </div>
                  <div className="text-lg text-gray-600">
                    {currentSurahData.numberOfAyahs} verses • {currentSurahData.revelationType}
                  </div>
                </div>
              )}

              {loading && verses.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading verses...</span>
                </div>
              ) : (
                <div className="space-y-8">
                  {verses.map((verse, index) => (
                    <div
                      key={verse.number}
                      id={`ayah-${verse.number}`}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        currentAyah === verse.number 
                          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300 shadow-lg transform scale-102' 
                          : 'bg-white border-gray-200 hover:shadow-md hover:border-green-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {verse.number}
                          </div>
                          <button
                            onClick={() => goToAyah(verse.number)}
                            className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1 rounded-full hover:bg-green-50 transition-colors"
                          >
                            Jump to verse
                          </button>
                        </div>
                        <button
                          onClick={() => isBookmarked(verse.surah.number, verse.number) 
                            ? removeBookmark(verse.surah.number, verse.number)
                            : addBookmark(verse.surah.number, verse.number)
                          }
                          className={`p-3 rounded-full transition-all duration-200 ${
                            isBookmarked(verse.surah.number, verse.number)
                              ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                          }`}
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Arabic Text */}
                      <div className="text-right text-3xl leading-relaxed mb-6 font-arabic" dir="rtl" style={{fontFamily: 'Tahoma, serif'}}>
                        {verse.text}
                      </div>
                      
                      {/* English Translation */}
                      <div className="bg-gray-50 p-4 rounded-xl mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xs">EN</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">English Translation</span>
                        </div>
                        <div className="text-lg text-gray-800 leading-relaxed">{verse.translation}</div>
                      </div>
                      
                      {/* Bengali Translation */}
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-xs">BN</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Bengali Translation</span>
                        </div>
                        <div className="text-base text-gray-700 leading-relaxed">{verse.bengali || verse.translation}</div>
                      </div>
                    </div>
                  ))}

                  {/* Load More Button */}
                  {currentSurahData && verses.length < currentSurahData.numberOfAyahs && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMoreVerses}
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Loading...
                          </div>
                        ) : (
                          'Load More Verses'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {readingMode === 'bookmarks' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Your Bookmarks ({bookmarks.length})
                </h3>
              </div>
              
              {bookmarks.length > 0 ? (
                <div className="space-y-4">
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {bookmark.ayahNumber}
                            </div>
                            <div className="font-semibold text-lg text-gray-800">
                              {surahs.find(s => s.number === bookmark.surahNumber)?.englishName} 
                              ({bookmark.surahNumber}:{bookmark.ayahNumber})
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 ml-11">
                            Bookmarked on {bookmark.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => goToBookmark(bookmark)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 font-medium transition-colors"
                          >
                            Go to Verse
                          </button>
                          <button
                            onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-gray-400">⭐</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No Bookmarks Yet</h4>
                  <p className="text-gray-500">
                    Bookmark verses while reading to save them here for easy access.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranReader;
