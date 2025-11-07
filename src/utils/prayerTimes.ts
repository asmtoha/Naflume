export interface PrayerTime {
  name: string;
  time: string;
  completed: boolean;
  status: 'on-time' | 'late' | 'congregation' | null;
  completedAt?: Date;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
      timestamp: string;
    };
  };
}

// Default coordinates for Dhaka, Bangladesh (can be made configurable)
const DEFAULT_LATITUDE = 23.8103;
const DEFAULT_LONGITUDE = 90.4125;

// Get user's location
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser, using default location');
      resolve({ latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Error getting location:', error.message, 'Using default location');
        resolve({ latitude: DEFAULT_LATITUDE, longitude: DEFAULT_LONGITUDE });
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Get user's timezone information
export const getUserTimezoneInfo = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const offsetHours = Math.abs(timezoneOffset) / 60;
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const offsetSign = timezoneOffset <= 0 ? '+' : '-';
  const offsetString = `GMT${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
  
  return {
    timezone,
    offset: offsetString,
    currentTime: now.toLocaleTimeString('en-US', { 
      hour12: true, 
      timeZone: timezone 
    })
  };
};

// Fetch prayer times from Aladhan API
export const fetchPrayerTimes = async (date: Date, latitude?: number, longitude?: number): Promise<PrayerTime[]> => {
  try {
    // Get user location if not provided
    let lat = latitude;
    let lng = longitude;
    
    if (!lat || !lng) {
      const location = await getUserLocation();
      lat = location.latitude;
      lng = location.longitude;
    }

    // Format date for API (use local date, not UTC)
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateStr = localDate.toISOString().split('T')[0];
    
    // Aladhan API endpoint with timezone support
    const apiUrl = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2&school=1&timezonestring=${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PrayerTimesResponse = await response.json();
    
    if (data.code !== 200) {
      throw new Error(`API error: ${data.status}`);
    }
    
    const timings = data.data.timings;
    
    // Convert API response to our PrayerTime format with proper timezone handling
    const prayerTimes: PrayerTime[] = [
      {
        name: 'Fajr',
        time: formatTimeWithTimezone(timings.Fajr),
        completed: false,
        status: null
      },
      {
        name: 'Dhuhr',
        time: formatTimeWithTimezone(timings.Dhuhr),
        completed: false,
        status: null
      },
      {
        name: 'Asr',
        time: formatTimeWithTimezone(timings.Asr),
        completed: false,
        status: null
      },
      {
        name: 'Maghrib',
        time: formatTimeWithTimezone(timings.Maghrib),
        completed: false,
        status: null
      },
      {
        name: 'Isha',
        time: formatTimeWithTimezone(timings.Isha),
        completed: false,
        status: null
      }
    ];
    
    return prayerTimes;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    
    // Fallback to mock data if API fails
    console.warn('Using fallback prayer times');
    return getFallbackPrayerTimes(date);
  }
};

// Format time from API with proper timezone handling
const formatTimeWithTimezone = (timeStr: string): string => {
  try {
    // API returns time in format like "05:30 (GMT+06:00)" or "05:30"
    const time = timeStr.split(' ')[0]; // Remove timezone info
    const [hours, minutes] = time.split(':');
    
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    // Convert to 12-hour format
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr; // Return original if formatting fails
  }
};

// Legacy format function for backward compatibility
const formatTime = (timeStr: string): string => {
  return formatTimeWithTimezone(timeStr);
};

// Fallback prayer times (mock data)
const getFallbackPrayerTimes = (date: Date): PrayerTime[] => {
  // Simple mock data - in a real app, you might want to store user's preferred times
  const baseTimes = [
    { name: 'Fajr', time: '5:30 AM' },
    { name: 'Dhuhr', time: '12:15 PM' },
    { name: 'Asr', time: '3:45 PM' },
    { name: 'Maghrib', time: '6:20 PM' },
    { name: 'Isha', time: '7:45 PM' }
  ];

  return baseTimes.map(prayer => ({
    ...prayer,
    completed: false,
    status: null
  }));
};

// Check if a prayer time has passed (using local timezone)
export const isPrayerTimePassed = (prayerTime: string, currentTime: Date = new Date()): boolean => {
  try {
    // Parse prayer time (assuming format like "5:30 AM")
    const [time, period] = prayerTime.split(' ');
    const [hours, minutes] = time.split(':');
    
    let prayerHour = parseInt(hours, 10);
    const prayerMinute = parseInt(minutes, 10);
    
    // Convert to 24-hour format
    if (period === 'PM' && prayerHour !== 12) {
      prayerHour += 12;
    } else if (period === 'AM' && prayerHour === 12) {
      prayerHour = 0;
    }
    
    // Create prayer time date for today in local timezone
    const prayerDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), prayerHour, prayerMinute, 0, 0);
    
    return currentTime > prayerDate;
  } catch (error) {
    console.error('Error checking if prayer time passed:', error);
    return false;
  }
};

// Get next prayer time
export const getNextPrayerTime = (prayerTimes: PrayerTime[], currentTime: Date = new Date()): PrayerTime | null => {
  const upcomingPrayers = prayerTimes.filter(prayer => !isPrayerTimePassed(prayer.time, currentTime));
  
  if (upcomingPrayers.length === 0) {
    // All prayers for today have passed, return first prayer of next day
    return prayerTimes[0];
  }
  
  return upcomingPrayers[0];
};

// Calculate time until next prayer (using local timezone)
export const getTimeUntilNextPrayer = (prayerTime: string, currentTime: Date = new Date()): string => {
  try {
    // Parse prayer time
    const [time, period] = prayerTime.split(' ');
    const [hours, minutes] = time.split(':');
    
    let prayerHour = parseInt(hours, 10);
    const prayerMinute = parseInt(minutes, 10);
    
    // Convert to 24-hour format
    if (period === 'PM' && prayerHour !== 12) {
      prayerHour += 12;
    } else if (period === 'AM' && prayerHour === 12) {
      prayerHour = 0;
    }
    
    // Create prayer time date for today in local timezone
    const prayerDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), prayerHour, prayerMinute, 0, 0);
    
    // If prayer time has passed today, assume it's for tomorrow
    if (prayerDate <= currentTime) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const diffMs = prayerDate.getTime() - currentTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  } catch (error) {
    console.error('Error calculating time until next prayer:', error);
    return 'Unknown';
  }
};
