import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface PrayerCalendarData {
  date: string;
  completedPrayers: number;
  totalPrayers: number;
  percentage: number;
}

interface PrayerCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const PrayerCalendar: React.FC<PrayerCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const { currentUser } = useAuth();
  const [calendarData, setCalendarData] = useState<PrayerCalendarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar data for the current month
  const generateCalendarData = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Generate array of all days in the month
    const daysInMonth: Date[] = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(new Date(year, month, day));
    }
    
    // Fetch prayer data for each day
    const calendarDataPromises = daysInMonth.map(async (date) => {
      const dateStr = date.toISOString().split('T')[0];
      const docRef = doc(db, 'prayerTracking', `${currentUser.uid}_${dateStr}`);
      
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const completedPrayers = data.totalCompleted || 0;
          const totalPrayers = 5; // Always 5 daily prayers
          const percentage = Math.round((completedPrayers / totalPrayers) * 100);
          
          return {
            date: dateStr,
            completedPrayers,
            totalPrayers,
            percentage
          };
        } else {
          return {
            date: dateStr,
            completedPrayers: 0,
            totalPrayers: 5,
            percentage: 0
          };
        }
      } catch (error) {
        console.error(`Error loading data for ${dateStr}:`, error);
        return {
          date: dateStr,
          completedPrayers: 0,
          totalPrayers: 5,
          percentage: 0
        };
      }
    });
    
    try {
      const results = await Promise.all(calendarDataPromises);
      setCalendarData(results);
    } catch (error) {
      console.error('Error generating calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load calendar data when month changes
  useEffect(() => {
    generateCalendarData();
  }, [currentMonth, currentUser]);

  // Get heatmap color based on completion percentage
  const getHeatmapColor = (percentage: number) => {
    if (percentage === 0) return 'bg-gray-100';
    if (percentage < 20) return 'bg-red-200';
    if (percentage < 40) return 'bg-orange-200';
    if (percentage < 60) return 'bg-yellow-200';
    if (percentage < 80) return 'bg-green-200';
    if (percentage < 100) return 'bg-green-300';
    return 'bg-green-400';
  };

  // Get text color based on background
  const getTextColor = (percentage: number) => {
    if (percentage === 0) return 'text-gray-500';
    if (percentage < 40) return 'text-gray-700';
    return 'text-white';
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get day of week for first day of month
  const getFirstDayOfWeek = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  // Generate empty cells for days before the first day of the month
  const generateEmptyCells = () => {
    const firstDay = getFirstDayOfWeek(currentMonth);
    return Array.from({ length: firstDay }, (_, index) => (
      <div key={`empty-${index}`} className="h-8 w-8"></div>
    ));
  };

  // Calculate monthly statistics
  const getMonthlyStats = () => {
    if (calendarData.length === 0) return { totalDays: 0, completedDays: 0, averageCompletion: 0 };
    
    const totalDays = calendarData.length;
    const completedDays = calendarData.filter(day => day.completedPrayers > 0).length;
    const totalPrayers = calendarData.reduce((sum, day) => sum + day.completedPrayers, 0);
    const possiblePrayers = totalDays * 5;
    const averageCompletion = possiblePrayers > 0 ? Math.round((totalPrayers / possiblePrayers) * 100) : 0;
    
    return { totalDays, completedDays, averageCompletion };
  };

  const monthlyStats = getMonthlyStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading calendar data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold text-black">{getMonthName(currentMonth)}</h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{monthlyStats.completedDays}</p>
          <p className="text-sm text-blue-600">Days with Prayers</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{monthlyStats.averageCompletion}%</p>
          <p className="text-sm text-green-600">Average Completion</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{monthlyStats.totalDays}</p>
          <p className="text-sm text-purple-600">Total Days</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {generateEmptyCells()}
          {calendarData.map((dayData) => {
            const date = new Date(dayData.date);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={dayData.date}
                onClick={() => onDateSelect(date)}
                className={`h-8 w-8 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-110 ${
                  getHeatmapColor(dayData.percentage)
                } ${getTextColor(dayData.percentage)} ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } ${
                  isToday ? 'ring-2 ring-green-500' : ''
                }`}
                title={`${dayData.date}: ${dayData.completedPrayers}/5 prayers (${dayData.percentage}%)`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 text-sm">
        <span className="text-gray-600">Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <div className="w-3 h-3 bg-orange-200 rounded"></div>
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <div className="w-3 h-3 bg-green-300 rounded"></div>
          <div className="w-3 h-3 bg-green-400 rounded"></div>
        </div>
        <span className="text-gray-600">More</span>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          {(() => {
            const selectedDayData = calendarData.find(day => 
              new Date(day.date).toDateString() === selectedDate.toDateString()
            );
            
            if (selectedDayData) {
              return (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${getHeatmapColor(selectedDayData.percentage)}`}></div>
                    <span className="text-sm text-gray-600">
                      {selectedDayData.completedPrayers}/5 prayers completed
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedDayData.percentage}% completion
                  </span>
                </div>
              );
            } else {
              return (
                <p className="text-sm text-gray-600">No prayer data for this date</p>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default PrayerCalendar;
