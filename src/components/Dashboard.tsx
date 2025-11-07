import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import FloatingActionButton from './FloatingActionButton';
import DeedLoggingModal from './DeedLoggingModal';
import ShareProgressFAB from './ShareProgressFAB';
import DeedItem from './DeedItem';
import FirebaseDebug from './FirebaseDebug';
import PersonalGrowth from './PersonalGrowth';
import SpiritualGuidance from './SpiritualGuidance';
import KeyHighlighterSection from './KeyHighlighterSection';
import Salah from './Salah';
import Store from './Store';
import SpiritualGuidanceModal from './SpiritualGuidanceModal';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = getTranslations(language);
  const [activeSection, setActiveSection] = useState('progress');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deeds, setDeeds] = useState<any[]>([]);
  const [isLoadingDeeds, setIsLoadingDeeds] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [activeTimeFilter, setActiveTimeFilter] = useState('today');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customRangeStart, setCustomRangeStart] = useState('');
  const [customRangeEnd, setCustomRangeEnd] = useState('');
  
  // Trend graph specific filters
  const [trendTimeFilter, setTrendTimeFilter] = useState('week');
  const [showTrendCustomRange, setShowTrendCustomRange] = useState(false);
  const [trendCustomStart, setTrendCustomStart] = useState('');
  const [trendCustomEnd, setTrendCustomEnd] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [salatData, setSalatData] = useState<any>(null);
  const [isLoadingSalat, setIsLoadingSalat] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [spiritualModalOpen, setSpiritualModalOpen] = useState(false);

  // Scroll container ref for trend chart
  const trendScrollRef = useRef<HTMLDivElement | null>(null);

  // Define Goal interface for type safety
  interface Goal {
    id: string;
    title: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    targetType: 'good' | 'bad' | 'both';
    targetCount: number;
    currentCount: number;
    isCompleted: boolean;
    createdAt: any;
    lastCompleted?: any;
    completionHistory?: any[]; // Array of completion timestamps
    userId: string;
    isDeleted?: boolean;
    deletedAt?: any;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Helper function to get deeds for a specific time period
  const getDeedsForPeriod = (timeframe: string, deedType?: string) => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'alltime':
        // Return all deeds without date filtering
        const allDeeds = deedType ? deeds.filter(d => d.deedType === deedType) : deeds;
        return allDeeds;
      case 'custom':
        if (customRangeStart && customRangeEnd) {
          startDate = new Date(customRangeStart);
          endDate = new Date(customRangeEnd);
          endDate.setHours(23, 59, 59, 999); // End of day
        } else {
          return [];
        }
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    const periodDeeds = deeds.filter(d => {
      const deedDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.createdAt);
      
      if (startDate && endDate) {
        // Custom range filtering
        return deedDate >= startDate && deedDate <= endDate;
      } else if (startDate) {
        // Single date filtering
        return deedDate >= startDate;
      }
      
      return true;
    });
    
    if (deedType) {
      return periodDeeds.filter(d => d.deedType === deedType);
    }
    
    return periodDeeds;
  };

  // Fetch deeds from Firestore
  useEffect(() => {
    if (!currentUser) return;

    console.log('Setting up Firestore listener for user:', currentUser.uid);

    // Query deeds ordered by timestamp (latest first)
    const q = query(
      collection(db, 'deeds'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Firestore listener triggered. Found', querySnapshot.docs.length, 'deeds');
      const deedsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Processed deeds data:', deedsData);
      setDeeds(deedsData);
      setIsLoadingDeeds(false);
    }, (error) => {
      console.error('Error fetching deeds:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error
      });
      
      // Show specific error messages for common issues
      if (error.code === 'permission-denied') {
        console.error('Permission denied. Check Firestore security rules.');
      } else if (error.code === 'failed-precondition') {
        console.error('Missing index. Create composite index for userId + timestamp.');
      } else if (error.code === 'not-found') {
        console.error('Collection not found. Create the "deeds" collection in Firestore.');
      }
      
      setIsLoadingDeeds(false);
    });

    return () => {
      console.log('Cleaning up Firestore listener');
      unsubscribe();
    };
  }, [currentUser]);

  // Fetch goals from Firestore
  useEffect(() => {
    if (!currentUser) return;

    console.log('Setting up Firestore listener for goals, user:', currentUser.uid);

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('Goals listener triggered. Found', querySnapshot.docs.length, 'goals');
      const goalsData: Goal[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Goal));
      // Filter out deleted goals
      const activeGoals = goalsData.filter(goal => goal.isDeleted !== true);
      console.log('Processed goals data:', activeGoals);
      setGoals(activeGoals);
      setIsLoadingGoals(false);
    }, (error) => {
      console.error('Error fetching goals:', error);
      setIsLoadingGoals(false);
    });

    return () => {
      console.log('Cleaning up goals Firestore listener');
      unsubscribe();
    };
  }, [currentUser]);

  // Fetch today's salat data from Firestore
  useEffect(() => {
    if (!currentUser) return;

    console.log('Setting up Firestore listener for today\'s salat data, user:', currentUser.uid);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const docRef = doc(db, 'prayerTracking', `${currentUser.uid}_${todayStr}`);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Today\'s salat data loaded:', data);
        setSalatData(data);
      } else {
        console.log('No salat data found for today');
        setSalatData({ totalCompleted: 0 });
      }
      setIsLoadingSalat(false);
    }, (error) => {
      console.error('Error fetching today\'s salat data:', error);
      setSalatData({ totalCompleted: 0 });
      setIsLoadingSalat(false);
    });

    return () => {
      console.log('Cleaning up salat Firestore listener');
      unsubscribe();
    };
  }, [currentUser]);

  // Auto-collapse mobile menu on scroll down (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;
      
      // Only apply this behavior on mobile screens (sm breakpoint and below)
      if (window.innerWidth < 640) {
        // If scrolling down more than 10px and menu is open, close it
        if (scrollDifference > 10 && mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, mobileMenuOpen]);

  const handleDeedAdded = () => {
    // The deeds will automatically update via the Firestore listener
    console.log('Deed added callback triggered');
  };

  const handleShareProgress = async () => {
    if (!currentUser) return;
    
    try {
      const shareUrl = `${window.location.origin}/progress/${currentUser.uid}`;
      console.log('Generated share URL:', shareUrl);
      console.log('Current user:', currentUser);
      
      if (navigator.share) {
        await navigator.share({
          title: `${currentUser.displayName}'s Spiritual Journey`,
          text: 'Check out my spiritual progress on Naflume!',
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert(`Progress link copied to clipboard!\n\nURL: ${shareUrl}`);
      }
    } catch (error) {
      console.error('Error sharing progress:', error);
      // Fallback: copy to clipboard
      try {
        const shareUrl = `${window.location.origin}/progress/${currentUser.uid}`;
        await navigator.clipboard.writeText(shareUrl);
        alert(`Progress link copied to clipboard!\n\nURL: ${shareUrl}`);
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        alert('Unable to share progress. Please try again.');
      }
    }
  };

  const handleDeedUpdated = () => {
    // The deeds will automatically update via the Firestore listener
    console.log('Deed updated callback triggered');
  };

  // Filter deeds based on selected date filter
  const getFilteredDeeds = () => {
    if (dateFilter === 'all') return deeds;
    
    const now = new Date();
    let startDate: Date;
    
    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999); // End of day
          return deeds.filter(d => {
            const deedDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.createdAt);
            return deedDate >= start && deedDate <= end;
          });
        }
        return deeds;
      default:
        return deeds;
    }
    
    return deeds.filter(d => {
      const deedDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.createdAt);
      return deedDate >= startDate;
    });
  };

  // Reset date filter
  const resetDateFilter = () => {
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  // (Tooltip removed) No tooltip functions needed for inline labels

  // Helper to get daily progress data for trend line chart
  const getDailyProgressData = () => {
    const dailyData: { date: string; good: number; bad: number; total: number; fullDate: string }[] = [];
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    let daysToShow = 7;

    // Determine date range based on trend filter
    if (trendTimeFilter === 'week') {
      daysToShow = 7;
      startDate.setDate(now.getDate() - 6);
    } else if (trendTimeFilter === 'month') {
      daysToShow = 30;
      startDate.setDate(now.getDate() - 29);
    } else if (trendTimeFilter === 'year') {
      daysToShow = 365;
      startDate.setDate(now.getDate() - 364);
    } else if (trendTimeFilter === 'custom' && trendCustomStart && trendCustomEnd) {
      startDate = new Date(trendCustomStart);
      endDate = new Date(trendCustomEnd);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      daysToShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    // Generate data points
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);

      // Always use the original deeds array for daily progress calculations
      const dayDeeds = deeds.filter(d => {
        const deedDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.createdAt);
        return deedDate >= date && deedDate < nextDate;
      });

      const goodCount = dayDeeds.filter(d => d.deedType === 'good').length;
      const badCount = dayDeeds.filter(d => d.deedType === 'bad').length;
      const totalCount = dayDeeds.length;

      // Format date based on time period
      let dateLabel = '';
      if (trendTimeFilter === 'week') {
        dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (trendTimeFilter === 'month') {
        dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (trendTimeFilter === 'year') {
        dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (trendTimeFilter === 'custom') {
        dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      const dayData = {
        date: dateLabel,
        fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        good: goodCount,
        bad: badCount,
        total: totalCount
      };

      // Debug logging to help identify data issues
      console.log(`Day ${i}:`, dayData);
      
      dailyData.push(dayData);
    }
    
    console.log('Daily progress data:', dailyData);
    return dailyData;
  };

  // Helper function to get display text for custom range
  const getCustomRangeDisplayText = () => {
    if (customRangeStart && customRangeEnd) {
      const startDate = new Date(customRangeStart).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const endDate = new Date(customRangeEnd).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      return `${startDate} - ${endDate}`;
    }
    return 'Custom range';
  };

  const getCompletedGoalsForPeriod = (timeframe: string) => {
    if (isLoadingGoals || goals.length === 0) return 0;
    
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    switch (timeframe) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'alltime':
        return goals.filter(goal => goal.isCompleted).length;
      case 'custom':
        if (customRangeStart && customRangeEnd) {
          startDate = new Date(customRangeStart);
          endDate = new Date(customRangeEnd);
          endDate.setHours(23, 59, 59, 999); // End of day
        } else {
          return 0;
        }
        break;
      default:
        return goals.filter(goal => goal.isCompleted).length;
    }
    
    // Count goals that were completed within the specified period
    return goals.filter(goal => {
      if (!goal.isCompleted) return false;

      // If we have completion history, check if any completion falls within the timeframe
      if (goal.completionHistory && goal.completionHistory.length > 0) {
        return goal.completionHistory.some(completionTimestamp => {
          const completedDate = completionTimestamp?.toDate ? completionTimestamp.toDate() : new Date(completionTimestamp);
          
          if (startDate && endDate) {
            // Custom range filtering
            return completedDate >= startDate && completedDate <= endDate;
          } else if (startDate) {
            // Single date filtering
            return completedDate >= startDate;
          }
          
          return true;
        });
      }

      // Fallback to lastCompleted for backward compatibility
      if (!goal.lastCompleted) {
        if (timeframe === 'today') return false;
        return true;
      }

      const completedDate = goal.lastCompleted?.toDate ? goal.lastCompleted.toDate() : new Date(goal.lastCompleted);
      
      if (startDate && endDate) {
        // Custom range filtering
        return completedDate >= startDate && completedDate <= endDate;
      } else if (startDate) {
        // Single date filtering
        return completedDate >= startDate;
      }
      
      return true;
    }).length;
  };

  // Get today's salat completion count (only works for today filter)
  const getTodaySalatCompleted = (timeframe: string) => {
    if (timeframe !== 'today' || isLoadingSalat || !salatData) return 0;
    return salatData.totalCompleted || 0;
  };

  const navigationItems = [
    {
      id: 'progress',
      name: t('nav_progress'),
      description: 'Track your spiritual journey progress'
    },
    {
      id: 'salah',
      name: t('nav_salah'),
      description: 'Track your daily prayers and spiritual commitment'
    },
    {
      id: 'growth',
      name: t('nav_growth'),
      description: 'Monitor your self-improvement goals'
    },
    {
      id: 'activity',
      name: t('nav_activity'),
      description: 'View your latest good deeds and actions'
    },
    {
      id: 'guidance',
      name: t('nav_guidance'),
      description: 'Get personalized spiritual insights'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'progress':
        return (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-black mb-2">{t('progress_title')}</h2>
              <p className="text-gray-600">{t('progress_subtitle')}</p>
            </div>
            
            {/* Time Filter */}
            <div className="flex flex-col items-center mb-6 space-y-4">
              <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap justify-center">
                {['today', 'week', 'month', 'year', 'alltime'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => {
                      setActiveTimeFilter(timeframe);
                      setShowCustomRange(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTimeFilter === timeframe
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {timeframe === 'today' ? t('progress_filter_today') : 
                     timeframe === 'week' ? t('progress_filter_week') : 
                     timeframe === 'month' ? t('progress_filter_month') : 
                     timeframe === 'year' ? t('progress_filter_year') : t('progress_filter_alltime')}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setActiveTimeFilter('custom');
                    setShowCustomRange(true);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTimeFilter === 'custom'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {t('progress_filter_custom')}
                </button>
              </div>
              
              {/* Custom Range Inputs */}
              {showCustomRange && (
                <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">{t('progress_custom_from')}</label>
                    <input
                      type="date"
                      value={customRangeStart}
                      onChange={(e) => setCustomRangeStart(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">{t('progress_custom_to')}</label>
                    <input
                      type="date"
                      value={customRangeEnd}
                      onChange={(e) => setCustomRangeEnd(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (customRangeStart && customRangeEnd) {
                          const startDate = new Date(customRangeStart);
                          const endDate = new Date(customRangeEnd);
                          if (endDate >= startDate) {
                            setActiveTimeFilter('custom');
                          } else {
                            alert('End date must be after or equal to start date');
                          }
                        } else {
                          alert('Please select both start and end dates');
                        }
                      }}
                      className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!customRangeStart || !customRangeEnd}
                    >
                      {t('progress_custom_apply')}
                    </button>
                    <button
                      onClick={() => {
                        setCustomRangeStart('');
                        setCustomRangeEnd('');
                        setActiveTimeFilter('today');
                        setShowCustomRange(false);
                      }}
                      className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors duration-200"
                    >
                      {t('progress_custom_clear')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{t('card_progress_overview')}</h3>
                  
                  <p className="text-3xl font-bold text-primary-600">
                    {isLoadingDeeds ? '...' : (() => {
                      const periodDeeds = getDeedsForPeriod(activeTimeFilter);
                      const goodDeeds = periodDeeds.filter(d => d.deedType === 'good').length;
                      const totalDeeds = periodDeeds.length;
                      return totalDeeds > 0 ? Math.round((goodDeeds / totalDeeds) * 100) : 0;
                    })()}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTimeFilter === 'today' ? t('progress_filter_today') : 
                     activeTimeFilter === 'week' ? t('progress_filter_week') : 
                     activeTimeFilter === 'month' ? t('progress_filter_month') : 
                     activeTimeFilter === 'year' ? t('progress_filter_year') :
                     activeTimeFilter === 'alltime' ? t('progress_filter_alltime') :
                     activeTimeFilter === 'custom' ? getCustomRangeDisplayText() : t('progress_filter_week')}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{t('card_good_deeds')}</h3>
                  
                  <p className="text-3xl font-bold text-success-600">
                    {isLoadingDeeds ? '...' : getDeedsForPeriod(activeTimeFilter, 'good').length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTimeFilter === 'today' ? t('progress_filter_today') : 
                     activeTimeFilter === 'week' ? t('progress_filter_week') : 
                     activeTimeFilter === 'month' ? t('progress_filter_month') : 
                     activeTimeFilter === 'year' ? t('progress_filter_year') :
                     activeTimeFilter === 'alltime' ? t('progress_filter_alltime') :
                     activeTimeFilter === 'custom' ? getCustomRangeDisplayText() : t('progress_filter_week')}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{t('card_bad_deeds')}</h3>
                  
                  <p className="text-3xl font-bold text-red-600">
                    {isLoadingDeeds ? '...' : getDeedsForPeriod(activeTimeFilter, 'bad').length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTimeFilter === 'today' ? t('progress_filter_today') : 
                     activeTimeFilter === 'week' ? t('progress_filter_week') : 
                     activeTimeFilter === 'month' ? t('progress_filter_month') : 
                     activeTimeFilter === 'year' ? t('progress_filter_year') :
                     activeTimeFilter === 'alltime' ? t('progress_filter_alltime') :
                     activeTimeFilter === 'custom' ? getCustomRangeDisplayText() : t('progress_filter_week')}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{t('card_total_deeds')}</h3>
                  
                  <p className="text-3xl font-bold text-accent-600">
                    {isLoadingDeeds ? '...' : getDeedsForPeriod(activeTimeFilter).length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTimeFilter === 'today' ? t('progress_filter_today') : 
                     activeTimeFilter === 'week' ? t('progress_filter_week') : 
                     activeTimeFilter === 'month' ? t('progress_filter_month') : 
                     activeTimeFilter === 'year' ? t('progress_filter_year') :
                     activeTimeFilter === 'alltime' ? t('progress_filter_alltime') :
                     activeTimeFilter === 'custom' ? getCustomRangeDisplayText() : t('progress_filter_week')}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{t('card_goals_completed')}</h3>
                  
                  <p className="text-3xl font-bold text-yellow-600">
                    {isLoadingGoals ? '...' : getCompletedGoalsForPeriod(activeTimeFilter)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTimeFilter === 'today' ? t('progress_filter_today') : 
                     activeTimeFilter === 'week' ? t('progress_filter_week') : 
                     activeTimeFilter === 'month' ? t('progress_filter_month') : 
                     activeTimeFilter === 'year' ? t('progress_filter_year') :
                     activeTimeFilter === 'alltime' ? t('progress_filter_alltime') :
                     activeTimeFilter === 'custom' ? getCustomRangeDisplayText() : t('progress_filter_week')}
                  </p>
                </div>
              </div>
              
              {/* Salat Card - Only shows data for today filter */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{t('card_salat_completed')}</h3>
                  
                  <p className="text-3xl font-bold text-green-600">
                    {isLoadingSalat ? '...' : getTodaySalatCompleted(activeTimeFilter)}/5
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTimeFilter === 'today' ? t('progress_filter_today') : 'Today only'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Good vs Bad Deeds */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-black mb-6 text-center">Good vs Bad Deeds Ratio</h3>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    {/* Pie Chart Visualization */}
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      {(() => {
                        const goodDeeds = deeds.filter(d => d.deedType === 'good').length;
                        const badDeeds = deeds.filter(d => d.deedType === 'bad').length;
                        const total = goodDeeds + badDeeds;
                        
                        if (total === 0) {
                          return (
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="8"
                            />
                          );
                        }
                        
                        const goodPercentage = (goodDeeds / total) * 100;
                        const badPercentage = (badDeeds / total) * 100;
                        
                        const circumference = 2 * Math.PI * 40;
                        const goodDashArray = (goodPercentage / 100) * circumference;
                        const badDashArray = (badPercentage / 100) * circumference;
                        
                        return (
                          <>
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="8"
                              strokeDasharray={`${goodDashArray} ${circumference - goodDashArray}`}
                              strokeDashoffset={0}
                              strokeLinecap="round"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="8"
                              strokeDasharray={`${badDashArray} ${circumference - badDashArray}`}
                              strokeDashoffset={-goodDashArray}
                              strokeLinecap="round"
                            />
                          </>
                        );
                      })()}
                    </svg>
                    
                    {/* Center Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">
                          {deeds.length > 0 ? Math.round((deeds.filter(d => d.deedType === 'good').length / deeds.length) * 100) : 0}%
                        </p>
                        <p className="text-sm text-gray-600">{t('legend_good')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{t('legend_good')}: {deeds.filter(d => d.deedType === 'good').length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{t('legend_bad')}: {deeds.filter(d => d.deedType === 'bad').length}</span>
                  </div>
                </div>
              </div>
              
              {/* Bar Chart - Progress Over Time */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-black mb-6 text-center">{t('progress_over_time_title')}</h3>
                <div className="space-y-4">
                  {['today', 'week', 'month', 'year'].map((timeframe) => {
                    const now = new Date();
                    let startDate: Date;
                    
                    switch (timeframe) {
                      case 'today':
                        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        break;
                      case 'week':
                        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                      case 'month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        break;
                      case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                        break;
                      default:
                        startDate = new Date(0);
                    }
                    
                    const periodDeeds = deeds.filter(d => {
                      const deedDate = d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.createdAt);
                      return deedDate >= startDate;
                    });
                    
                    const goodDeeds = periodDeeds.filter(d => d.deedType === 'good').length;
                    const badDeeds = periodDeeds.filter(d => d.deedType === 'bad').length;
                    const total = periodDeeds.length;
                    const percentage = total > 0 ? Math.round((goodDeeds / total) * 100) : 0;
                    const barWidth = Math.min(percentage, 100);
                    
                    return (
                      <div key={timeframe} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 capitalize">
                            {timeframe === 'today' ? 'Today' : 
                             timeframe === 'week' ? 'This Week' : 
                             timeframe === 'month' ? 'This Month' : 'This Year'}
                          </span>
                          <span className="text-gray-600">{percentage}% ({goodDeeds}/{total})</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Daily Progress Trend Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-black mb-6 text-center">Daily Progress Trend</h3>
              
              {/* Trend Graph Filter Controls */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  {['week', 'month'].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => {
                        setTrendTimeFilter(timeframe);
                        setShowTrendCustomRange(false);
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        trendTimeFilter === timeframe
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {timeframe === 'week' ? 'This Week' : 'This Month'}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => {
                      setTrendTimeFilter('custom');
                      setShowTrendCustomRange(true);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      trendTimeFilter === 'custom'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Custom Range
                  </button>
                </div>

                {/* Custom Range Date Inputs */}
                {showTrendCustomRange && (
                  <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">From:</label>
                      <input
                        type="date"
                        value={trendCustomStart}
                        onChange={(e) => setTrendCustomStart(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">To:</label>
                      <input
                        type="date"
                        value={trendCustomEnd}
                        onChange={(e) => setTrendCustomEnd(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (trendCustomStart && trendCustomEnd) {
                          setTrendTimeFilter('custom');
                        }
                      }}
                      className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              
              {/* Line Chart Visualization */}
              <div className="relative h-96 mb-6 overflow-x-auto" ref={trendScrollRef}>
                {(() => {
                  const dailyData = getDailyProgressData();
                  const perDayWidth = 50; // px per day
                  const viewWidth = Math.max(1000, dailyData.length * perDayWidth);
                  const viewHeight = 400;

                  if (dailyData.length === 0) {
                    return (
                      <div className="h-full" style={{ width: `${viewWidth}px` }}>
                        <svg className="w-full h-full" viewBox={`0 0 ${viewWidth} ${viewHeight}`} preserveAspectRatio="xMidYMid meet">
                          <text x={viewWidth / 2} y={viewHeight / 2} textAnchor="middle" className="text-gray-400 text-lg">
                            No data available
                          </text>
                        </svg>
                      </div>
                    );
                  }

                  const margin = { top: 30, right: 50, bottom: 80, left: 80 };
                  const width = viewWidth - margin.left - margin.right;
                  const height = viewHeight - margin.top - margin.bottom;

                  // Find max value for Y scale (good or bad deeds)
                  const maxGood = Math.max(...dailyData.map(d => d.good));
                  const maxBad = Math.max(...dailyData.map(d => d.bad));
                  const maxValue = Math.max(maxGood, maxBad, 1); // At least 1 to avoid division by zero

                  // Calculate scales
                  const xScale = (i: number) => margin.left + (i / (dailyData.length - 1)) * width;
                  const yScale = (value: number) => margin.top + height - (value / maxValue) * height;

                  // Generate good deeds line path
                  const goodLinePath = dailyData.map((data, i) => {
                    const x = xScale(i);
                    const y = yScale(data.good);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');

                  // Generate bad deeds line path
                  const badLinePath = dailyData.map((data, i) => {
                    const x = xScale(i);
                    const y = yScale(data.bad);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');

                  return (
                    <div className="h-full" style={{ width: `${viewWidth}px` }}>
                      <svg className="w-full h-full" viewBox={`0 0 ${viewWidth} ${viewHeight}`} preserveAspectRatio="xMidYMid meet">
                        {/* Gradient for equal good/bad points */}
                        <defs>
                          <linearGradient id="equalPointGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {Array.from({ length: Math.min(maxValue + 1, 6) }, (_, i) => {
                          const tick = Math.round((i / Math.min(maxValue, 5)) * maxValue);
                          return (
                            <g key={tick}>
                              <line
                                x1={margin.left}
                                y1={yScale(tick)}
                                x2={margin.left + width}
                                y2={yScale(tick)}
                                stroke="#e5e7eb"
                                strokeWidth="1"
                                strokeDasharray="2,2"
                              />
                              <text
                                x={margin.left - 10}
                                y={yScale(tick) + 4}
                                textAnchor="end"
                                className="text-xs text-gray-500"
                              >
                                {tick}
                              </text>
                            </g>
                          );
                        })}

                        {/* Good deeds line */}
                        <path
                          d={goodLinePath}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Bad deeds line */}
                        <path
                          d={badLinePath}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data points for good deeds */}
                        {dailyData.map((data, i) => {
                          const x = xScale(i);
                          const y = yScale(data.good);
                          return (
                            <g key={`good-${i}`}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="white"
                                stroke="#10b981"
                                strokeWidth="2"
                              />
                              <text x={x + 8} y={y - 8} className="text-xs" fill="#10b981">{`+${data.good}`}</text>
                            </g>
                          );
                        })}

                        {/* Data points for bad deeds */}
                        {dailyData.map((data, i) => {
                          const x = xScale(i);
                          const y = yScale(data.bad);
                          return (
                            <g key={`bad-${i}`}>
                              <circle
                                cx={x}
                                cy={y}
                                r="5"
                                fill="white"
                                stroke="#ef4444"
                                strokeWidth="2"
                              />
                              <text x={x + 8} y={y + 14} className="text-xs" fill="#ef4444">{`-${data.bad}`}</text>
                            </g>
                          );
                        })}

                        {/* Highlight equal-value points with gradient ring */}
                        {dailyData.map((data, i) => {
                          if (data.good === data.bad && data.good > 0) {
                            const x = xScale(i);
                            const y = yScale(data.good);
                            return (
                              <g key={`equal-${i}`}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="8"
                                  fill="none"
                                  stroke="url(#equalPointGradient)"
                                  strokeWidth="3"
                                />
                              </g>
                            );
                          }
                          return null;
                        })}

                        {/* X-axis labels */}
                        {dailyData.map((data, i) => {
                          const x = xScale(i);
                          return (
                            <g key={i}>
                              <text
                                x={x}
                                y={height + margin.top + 20}
                                textAnchor="middle"
                                className="text-xs text-gray-600 font-medium"
                              >
                                {data.date}
                              </text>
                            </g>
                          );
                        })}

                        {/* Legend */}
                        <g>
                          <rect x={margin.left + width - 120} y={margin.top} width="120" height="50" fill="white" opacity="0.9" rx="5"/>
                          <line x1={margin.left + width - 110} y1={margin.top + 15} x2={margin.left + width - 90} y2={margin.top + 15} stroke="#10b981" strokeWidth="3"/>
                          <text x={margin.left + width - 85} y={margin.top + 20} className="text-xs text-gray-700">Good Deeds</text>
                          <line x1={margin.left + width - 110} y1={margin.top + 30} x2={margin.left + width - 90} y2={margin.top + 30} stroke="#ef4444" strokeWidth="3"/>
                          <text x={margin.left + width - 85} y={margin.top + 35} className="text-xs text-gray-700">Bad Deeds</text>
                        </g>
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* Daily Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Daily Summary</h4>
                    <p className="text-sm text-gray-600">
                      {(() => {
                        const dailyData = getDailyProgressData();
                        if (dailyData.length < 2) return "Insufficient data for daily analysis";
                        
                        const today = dailyData[dailyData.length - 1];
                        const yesterday = dailyData[dailyData.length - 2];
                        
                        const goodChange = today.good - yesterday.good;
                        const badChange = today.bad - yesterday.bad;
                        
                        let message = "";
                        if (goodChange > 0 && badChange < 0) {
                          message = `🎉 Excellent! More good deeds (+${goodChange}) and fewer bad deeds (${badChange}) today!`;
                        } else if (goodChange > 0) {
                          message = `👍 Great progress! +${goodChange} more good deeds today!`;
                        } else if (badChange < 0) {
                          message = `🎯 Good improvement! ${badChange} fewer bad deeds today!`;
                        } else if (goodChange === 0 && badChange === 0) {
                          message = `➡️ Consistent performance today!`;
                        } else {
                          message = `💪 Keep striving! Every day is a new opportunity for growth.`;
                        }
                        
                        return message;
                      })()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {(() => {
                        const dailyData = getDailyProgressData();
                        if (dailyData.length === 0) return "0";
                        const today = dailyData[dailyData.length - 1];
                        return `+${today.good}`;
                      })()}
                    </div>
                    <div className="text-sm text-gray-500">Today's Good Deeds</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Share Progress FAB - only show in progress section */}
            <ShareProgressFAB onClick={handleShareProgress} />
          </div>
        );
      case 'salah':
        return <Salah />;
      case 'growth':
        return <PersonalGrowth />;
      case 'activity':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Recent Activities</h2>
              <p className="text-gray-600">Track your spiritual journey through your logged deeds</p>
            </div>
            
            {/* Date Filter Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">Filter by Date</h3>
                <button
                  onClick={resetDateFilter}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Quick Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDateFilter('all')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      dateFilter === 'all'
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => setDateFilter('today')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      dateFilter === 'today'
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setDateFilter('week')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      dateFilter === 'week'
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setDateFilter('month')}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      dateFilter === 'month'
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    This Month
                  </button>
                </div>
                
                {/* Custom Date Range */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Custom Range:</span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => {
                        setCustomStartDate(e.target.value);
                        setDateFilter('custom');
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-auto"
                    />
                    <span className="text-sm text-gray-500 text-center sm:text-left">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => {
                        setCustomEndDate(e.target.value);
                        setDateFilter('custom');
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">Your Deed Journal</h3>
                  {dateFilter !== 'all' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {getFilteredDeeds().length} of {deeds.length} total deeds
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Good Deeds: {getFilteredDeeds().filter(d => d.deedType === 'good').length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Bad Deeds: {getFilteredDeeds().filter(d => d.deedType === 'bad').length}</span>
                  </div>
                </div>
              </div>
              
              {isLoadingDeeds ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading your deeds...</p>
                </div>
              ) : deeds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No deeds logged yet</h4>
                  <p className="text-gray-500">Start your spiritual journey by logging your first deed using the + button!</p>
                </div>
                             ) : (
                 <div className="space-y-4">
                   {getFilteredDeeds().length === 0 ? (
                     <div className="text-center py-8">
                       <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <h4 className="text-lg font-medium text-gray-700 mb-2">No deeds found for selected period</h4>
                       <p className="text-gray-500">Try adjusting your date filter or log a new deed</p>
                     </div>
                   ) : (
                     getFilteredDeeds().map((deed) => (
                       <DeedItem 
                         key={deed.id} 
                         deed={deed} 
                         onDeedUpdated={handleDeedUpdated}
                       />
                     ))
                   )}
                 </div>
               )}
            </div>
          </div>
        );
      case 'guidance':
        return <SpiritualGuidance deeds={deeds} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top App Bar */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center shadow-lg rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-2xl font-bold text-black">Naflume</h1>
                <span className="text-xs text-gray-500 -mt-1">Tazkiyah an-Nafs</span>
              </div>
            </div>

            {/* Desktop User Profile and Actions */}
            <div className="hidden sm:flex items-center space-x-4">
              {/* Spiritual Guidance Button */}
              <button
                onClick={() => setSpiritualModalOpen(true)}
                className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors duration-300"
                title="Spiritual Guidance"
                aria-label="Open spiritual guidance"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </button>
              
              {/* Store button - prominent tomato color */}
              <a
                href="/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white"
                style={{ backgroundColor: '#ff6347' }}
                title="Store"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7H4l2-4h12l2 4z" />
                  <path d="M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
                  <path d="M16 11a4 4 0 0 1-8 0" />
                </svg>
                <span>Store</span>
              </a>
              {/* Language chooser */}
              <div className="flex items-center space-x-2 mr-2">
                <label className="text-xs text-gray-600">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-black hidden sm:block">
                  {currentUser?.displayName || 'User'}
                </span>
              </div>
              <Link
                to="/vision"
                className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
                title="Our Vision"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </Link>
              
              <Link
                to="/contact"
                className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md"
                title="Contact Us"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
              <button
                onClick={handleLogout}
                className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentUser?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-black">
                  {currentUser?.displayName || 'User'}
                </span>
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2">
                {/* Mobile Spiritual Guidance Button */}
                <button
                  onClick={() => {
                    setSpiritualModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors duration-300"
                  title="Spiritual Guidance"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                  </svg>
                  <span className="font-medium text-sm">Guidance</span>
                </button>
                
                <a
                  href="/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 font-bold text-white rounded-xl"
                  style={{ backgroundColor: '#ff6347' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4l2-4h12l2 4z" />
                    <path d="M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
                    <path d="M16 11a4 4 0 0 1-8 0" />
                  </svg>
                  <span>Store</span>
                </a>
                <Link
                  to="/vision"
                  className="flex items-center space-x-2 p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium">Vision</span>
                </Link>
                
                <Link
                  to="/contact"
                  className="flex items-center space-x-2 p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Contact</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
              {/* Mobile language chooser */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Language</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                  className="px-2 py-2 text-sm border border-gray-300 rounded-md bg-white w-40"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Highlighter Section */}
      <KeyHighlighterSection mobileMenuOpen={mobileMenuOpen} />

      {/* Horizontal Tab Navigation - Full Width */}
      <div className={`bg-white border-b border-gray-200 sticky z-50 transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'top-[200px] sm:top-36' : 'top-36'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 w-full">
            {navigationItems.map((item) => {
              const isSalah = item.id === 'salah';
              const isActive = activeSection === item.id;
              const baseClasses = 'flex flex-col items-center justify-center py-3 px-1 sm:py-4 sm:px-2 transition-all duration-200';

              // Calm special style for Salah tab
              const salahInactive = 'text-teal-700 bg-teal-50 hover:bg-teal-100 hover:text-teal-800 border-b-2 border-transparent';
              const salahActive = 'bg-teal-100 text-teal-800 border-b-2 border-teal-500 shadow-inner';

              // Default styles for other tabs
              const otherInactive = 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 border-b-2 border-transparent';
              const otherActive = 'bg-primary-50 text-primary-700 border-b-2 border-primary-600';

              const classes = isSalah
                ? `${baseClasses} ${isActive ? salahActive : salahInactive}`
                : `${baseClasses} ${isActive ? otherActive : otherInactive}`;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={classes}
                >
                  <span className="text-xs sm:text-sm font-medium text-center leading-tight">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`py-8 px-4 transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'pt-[280px] sm:pt-8' : 'pt-8'
      }`}>
        {renderSectionContent()}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      {/* Deed Logging Modal */}
      <DeedLoggingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeedAdded={handleDeedAdded}
      />
      
      {/* Spiritual Guidance Modal */}
      <SpiritualGuidanceModal 
        isOpen={spiritualModalOpen} 
        onClose={() => setSpiritualModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
