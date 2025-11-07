import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { spiritualGuidanceService, SpiritualContent, PaginationOptions } from '../data/spiritualGuidanceService';
import { useAuth } from '../contexts/AuthContext';

interface SpiritualGuidanceProps {
  deeds: Array<{ deedType: 'good' | 'bad'; timestamp?: any; createdAt?: string }>;
}

const GuidanceCard: React.FC<{ 
  entry: SpiritualContent; 
  onLoadMore?: () => void;
  isLast?: boolean;
}> = ({ entry, onLoadMore, isLast }) => {
  const [open, setOpen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!isLast || !onLoadMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`card-${entry.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isLast, onLoadMore, entry.id]);

  return (
    <div 
      id={`card-${entry.id}`}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
            {entry.source} • {entry.reference}
          </div>
          <div 
            className="text-2xl md:text-3xl leading-relaxed mb-3 font-[700] text-gray-900" 
            style={{ fontFamily: 'Tahoma, serif' }}
          >
            {entry.arabic}
          </div>
          <div className="text-gray-800 mb-2">{entry.english}</div>
          <div className="text-gray-600 text-sm mb-3">{entry.bangla}</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.map(tag => (
              <span 
                key={tag} 
                className={`px-2 py-1 rounded-full text-xs border ${
                  entry.type === 'positive' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setOpen(o => !o)} 
          className="ml-4 p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg" 
          aria-expanded={open} 
          aria-controls={`taf-${entry.id}`} 
          aria-label="Toggle tafsir"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {open && (
        <div 
          id={`taf-${entry.id}`} 
          className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 leading-relaxed"
        >
          <div className="text-xs text-gray-500 mb-2">Reference: {entry.tafsirRef}</div>
          <div className="mb-2">
            <span className="text-gray-800 font-medium">Tafsir (EN):</span> {entry.tafsirEn}
          </div>
          <div className="text-gray-700">
            <span className="text-gray-800 font-medium">তাফসির (BN):</span> {entry.tafsirBn}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}> = ({ searchTerm, onSearchChange, onSearch, isLoading }) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Search verses and hadith..."
        className="w-full px-4 py-3 pl-10 pr-20 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        onClick={onSearch}
        disabled={isLoading}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

const FilterTabs: React.FC<{
  selectedSource: string;
  selectedType: string;
  onSourceChange: (source: string) => void;
  onTypeChange: (type: string) => void;
  themes: string[];
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}> = ({ selectedSource, selectedType, onSourceChange, onTypeChange, themes, selectedTheme, onThemeChange }) => {
  return (
    <div className="space-y-4">
      {/* Source Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Source</label>
        <div className="flex gap-2">
          {['All', 'Quran', 'Hadith'].map(source => (
            <button
              key={source}
              onClick={() => onSourceChange(source)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedSource === source
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
        <div className="flex gap-2">
          {['All', 'Positive', 'Guidance'].map(type => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedType === type
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Themes</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => onThemeChange(theme)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedTheme === theme
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SpiritualGuidanceEnhanced: React.FC<SpiritualGuidanceProps> = ({ deeds }) => {
  const { currentUser } = useAuth();
  
  // State management
  const [verseOfTheDay, setVerseOfTheDay] = useState<SpiritualContent | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<SpiritualContent[]>([]);
  const [allContent, setAllContent] = useState<SpiritualContent[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const pageSize = 20;

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load verse of the day
      const verse = await spiritualGuidanceService.getVerseOfTheDay();
      setVerseOfTheDay(verse);
      
      // Load personalized content
      const personalized = await spiritualGuidanceService.getPersonalizedContent(deeds, 3);
      setPersonalizedContent(personalized);
      
      // Load themes
      const allThemes = await spiritualGuidanceService.getAllThemes();
      setThemes(allThemes);
      
      // Load initial content
      await loadContent();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async (reset = false) => {
    try {
      if (reset) {
        setAllContent([]);
        setCurrentPage(1);
        setLastDoc(null);
        setHasMore(true);
      }

      const options: PaginationOptions = {
        pageSize,
        lastDoc: reset ? undefined : lastDoc,
        source: selectedSource === 'All' ? undefined : selectedSource as 'Quran' | 'Hadith',
        type: selectedType === 'All' ? undefined : selectedType.toLowerCase() as 'positive' | 'guidance',
        theme: selectedTheme || undefined
      };

      const result = await spiritualGuidanceService.getContent(options);
      
      if (reset) {
        setAllContent(result.data);
      } else {
        setAllContent(prev => [...prev, ...result.data]);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
      
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setSearchLoading(true);
      const result = await spiritualGuidanceService.searchContent(searchTerm, {
        pageSize: 50,
        source: selectedSource === 'All' ? undefined : selectedSource as 'Quran' | 'Hadith',
        type: selectedType === 'All' ? undefined : selectedType.toLowerCase() as 'positive' | 'guidance'
      });
      
      setAllContent(result.data);
      setHasMore(result.hasMore);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      await loadContent();
    } catch (error) {
      console.error('Error loading more content:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, lastDoc, selectedSource, selectedType, selectedTheme]);

  // Filter change handlers
  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme === selectedTheme ? '' : theme);
    setCurrentPage(1);
  };

  // Apply filters
  useEffect(() => {
    if (!loading) {
      loadContent(true);
    }
  }, [selectedSource, selectedType, selectedTheme]);

  const last7Days = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    
    const recent = deeds.filter(deed => {
      const date = deed.timestamp?.toDate ? deed.timestamp.toDate() : new Date(deed.createdAt || new Date());
      return date >= start && date <= now;
    });
    
    return {
      good: recent.filter(d => d.deedType === 'good').length,
      bad: recent.filter(d => d.deedType === 'bad').length
    };
  }, [deeds]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading spiritual guidance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Verse of the Day */}
      {verseOfTheDay && (
        <div className="bg-gradient-to-br from-primary-50 via-purple-50 to-accent-50 rounded-2xl p-6 border border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-black">Verse of the Day</h3>
            <div className="text-sm text-gray-500">For everyone • {new Date().toLocaleDateString()}</div>
          </div>
          <GuidanceCard entry={verseOfTheDay} />
        </div>
      )}

      {/* Personalized for You */}
      {personalizedContent.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-black">Personalized for You</h3>
            <div className="text-sm text-gray-500">{currentUser?.displayName || 'You'}</div>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            Last 7 days: <span className="text-green-600 font-medium">{last7Days.good} good</span> • <span className="text-red-600 font-medium">{last7Days.bad} bad</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedContent.map(entry => (
              <GuidanceCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Search and Explore */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-black">Search & Explore</h3>
          <div className="text-sm text-gray-500">{allContent.length} results</div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            isLoading={searchLoading}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterTabs
            selectedSource={selectedSource}
            selectedType={selectedType}
            onSourceChange={handleSourceChange}
            onTypeChange={handleTypeChange}
            themes={themes}
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allContent.map((entry, index) => (
            <GuidanceCard
              key={entry.id}
              entry={entry}
              onLoadMore={index === allContent.length - 1 ? handleLoadMore : undefined}
              isLast={index === allContent.length - 1}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* No Results */}
        {allContent.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <p>No content found. Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpiritualGuidanceEnhanced;

