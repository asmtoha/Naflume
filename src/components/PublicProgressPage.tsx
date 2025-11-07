import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { spiritualGuidanceService, SpiritualContent } from '../data/spiritualGuidanceService';
import { SPIRITUAL_GUIDANCE_DATA, GuidanceEntry } from '../data/spiritualGuidance';

interface PublicProgressData {
  userId: string;
  displayName: string;
  goodDeeds: number;
  badDeeds: number;
  totalDeeds: number;
  currentGoal?: {
    title: string;
    progress: number;
    endDate: string;
  };
  recentDeeds: Array<{
    title: string;
    date: string;
    deedType: 'good' | 'bad';
  }>;
  joinDate: string;
  currentDate: string;
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }>;
  salatCompleted: number;
}

interface FirestoreDeed {
  id: string;
  deedType: 'good' | 'bad';
  description: string;
  createdAt: any; // Firestore Timestamp
  [key: string]: any;
}

interface FirestoreGoal {
  id: string;
  title: string;
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  [key: string]: any;
}

interface FirestoreUser {
  displayName: string;
  createdAt: any; // Firestore Timestamp
  [key: string]: any;
}

// Helper functions for calculations
const calculateAchievements = (goodDeeds: number, badDeeds: number, totalDeeds: number) => {
  return [
    {
      title: "First Steps",
      description: "Completed your first good deed",
      icon: "🌟",
      unlocked: goodDeeds >= 1
    },
    {
      title: "Good Deed Master",
      description: "Completed 10 good deeds",
      icon: "⭐",
      unlocked: goodDeeds >= 10
    },
    {
      title: "Spiritual Warrior",
      description: "Completed 50 good deeds",
      icon: "🏆",
      unlocked: goodDeeds >= 50
    },
    {
      title: "Consistency King",
      description: "Completed 100 total deeds",
      icon: "👑",
      unlocked: totalDeeds >= 100
    },
    {
      title: "Pure Heart",
      description: "No bad deeds recorded",
      icon: "💎",
      unlocked: badDeeds === 0 && totalDeeds > 0
    },
    {
      title: "Century Club",
      description: "Completed 100 good deeds",
      icon: "🎯",
      unlocked: goodDeeds >= 100
    }
  ];
};

