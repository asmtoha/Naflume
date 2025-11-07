import React, { useEffect, useState } from 'react';
import { 
  hasVersionChanged, 
  hasUserDismissedUpdate, 
  hasUserUpdatedToCurrentVersion, 
  markUpdateAsDismissed, 
  updateStoredVersion, 
  forceRefresh,
  getLastBannerShown,
  getLastUpdateClicked,
  getLastUpdateVersion,
  setLastBannerShown,
  setLastUpdateClicked
} from '../utils/version';

interface UpdateBannerProps {
  onUpdate?: () => void;
}

const UpdateBanner: React.FC<UpdateBannerProps> = ({ onUpdate }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if banner should be shown based on 12-hour interval
  const shouldShowBanner = (): boolean => {
    const versionChanged = hasVersionChanged();
    const userDismissed = hasUserDismissedUpdate();
    const userUpdated = hasUserUpdatedToCurrentVersion();

    // Don't show if no update available, user dismissed, or already updated
    if (!versionChanged || userDismissed || userUpdated) {
      return false;
    }

    const now = Date.now();
    const lastBannerShown = getLastBannerShown();
    const lastUpdateClicked = getLastUpdateClicked();
    const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    // If user clicked update, don't show until new update
    if (lastUpdateClicked) {
      const currentVersionHash = `${process.env.REACT_APP_VERSION || '1.0.0'}-${process.env.REACT_APP_BUILD_HASH || Date.now().toString()}`;
      const lastUpdateVersion = getLastUpdateVersion();
      
      // Only show if there's a new version since last update
      if (lastUpdateVersion === currentVersionHash) {
        return false;
      }
    }

    // Show banner if:
    // 1. Never shown before, OR
    // 2. Last shown more than 12 hours ago
    if (!lastBannerShown || (now - lastBannerShown) >= twelveHours) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    // Check if banner should be shown on mount
    if (shouldShowBanner()) {
      setShowBanner(true);
      // Record that we're showing the banner now
      setLastBannerShown(Date.now());
    }

    // Set up interval to check every hour if banner should be shown
    const interval = setInterval(() => {
      if (shouldShowBanner()) {
        setShowBanner(true);
        setLastBannerShown(Date.now());
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  const handleUpdateNow = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    setShowBanner(false);
    
    try {
      // Record that user clicked update
      const currentVersionHash = `${process.env.REACT_APP_VERSION || '1.0.0'}-${process.env.REACT_APP_BUILD_HASH || Date.now().toString()}`;
      setLastUpdateClicked(Date.now(), currentVersionHash);
      
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
      
      // Call parent update handler if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error during update:', error);
      // Fallback: simple reload
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    // Mark this version as dismissed
    markUpdateAsDismissed();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">Update Available</h3>
          <p className="text-sm text-gray-500 mt-1">
            A new version of Naflume is available. Update now for the latest features.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleUpdateNow}
              disabled={isUpdating}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Now'}
            </button>
            <button
              onClick={handleDismiss}
              disabled={isUpdating}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;
