import React, { useMemo, useState, useEffect } from 'react';
import { SPIRITUAL_GUIDANCE_DATA, ALL_THEMES, GuidanceEntry } from '../data/spiritualGuidance';
import { useAuth } from '../contexts/AuthContext';
import { spiritualGuidanceService } from '../data/spiritualGuidanceService';
import QuranReader from './QuranReader';

interface SpiritualGuidanceProps {
  deeds: Array<{ deedType: 'good' | 'bad'; timestamp?: any; createdAt?: string }>;
}

const pickVerseOfTheDay = (dateSeed: string): GuidanceEntry => {
  const index = Math.abs(
    dateSeed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % SPIRITUAL_GUIDANCE_DATA.length;
  return SPIRITUAL_GUIDANCE_DATA[index];
};

const pickPersonalized = (isPositive: boolean): GuidanceEntry => {
  const pool = SPIRITUAL_GUIDANCE_DATA.filter(e => e.type === (isPositive ? 'positive' : 'guidance'));
  if (pool.length === 0) return SPIRITUAL_GUIDANCE_DATA[0];
  const dayIndex = new Date().getDay() % pool.length;
  return pool[dayIndex];
};

const filterByTheme = (theme: string): GuidanceEntry[] => {
  const t = theme.toLowerCase();
  return SPIRITUAL_GUIDANCE_DATA.filter(e => e.tags.map(x => x.toLowerCase()).includes(t));
};

const GuidanceCard: React.FC<{ entry: GuidanceEntry }> = ({ entry }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">{entry.source} • {entry.reference}</div>
          <div className="text-2xl md:text-3xl leading-relaxed mb-3 font-[700] text-gray-900" style={{fontFamily:'Tahoma, serif'}}>
            {entry.arabic}
          </div>
          <div className="text-gray-800 mb-2">{entry.english}</div>
          <div className="text-gray-600 text-sm mb-3">{entry.bangla}</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.map(tag => (
              <span key={tag} className={`px-2 py-1 rounded-full text-xs border ${entry.type === 'positive' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{tag}</span>
            ))}
          </div>
        </div>
        <button onClick={() => setOpen(o => !o)} className="ml-4 p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg" aria-expanded={open} aria-controls={`taf-${entry.id}`} aria-label="Toggle tafsir">
          <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
      {open && (
        <div id={`taf-${entry.id}`} className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 leading-relaxed">
          <div className="text-xs text-gray-500 mb-2">Reference: {entry.tafsirRef}</div>
          <div className="mb-2"><span className="text-gray-800 font-medium">Tafsir (EN):</span> {entry.tafsirEn}</div>
          <div className="text-gray-700"><span className="text-gray-800 font-medium">তাফসির (BN):</span> {entry.tafsirBn}</div>
        </div>
      )}
    </div>
  );
};

const SpiritualGuidance: React.FC<SpiritualGuidanceProps> = ({ deeds }) => {
  const { currentUser } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [availableThemes, setAvailableThemes] = useState<string[]>(ALL_THEMES);
  const [dynamicContent, setDynamicContent] = useState<GuidanceEntry[]>([]);
  const [loadingDynamic, setLoadingDynamic] = useState(false);
  const [showQuranReader, setShowQuranReader] = useState(false);

  // Load dynamic themes on component mount
  useEffect(() => {
    const loadDynamicThemes = async () => {
      try {
        const themes = await spiritualGuidanceService.getAllAvailableThemes();
        setAvailableThemes(themes);
      } catch (error) {
        console.error('Error loading dynamic themes:', error);
      }
    };
    loadDynamicThemes();
  }, []);

  // Load dynamic content when theme is selected
  useEffect(() => {
    if (selectedTheme) {
      const loadDynamicContent = async () => {
        setLoadingDynamic(true);
        try {
          const dynamicVerses = await spiritualGuidanceService.getDynamicVerses(selectedTheme, 10);
          const staticVerses = filterByTheme(selectedTheme);
          setDynamicContent([...staticVerses, ...dynamicVerses]);
        } catch (error) {
          console.error('Error loading dynamic content:', error);
          setDynamicContent(filterByTheme(selectedTheme));
        } finally {
          setLoadingDynamic(false);
        }
      };
      loadDynamicContent();
    } else {
      setDynamicContent([]);
    }
  }, [selectedTheme]);

  const last7Days = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0,0,0,0);
    const filterDate = (d: any) => {
      const date = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.createdAt);
      return date >= start && date <= now;
    };
    const recent = deeds.filter(filterDate);
    const good = recent.filter(d => d.deedType === 'good').length;
    const bad = recent.filter(d => d.deedType === 'bad').length;
    return { good, bad };
  }, [deeds]);

  const verseOfTheDay = useMemo(() => pickVerseOfTheDay(new Date().toDateString()), []);
  const personalized = useMemo(() => pickPersonalized(last7Days.good >= last7Days.bad), [last7Days]);

  const themedList = useMemo(() => {
    if (!selectedTheme) return [];
    return dynamicContent.length > 0 ? dynamicContent : filterByTheme(selectedTheme);
  }, [selectedTheme, dynamicContent]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Read Quran Banner - Top */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 shadow-lg border text-white text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📖</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Read the Holy Quran</h3>
          <p className="text-green-100 text-lg">Explore the complete Quran with Arabic, English, and Bengali translations</p>
        </div>
        <button
          onClick={() => setShowQuranReader(true)}
          className="px-8 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Read Quran
        </button>
      </div>

      {/* Verse of the Day */}
      <div className="bg-gradient-to-br from-primary-50 via-purple-50 to-accent-50 rounded-2xl p-6 border border-primary-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">Verse of the Day</h3>
          <div className="text-sm text-gray-500">For everyone • {new Date().toLocaleDateString()}</div>
        </div>
        <GuidanceCard entry={verseOfTheDay} />
      </div>

      {/* Personalized for You */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">Personalized for You</h3>
          <div className="text-sm text-gray-500">{currentUser?.displayName || 'You'}</div>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          Last 7 days: <span className="text-green-600 font-medium">{last7Days.good} good</span> • <span className="text-red-600 font-medium">{last7Days.bad} bad</span>
        </div>
        <GuidanceCard entry={personalized} />
      </div>

      {/* Explore by Theme */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">Explore by Theme</h3>
          {selectedTheme && (
            <button onClick={() => setSelectedTheme('')} className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Clear</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {availableThemes.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTheme(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTheme === tag ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
        {selectedTheme ? (
          <div>
            {loadingDynamic ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Loading verses...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themedList.map(entry => (
                  <GuidanceCard key={entry.id} entry={entry} />
                ))}
                {themedList.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No verses found for this theme. Try another theme.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            Choose a theme to explore relevant verses. We now have {availableThemes.length} themes available!
          </div>
        )}
      </div>

      {/* Quran Reader Modal/Overlay */}
      {showQuranReader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Read Quran</h2>
              <button
                onClick={() => setShowQuranReader(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-full overflow-y-auto">
              <QuranReader />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualGuidance;
