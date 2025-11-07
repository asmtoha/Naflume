import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { fetchPrayerTimes, PrayerTime, isPrayerTimePassed, getNextPrayerTime, getTimeUntilNextPrayer, getUserTimezoneInfo, getUserLocation } from '../utils/prayerTimes';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';
import PrayerCalendar from './PrayerCalendar';

// Remove duplicate interface since it's imported from utils

interface PrayerData {
  date: string;
  prayers: PrayerTime[];
  totalCompleted: number;
  userId: string;
}

interface ManualTimeInputProps {
  prayerName: string;
  currentTime: string;
  onSave: (prayerName: string, newTime: string) => void;
  onCancel: () => void;
}

const ManualTimeInput: React.FC<ManualTimeInputProps> = ({ prayerName, currentTime, onSave, onCancel }) => {
  const [timeInput, setTimeInput] = useState(currentTime);
  const [isValid, setIsValid] = useState(true);

  const validateTime = (time: string) => {
    // Basic time validation (HH:MM AM/PM format)
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return timeRegex.test(time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeInput(value);
    setIsValid(validateTime(value) || value === '');
  };

  const handleSave = () => {
    if (validateTime(timeInput)) {
      onSave(prayerName, timeInput);
    }
  };

  const handleReset = () => {
    setTimeInput(currentTime);
    setIsValid(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prayer Time (HH:MM AM/PM)
        </label>
        <input
          type="text"
          value={timeInput}
          onChange={handleTimeChange}
          placeholder="e.g., 4:30 AM"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isValid ? 'border-gray-300' : 'border-red-500'
          }`}
        />
        {!isValid && (
          <p className="text-red-500 text-sm mt-1">Please enter time in HH:MM AM/PM format</p>
        )}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Example:</strong> If Fajr starts at 4:07 AM in your area but your local mosque starts at 4:30 AM, 
          you can set it to 4:30 AM here.
        </p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          disabled={!isValid || timeInput === currentTime}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Time
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const Salah: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'calendar'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isTimeInputOpen, setIsTimeInputOpen] = useState(false);
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState<number | null>(null);
  const [currentPrayerStatus, setCurrentPrayerStatus] = useState<'on-time' | 'late' | 'congregation' | null>(null);
  const [customPrayerTime, setCustomPrayerTime] = useState('');
  const [customHour, setCustomHour] = useState('');
  const [customMinute, setCustomMinute] = useState('');
  const [customAmPm, setCustomAmPm] = useState('AM');
  const [isManualTimeModalOpen, setIsManualTimeModalOpen] = useState(false);
  const [editingPrayerIndex, setEditingPrayerIndex] = useState<number | null>(null);
  const [manualTimes, setManualTimes] = useState<{[key: string]: string}>({});

  // Helper function to convert Firestore Timestamp to Date object
  const convertToDate = (timestamp: any): Date => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };

  // Cache for prayer times to avoid repeated API calls
  const prayerTimesCache = useRef<Map<string, PrayerTime[]>>(new Map());

  // Get prayer times from API with caching
  const getPrayerTimes = async (date: Date): Promise<PrayerTime[]> => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check cache first
    if (prayerTimesCache.current.has(dateStr)) {
      return prayerTimesCache.current.get(dateStr)!;
    }

    try {
      const prayerTimes = await fetchPrayerTimes(date);
      // Cache the result
      prayerTimesCache.current.set(dateStr, prayerTimes);
      return prayerTimes;
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      // Fallback to mock data
      const baseTimes = [
        { name: 'Fajr', time: '5:30 AM' },
        { name: 'Dhuhr', time: '12:15 PM' },
        { name: 'Asr', time: '3:45 PM' },
        { name: 'Maghrib', time: '6:20 PM' },
        { name: 'Isha', time: '7:45 PM' }
      ];

      const fallbackTimes = baseTimes.map(prayer => ({
        ...prayer,
        completed: false,
        status: null
      }));
      
      // Cache fallback data too
      prayerTimesCache.current.set(dateStr, fallbackTimes);
      return fallbackTimes;
    }
  };

  // Load prayer data for a specific date
  const loadPrayerData = async (date: Date) => {
    if (!currentUser) return;

    setIsLoading(true);
    const dateStr = date.toISOString().split('T')[0];
    const docRef = doc(db, 'prayerTracking', `${currentUser.uid}_${dateStr}`);
    
    try {
      // Get fresh prayer times first (with caching)
      const freshPrayerTimes = await getPrayerTimes(date);
      
      // Try to get saved data
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const savedPrayers = data.prayers || [];
        
        // Merge fresh times with saved completion status
        const mergedPrayers = freshPrayerTimes.map(freshPrayer => {
          const savedPrayer = savedPrayers.find((p: PrayerTime) => 
            p.name.toLowerCase() === freshPrayer.name.toLowerCase()
          );
          if (savedPrayer) {
            // Convert Firestore Timestamp to Date object if needed
            const completedAt = savedPrayer.completedAt ? convertToDate(savedPrayer.completedAt) : undefined;
            
            return { 
              ...freshPrayer, 
              completed: savedPrayer.completed,
              status: savedPrayer.status,
              completedAt: completedAt
            };
          }
          return freshPrayer;
        });
        
        setPrayerData({
          date: dateStr,
          prayers: mergedPrayers,
          totalCompleted: data.totalCompleted || 0,
          userId: currentUser.uid
        });
      } else {
        // No saved data, use fresh prayer times
        setPrayerData({
          date: dateStr,
          prayers: freshPrayerTimes,
          totalCompleted: 0,
          userId: currentUser.uid
        });
      }
    } catch (error) {
      console.error('Error loading prayer data:', error);
      // Fallback to cached prayer times
      const fallbackPrayerTimes = await getPrayerTimes(date);
      setPrayerData({
        date: dateStr,
        prayers: fallbackPrayerTimes,
        totalCompleted: 0,
        userId: currentUser.uid
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save prayer data to Firebase
  const savePrayerData = async (data: PrayerData) => {
    if (!currentUser) return;

    const docRef = doc(db, 'prayerTracking', `${currentUser.uid}_${data.date}`);
    try {
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error saving prayer data:', error);
      // Show user-friendly error message
      alert('Failed to save prayer data. Please try again.');
    }
  };

  // Open time input modal
  const openTimeInput = (prayerIndex: number, status: 'on-time' | 'late' | 'congregation') => {
    setCurrentPrayerIndex(prayerIndex);
    setCurrentPrayerStatus(status);
    setCustomPrayerTime('');
    setCustomHour('');
    setCustomMinute('');
    setCustomAmPm('AM');
    setIsTimeInputOpen(true);
  };

  // Mark prayer as completed with custom time
  const markPrayerCompleted = (prayerIndex: number, status: 'on-time' | 'late' | 'congregation', customTime?: string) => {
    if (!prayerData || !currentUser) return;

    let completedAt: Date;
    
    if (customTime) {
      // Parse custom time input
      try {
        const [time, period] = customTime.split(' ');
        const [hours, minutes] = time.split(':');
        
        let prayerHour = parseInt(hours, 10);
        const prayerMinute = parseInt(minutes, 10);
        
        // Convert to 24-hour format
        if (period === 'PM' && prayerHour !== 12) {
          prayerHour += 12;
        } else if (period === 'AM' && prayerHour === 12) {
          prayerHour = 0;
        }
        
        // Create date for the selected date with the custom time
        completedAt = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), prayerHour, prayerMinute, 0, 0);
      } catch (error) {
        console.error('Error parsing custom time:', error);
        completedAt = new Date(); // Fallback to current time
      }
    } else {
      completedAt = new Date();
    }

    const updatedPrayers = [...prayerData.prayers];
    updatedPrayers[prayerIndex] = {
      ...updatedPrayers[prayerIndex],
      completed: true,
      status,
      completedAt
    };

    const totalCompleted = updatedPrayers.filter(p => p.completed).length;
    const updatedData = {
      ...prayerData,
      prayers: updatedPrayers,
      totalCompleted,
      userId: currentUser.uid
    };

    setPrayerData(updatedData);
    savePrayerData(updatedData);
  };

  // Complete prayer with custom time
  const completePrayerWithTime = () => {
    if (currentPrayerIndex === null || !currentPrayerStatus) return;
    
    // Format the time from components
    const formattedTime = `${customHour}:${customMinute.padStart(2, '0')} ${customAmPm}`;
    markPrayerCompleted(currentPrayerIndex, currentPrayerStatus, formattedTime);
    
    // Close modal and reset state
    setIsTimeInputOpen(false);
    setCurrentPrayerIndex(null);
    setCurrentPrayerStatus(null);
    setCustomPrayerTime('');
    setCustomHour('');
    setCustomMinute('');
    setCustomAmPm('AM');
  };

  // Complete prayer with current time
  const completePrayerWithCurrentTime = () => {
    if (currentPrayerIndex === null || !currentPrayerStatus) return;
    
    markPrayerCompleted(currentPrayerIndex, currentPrayerStatus);
    
    // Close modal and reset state
    setIsTimeInputOpen(false);
    setCurrentPrayerIndex(null);
    setCurrentPrayerStatus(null);
    setCustomPrayerTime('');
    setCustomHour('');
    setCustomMinute('');
    setCustomAmPm('AM');
  };

  // Open manual time setting modal
  const openManualTimeModal = (prayerIndex: number) => {
    setEditingPrayerIndex(prayerIndex);
    setIsManualTimeModalOpen(true);
  };

  // Save manual prayer time
  const saveManualTime = (prayerName: string, newTime: string) => {
    setManualTimes(prev => ({
      ...prev,
      [prayerName]: newTime
    }));
    setIsManualTimeModalOpen(false);
    setEditingPrayerIndex(null);
  };

  // Get display time (manual override or API time)
  const getDisplayTime = (prayer: PrayerTime) => {
    return manualTimes[prayer.name] || prayer.time;
  };

  // Cancel time input
  const cancelTimeInput = () => {
    setIsTimeInputOpen(false);
    setCurrentPrayerIndex(null);
    setCurrentPrayerStatus(null);
    setCustomPrayerTime('');
    setCustomHour('');
    setCustomMinute('');
    setCustomAmPm('AM');
  };

  // Mark prayer as not completed
  const markPrayerIncomplete = (prayerIndex: number) => {
    if (!prayerData || !currentUser) return;

    const updatedPrayers = [...prayerData.prayers];
    updatedPrayers[prayerIndex] = {
      ...updatedPrayers[prayerIndex],
      completed: false,
      status: null,
      completedAt: undefined
    };

    const totalCompleted = updatedPrayers.filter(p => p.completed).length;
    const updatedData = {
      ...prayerData,
      prayers: updatedPrayers,
      totalCompleted,
      userId: currentUser.uid
    };

    setPrayerData(updatedData);
    savePrayerData(updatedData);
  };

  // Load user location on component mount
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
      } catch (error) {
        console.error('Error loading user location:', error);
      }
    };
    loadLocation();
  }, []);

  // Load data when component mounts or date changes
  useEffect(() => {
    if (currentUser) {
      loadPrayerData(selectedDate);
    }
  }, [selectedDate, currentUser]);

  // Note: Removed real-time listener to prevent infinite re-renders
  // Data is loaded once when component mounts or date changes
  // Updates are handled by the savePrayerData function

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!prayerData) return 0;
    return Math.round((prayerData.totalCompleted / 5) * 100);
  };

  // Get progress color based on completion
  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-yellow-500 to-yellow-600';
    if (percentage >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  // Get status icon
  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'on-time':
        return '✅';
      case 'late':
        return '⏰';
      case 'congregation':
        return '🕌';
      default:
        return '⭕';
    }
  };

  // Get status color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'on-time':
        return 'text-green-600 bg-green-100';
      case 'late':
        return 'text-yellow-600 bg-yellow-100';
      case 'congregation':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get next prayer info
  const getNextPrayerInfo = () => {
    if (!prayerData) return null;
    
    const nextPrayer = getNextPrayerTime(prayerData.prayers);
    if (!nextPrayer) return null;
    
    const timeUntil = getTimeUntilNextPrayer(nextPrayer.time);
    const isPassed = isPrayerTimePassed(nextPrayer.time);
    
    return {
      prayer: nextPrayer,
      timeUntil,
      isPassed
    };
  };

  // Localize prayer names for display
  const getLocalizedPrayerName = (name: string) => {
    const key = name.toLowerCase();
    if (key === 'fajr') return t('prayer_fajr');
    if (key === 'dhuhr') return t('prayer_dhuhr');
    if (key === 'asr') return t('prayer_asr');
    if (key === 'maghrib') return t('prayer_maghrib');
    if (key === 'isha') return t('prayer_isha');
    return name;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading prayer times...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">{t('salah_title')}</h2>
        <p className="text-gray-600">{t('salah_subtitle')}</p>
        <div className="mt-2 text-sm text-gray-500 space-y-1">
          <div className="flex justify-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              🌍 {getUserTimezoneInfo().timezone} ({getUserTimezoneInfo().offset})
            </span>
            {userLocation && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                📍 {userLocation.latitude.toFixed(2)}, {userLocation.longitude.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">{t('salah_timezone_disclaimer')}</p>
        </div>
      </div>

      {/* Next Prayer Indicator */}
      {getNextPrayerInfo() && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-200 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('salah_next_prayer')}</h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{getNextPrayerInfo() ? getLocalizedPrayerName(getNextPrayerInfo()!.prayer.name) : ''}</p>
                <p className="text-blue-500">{getNextPrayerInfo() ? getDisplayTime(getNextPrayerInfo()!.prayer) : ''}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-700">{getNextPrayerInfo()?.isPassed ? t('salah_time_has_passed') : getNextPrayerInfo()?.timeUntil}</p>
                <p className="text-sm text-blue-600">{getNextPrayerInfo()?.isPassed ? '' : t('salah_until_prayer')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'daily'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('salah_daily_view')}
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              viewMode === 'calendar'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('salah_calendar_view')}
          </button>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <>
          {/* Date Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">{t('salah_select_date')}</h3>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black mb-4">{t('salah_daily_progress')}</h3>
              <div className="relative w-48 h-48 mx-auto mb-4">
                {/* Circular Progress */}
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${getProgressPercentage() * 2.51} 251`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">
                      {prayerData?.totalCompleted || 0}/5
                    </p>
                    <p className="text-sm text-gray-600">{t('salah_prayers')}</p>
                    <p className="text-lg font-semibold text-primary-600">
                      {getProgressPercentage()}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Progress Message */}
              <div className="text-center">
                {getProgressPercentage() === 100 ? (
                  <p className="text-green-600 font-medium">{t('salah_msg_perfect')}</p>
                ) : getProgressPercentage() >= 80 ? (
                  <p className="text-green-600 font-medium">{t('salah_msg_almost')}</p>
                ) : getProgressPercentage() >= 60 ? (
                  <p className="text-yellow-600 font-medium">{t('salah_msg_good')}</p>
                ) : getProgressPercentage() >= 40 ? (
                  <p className="text-orange-600 font-medium">{t('salah_msg_progress')}</p>
                ) : (
                  <p className="text-gray-600 font-medium">{t('salah_msg_start')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Prayer List */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-black mb-6 text-center">
              Today's Prayers - {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            <div className="space-y-4">
              {prayerData?.prayers.map((prayer, index) => (
                <div
                  key={prayer.name}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    prayer.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        prayer.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(prayer.status)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-black">{getLocalizedPrayerName(prayer.name)}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-600">{t('salah_time_label')} {getDisplayTime(prayer)}</p>
                          <button
                            onClick={() => openManualTimeModal(index)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Set manual time"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                        {manualTimes[prayer.name] && (
                          <p className="text-xs text-blue-600">Manual time set</p>
                        )}
                        {prayer.completed && prayer.completedAt && (
                          <p className="text-sm text-gray-500">
                            {t('salah_completed_at')} {convertToDate(prayer.completedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {prayer.completed ? (
                        <>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prayer.status)}`}>
                            {prayer.status === 'on-time' ? t('salah_status_on_time') :
                             prayer.status === 'late' ? t('salah_status_late') : t('salah_status_congregation')}
                          </span>
                          <button
                            onClick={() => markPrayerIncomplete(index)}
                            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            {t('salah_undo')}
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col xs:flex-row gap-2 xs:gap-2">
                          <button
                            onClick={() => openTimeInput(index, 'on-time')}
                            className="px-3 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full xs:w-auto"
                          >
                            {t('salah_btn_on_time')}
                          </button>
                          <button
                            onClick={() => openTimeInput(index, 'late')}
                            className="px-3 py-2 text-xs sm:text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors w-full xs:w-auto"
                          >
                            {t('salah_btn_late')}
                          </button>
                          <button
                            onClick={() => openTimeInput(index, 'congregation')}
                            className="px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full xs:w-auto"
                          >
                            {t('salah_btn_congregation')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <PrayerCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      )}

      {/* Time Input Modal */}
      {isTimeInputOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-black mb-2">
                {t('salah_mark_as')} {currentPrayerStatus === 'on-time' ? t('salah_status_on_time') : 
                                currentPrayerStatus === 'late' ? t('salah_status_late') : t('salah_status_congregation')}
              </h3>
              
              <p className="text-gray-600 mb-4">{t('salah_what_time')}</p>

              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3">
                  {/* Hour Input */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-700 mb-2">Hour</label>
                    <select
                      value={customHour}
                      onChange={(e) => setCustomHour(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-2xl font-bold text-gray-400 mt-6">:</div>

                  {/* Minute Input */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-700 mb-2">Minute</label>
                    <select
                      value={customMinute}
                      onChange={(e) => setCustomMinute(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AM/PM Selection */}
                  <div className="flex flex-col items-center">
                    <label className="text-sm font-medium text-gray-700 mb-2">Period</label>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => setCustomAmPm('AM')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customAmPm === 'AM'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        onClick={() => setCustomAmPm('PM')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customAmPm === 'PM'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  {customHour && customMinute && (
                    <p className="text-lg font-semibold text-blue-600">
                      Selected Time: {customHour}:{customMinute.padStart(2, '0')} {customAmPm}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={completePrayerWithTime}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!customHour || !customMinute}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('salah_use_custom_time')}</span>
                  </button>

                  <button
                    onClick={completePrayerWithCurrentTime}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('salah_use_current_time')}</span>
                  </button>
                </div>

                <button
                  onClick={cancelTimeInput}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {t('common_cancel')}
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>{t('salah_examples')}</p>
                <p>{t('salah_use_current_hint')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Time Setting Modal */}
      {isManualTimeModalOpen && editingPrayerIndex !== null && prayerData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Set Manual Time for {getLocalizedPrayerName(prayerData.prayers[editingPrayerIndex].name)}
            </h3>
            
            <ManualTimeInput
              prayerName={prayerData.prayers[editingPrayerIndex].name}
              currentTime={getDisplayTime(prayerData.prayers[editingPrayerIndex])}
              onSave={saveManualTime}
              onCancel={() => {
                setIsManualTimeModalOpen(false);
                setEditingPrayerIndex(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Salah;
