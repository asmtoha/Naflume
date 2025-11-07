import React, { useState, useEffect } from 'react';
import { dynamicVerseService, QuranVerse } from '../services/dynamicVerseService';

const DynamicVerseTest: React.FC = () => {
  const [randomVerse, setRandomVerse] = useState<QuranVerse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<QuranVerse[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchRandomVerse = async () => {
    setLoading(true);
    try {
      const verse = await dynamicVerseService.getRandomVerse();
      setRandomVerse(verse);
    } catch (error) {
      console.error('Error fetching random verse:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchVerses = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const results = await dynamicVerseService.searchVerses(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching verses:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomVerse();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center mb-8">Dynamic Verse API Test</h2>
      
      {/* Random Verse */}
      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Random Verse</h3>
          <button
            onClick={fetchRandomVerse}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Random Verse'}
          </button>
        </div>
        
        {randomVerse ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              {randomVerse.surah.englishName} ({randomVerse.surah.number}:{randomVerse.number})
            </div>
            <div className="text-2xl text-right font-arabic" dir="rtl">
              {randomVerse.text}
            </div>
            <div className="text-lg text-gray-800">
              {randomVerse.translation}
            </div>
            {randomVerse.bengali && (
              <div className="text-base text-gray-600">
                {randomVerse.bengali}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No verse loaded</div>
        )}
      </div>

      {/* Search Verses */}
      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <h3 className="text-lg font-semibold mb-4">Search Verses</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for verses (e.g., patience, mercy, prayer)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && searchVerses()}
          />
          <button
            onClick={searchVerses}
            disabled={searchLoading || !searchQuery.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Found {searchResults.length} verses
            </div>
            {searchResults.slice(0, 5).map((verse, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="text-sm text-gray-500">
                  {verse.surah.englishName} ({verse.surah.number}:{verse.number})
                </div>
                <div className="text-lg text-right font-arabic" dir="rtl">
                  {verse.text}
                </div>
                <div className="text-base text-gray-800">
                  {verse.translation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme Examples */}
      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <h3 className="text-lg font-semibold mb-4">Available Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            'patience', 'forgiveness', 'charity', 'prayer', 'gratitude', 'trust',
            'repentance', 'mercy', 'hope', 'love', 'peace', 'wisdom',
            'justice', 'humility', 'courage', 'kindness', 'truth', 'guidance'
          ].map(theme => (
            <button
              key={theme}
              onClick={() => {
                setSearchQuery(theme);
                searchVerses();
              }}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
            >
              {theme}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicVerseTest;