// Helper function to fetch today's salat data
const fetchTodaySalatData = async (userId: string) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const docRef = doc(db, 'prayerTracking', `${userId}_${todayStr}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.totalCompleted || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching salat data:', error);
    return 0;
  }
};

const PublicProgressPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [progressData, setProgressData] = useState<PublicProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verseOfTheDay, setVerseOfTheDay] = useState<SpiritualContent | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);

  // Fetch verse of the day (rotates every 24 hours)
  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        setVerseLoading(true);
        console.log('Selecting verse of the day based on current date...');

        // Determine a stable daily index so it changes every 24 hours (UTC day)
        const now = new Date();
        const dayNumber = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
        const idx = SPIRITUAL_GUIDANCE_DATA.length > 0
          ? dayNumber % SPIRITUAL_GUIDANCE_DATA.length
          : 0;

        const selected = SPIRITUAL_GUIDANCE_DATA[idx] || SPIRITUAL_GUIDANCE_DATA[0];
        const verse = {
          id: selected.id,
          source: selected.source,
          reference: selected.reference,
          arabic: selected.arabic,
          english: selected.english,
          bangla: selected.bangla,
          tafsirRef: selected.tafsirRef,
          tafsirEn: selected.tafsirEn,
          tafsirBn: selected.tafsirBn,
          type: selected.type,
          tags: selected.tags,
          priority: 1,
          createdAt: new Date()
        };

        console.log('Verse of the day index:', idx, 'Verse:', verse);
        setVerseOfTheDay(verse);
      } catch (error) {
        console.error('Error selecting verse of the day:', error);
        const fallback = SPIRITUAL_GUIDANCE_DATA[0];
        if (fallback) {
          setVerseOfTheDay({
            id: fallback.id,
            source: fallback.source,
            reference: fallback.reference,
            arabic: fallback.arabic,
            english: fallback.english,
            bangla: fallback.bangla,
            tafsirRef: fallback.tafsirRef,
            tafsirEn: fallback.tafsirEn,
            tafsirBn: fallback.tafsirBn,
            type: fallback.type,
            tags: fallback.tags,
            priority: 1,
            createdAt: new Date()
          });
        }
      } finally {
        setVerseLoading(false);
      }
    };

    fetchVerseOfTheDay();
  }, []);

  useEffect(() => {
    const fetchProgressData = async () => {
      console.log('Fetching progress data for userId:', userId);
      console.log('Current URL:', window.location.href);
      
      if (!userId) {
        console.error('No userId provided in URL params');
        setError('Invalid user ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        console.log('Fetching user data from Firestore...');
        const userDoc = await getDoc(doc(db, 'users', userId));
        let userData: FirestoreUser;
        
        if (!userDoc.exists()) {
          // If user doesn't exist in users collection, create a fallback
          console.log('User not found in users collection, using fallback data');
          console.log('This might be why the page appears empty - user data not found');
          userData = {
            displayName: 'Anonymous User',
            createdAt: null
          };
        } else {
          userData = userDoc.data() as FirestoreUser;
          console.log('User data found:', userData);
        }
        
        // Fetch deeds
        const deedsQuery = query(collection(db, 'deeds'), where('userId', '==', userId));
        const deedsSnapshot = await getDocs(deedsQuery);
        const deeds: FirestoreDeed[] = deedsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as FirestoreDeed));

        console.log('Fetched deeds:', deeds.length);

        // Fetch current key highlighter goal
        const goalsQuery = query(collection(db, 'keyHighlighters'), where('userId', '==', userId));
        const goalsSnapshot = await getDocs(goalsQuery);
        const goals: FirestoreGoal[] = goalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as FirestoreGoal));

        console.log('Fetched goals:', goals.length);

        // Find active goal (if any)
        const activeGoal = goals.find(goal => {
          if (!goal.endDate || typeof goal.endDate.toDate !== 'function') return false;
          const endDate = goal.endDate.toDate();
          return endDate && endDate > new Date();
        });

        // Separate good and bad deeds
        const goodDeeds = deeds.filter(deed => deed.deedType === 'good');
        const badDeeds = deeds.filter(deed => deed.deedType === 'bad');

        const progressData: PublicProgressData = {
          userId,
          displayName: userData.displayName || 'Anonymous User',
          goodDeeds: goodDeeds.length,
          badDeeds: badDeeds.length,
          totalDeeds: deeds.length,
          currentGoal: activeGoal ? {
            title: activeGoal.title,
            progress: (() => {
              if (!activeGoal.startDate || !activeGoal.endDate || 
                  typeof activeGoal.startDate.toDate !== 'function' || 
                  typeof activeGoal.endDate.toDate !== 'function') {
                return 0;
              }
              const startTime = activeGoal.startDate.toDate().getTime();
              const endTime = activeGoal.endDate.toDate().getTime();
              const currentTime = new Date().getTime();
              return Math.min(100, Math.max(0, 
                ((currentTime - startTime) / (endTime - startTime)) * 100
              ));
            })(),
            endDate: (activeGoal.endDate && typeof activeGoal.endDate.toDate === 'function') 
              ? activeGoal.endDate.toDate().toLocaleDateString() 
              : ''
          } : undefined,
          recentDeeds: deeds
            .filter(deed => deed.createdAt && typeof deed.createdAt.toDate === 'function')
            .sort((a, b) => {
              const aTime = a.createdAt?.toDate().getTime() || 0;
              const bTime = b.createdAt?.toDate().getTime() || 0;
              return bTime - aTime;
            })
            .slice(0, 5)
            .map(deed => ({
              title: deed.description,
              date: deed.createdAt?.toDate().toLocaleDateString() || '',
              deedType: deed.deedType
            })),
          joinDate: (userData.createdAt && typeof userData.createdAt.toDate === 'function') 
            ? userData.createdAt.toDate().toLocaleDateString() 
            : 'Recently',
          currentDate: new Date().toLocaleDateString(),
          achievements: calculateAchievements(goodDeeds.length, badDeeds.length, deeds.length),
          salatCompleted: await fetchTodaySalatData(userId)
        };

        console.log('Created progress data:', progressData);
        
        // If no data found, create a minimal progress data
        if (deeds.length === 0 && goals.length === 0) {
          console.log('No deeds or goals found, creating minimal data');
          const minimalData: PublicProgressData = {
            userId,
            displayName: userData.displayName || 'Anonymous User',
            goodDeeds: 0,
            badDeeds: 0,
            totalDeeds: 0,
            currentGoal: undefined,
            recentDeeds: [],
            joinDate: (userData.createdAt && typeof userData.createdAt.toDate === 'function') 
              ? userData.createdAt.toDate().toLocaleDateString() 
              : 'Recently',
            currentDate: new Date().toLocaleDateString(),
            achievements: calculateAchievements(0, 0, 0),
            salatCompleted: 0
          };
          setProgressData(minimalData);
        } else {
          setProgressData(progressData);
        }
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [userId]);

  // Animated counter component
  const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number;
      const startCount = 0;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(startCount + (target - startCount) * easeOutQuart));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [target, duration]);

    return <span>{count.toLocaleString()}</span>;
  };

  // Update document title and meta tags dynamically
  useEffect(() => {
    if (progressData) {
      document.title = `${progressData.displayName}'s Spiritual Journey - Naflume`;
      
      // Update meta tags for social media previews
      updateMetaTags(progressData);
    } else {
      document.title = 'Spiritual Progress - Naflume';
    }
  }, [progressData]);

  // Function to update meta tags for social media previews
  const updateMetaTags = (data: PublicProgressData) => {
    const description = `${data.displayName} has completed ${data.goodDeeds} good deeds and ${data.salatCompleted}/5 prayers today. Join them on Naflume!`;
    const imageUrl = `${window.location.origin}/og-image.html?name=${encodeURIComponent(data.displayName)}&good=${data.goodDeeds}&bad=${data.badDeeds}&total=${data.totalDeeds}&salat=${data.salatCompleted}`;
    
    // Update or create meta tags
    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: `${data.displayName}'s Spiritual Journey - Naflume` },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${data.displayName}'s Spiritual Journey - Naflume` },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.name = name;
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Progress Not Found</h1>
          <p className="text-gray-600">{error || 'This progress page could not be loaded.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Watermark Logo */}
      <div className="absolute top-8 right-8 opacity-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white flex items-center justify-center shadow-sm rounded-lg">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-400">Naflume</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Naflume Logo */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-lg rounded-lg">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span className="text-3xl font-bold text-black">
                  Naflume
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {progressData.displayName}'s Spiritual Journey
            </h1>
            <div className="flex items-center justify-center space-x-4 text-lg text-gray-600">
              <span>Started: {progressData.joinDate}</span>
              <span>•</span>
              <span>Today: {progressData.currentDate}</span>
            </div>
          </div>

          {/* Verse of the Day */}
          {!verseLoading && (
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-200 mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Verse of the Day</h2>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  {verseOfTheDay ? (
                    <>
                      {/* Arabic Text */}
                      <div className="text-3xl md:text-4xl leading-relaxed mb-6 font-[700] text-gray-900" style={{fontFamily:'Tahoma, serif'}}>
                        {verseOfTheDay.arabic}
                      </div>
                      
                      {/* English Translation */}
                      <div className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
                        {verseOfTheDay.english}
                      </div>
                      
                      {/* Bengali Translation */}
                      <div className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                        {verseOfTheDay.bangla}
                      </div>
                      
                      {/* Reference */}
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <span className="bg-white/60 px-3 py-1 rounded-full">
                          {verseOfTheDay.source} • {verseOfTheDay.reference}
                        </span>
                        <span className="bg-white/60 px-3 py-1 rounded-full">
                          {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl leading-relaxed mb-6 font-[700] text-gray-900" style={{fontFamily:'Tahoma, serif'}}>
                        وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ
                      </div>
                      
                      <div className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
                        By time, surely mankind is in loss, except those who believe and do good deeds and encourage truth and patience.
                      </div>
                      
                      <div className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
                        সময়ের শপথ, নিশ্চয় মানুষ ক্ষতিগ্রস্ত, তবে তারা নয় যারা ঈমান আনলো, সৎকর্ম করলো এবং সত্য ও সবরের উপদেশ দিলো।
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <span className="bg-white/60 px-3 py-1 rounded-full">
                          Quran • Al-Asr (103:1-3)
                        </span>
                        <span className="bg-white/60 px-3 py-1 rounded-full">
                          {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verse Loading State */}
          {verseLoading && (
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-200 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading today's spiritual guidance...</p>
              </div>
            </div>
          )}

          {/* Enhanced Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Good Deeds */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  <AnimatedCounter target={progressData.goodDeeds} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Good Deeds</h3>
                <p className="text-sm text-gray-600">Acts of kindness</p>
              </div>
            </div>

            {/* Bad Deeds */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  <AnimatedCounter target={progressData.badDeeds} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Bad Deeds</h3>
                <p className="text-sm text-gray-600">Areas for improvement</p>
              </div>
            </div>

            {/* Total Deeds */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter target={progressData.totalDeeds} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Deeds</h3>
                <p className="text-sm text-gray-600">All actions logged</p>
              </div>
            </div>

            {/* Salat Completed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  <AnimatedCounter target={progressData.salatCompleted} />/5
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Salat Today</h3>
                <p className="text-sm text-gray-600">Prayers completed</p>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {progressData.achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`text-center p-4 rounded-xl transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md' 
                      : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className={`font-semibold text-sm mb-1 ${
                    achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Goal */}
          {progressData.currentGoal && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  <AnimatedCounter target={Math.round(progressData.currentGoal.progress)} />
                  <span className="text-lg">%</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Current Goal</h3>
                <p className="text-gray-600 mb-4">{progressData.currentGoal.title}</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressData.currentGoal.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Ends {progressData.currentGoal.endDate}</p>
              </div>
            </div>
          )}

          {/* Recent Deeds */}
          {progressData.recentDeeds.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Recent Deeds</h3>
              <div className="space-y-4">
                {progressData.recentDeeds.map((deed, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-xl border ${
                      deed.deedType === 'good' 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' 
                        : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      deed.deedType === 'good' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-red-500 to-pink-600'
                    }`}>
                      {deed.deedType === 'good' ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-800">{deed.title}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          deed.deedType === 'good' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {deed.deedType === 'good' ? 'Good' : 'Bad'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{deed.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-white/20 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 rounded-full"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-purple-500 rounded-full"></div>
                <div className="absolute bottom-4 left-8 w-4 h-4 bg-pink-500 rounded-full"></div>
                <div className="absolute bottom-8 right-4 w-10 h-10 bg-indigo-500 rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Start Your Own Spiritual Journey</h3>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join <span className="font-semibold text-blue-600">{progressData.displayName}</span> and thousands of others who are tracking their spiritual growth, building positive habits, and making a difference in the world.
                </p>
                
                {/* Features List */}
                <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                  <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Track Good Deeds</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Set Goals</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Build Streaks</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="/"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span>Join Naflume Free</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <div className="text-sm text-gray-500">
                    ✨ Free forever • No credit card required
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-8 w-16 h-16 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-8 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  );
};

export default PublicProgressPage;