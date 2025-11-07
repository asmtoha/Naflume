import React, { useEffect, useState } from 'react';
import { versionInfo, hasVersionChanged, hasUserDismissedUpdate, hasUserUpdatedToCurrentVersion, markUpdateAsDismissed, updateStoredVersion, forceRefresh } from '../utils/version';
import UpdateBanner from './UpdateBanner';

interface CacheManagerProps {
  children: React.ReactNode;
}

const CacheManager: React.FC<CacheManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = async () => {
    if (isUpdating) return; // Prevent multiple update attempts
    
    setIsUpdating(true);
    
    try {
      // Update stored version before refreshing
      updateStoredVersion();
      
      // Clear all caches and reload
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.unregister();
        }
      }
      
      await forceRefresh();
    } catch (error) {
      console.error('Error during update:', error);
      // Fallback: simple reload
      window.location.reload();
    }
  };

  return (
    <>
      {children}
      
      {/* Update Banner with 12-hour interval */}
      <UpdateBanner onUpdate={handleUpdate} />

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-800">You're offline</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CacheManager;

