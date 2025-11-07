// Enhanced version management utility for cache-busting
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';
export const BUILD_TIMESTAMP = new Date().toISOString();
export const BUILD_HASH = process.env.REACT_APP_BUILD_HASH || Date.now().toString();

// Version info object
export const versionInfo = {
  version: APP_VERSION,
  buildTimestamp: BUILD_TIMESTAMP,
  buildHash: BUILD_HASH,
  userAgent: navigator.userAgent,
  timestamp: Date.now()
};

// Get current version with hash for more precise tracking
const getCurrentVersionHash = (): string => {
  return `${APP_VERSION}-${BUILD_HASH}`;
};

// Check if app version has changed (more precise with hash)
export const hasVersionChanged = (): boolean => {
  const storedVersionHash = localStorage.getItem('naflume_version_hash');
  const currentVersionHash = getCurrentVersionHash();
  
  if (!storedVersionHash) {
    // First time user - set current version and don't show update
    localStorage.setItem('naflume_version_hash', currentVersionHash);
    return false;
  }
  
  // Only show update if version hash is actually different
  const hasChanged = storedVersionHash !== currentVersionHash;
  
  if (hasChanged) {
    console.log('Version changed detected:', {
      stored: storedVersionHash,
      current: currentVersionHash
    });
  }
  
  return hasChanged;
};

// Update stored version (call this only when user accepts update)
export const updateStoredVersion = (): void => {
  const currentVersionHash = getCurrentVersionHash();
  localStorage.setItem('naflume_version_hash', currentVersionHash);
  localStorage.setItem('naflume_version', APP_VERSION);
  // Clear dismissed version when updating to allow future notifications
  localStorage.removeItem('naflume_dismissed_version');
  localStorage.removeItem('naflume_dismissed_version_hash');
  // Clear update check timestamp to allow immediate future checks
  localStorage.removeItem('naflume_last_update_check');
};

// Check if user has dismissed update notification for current version
export const hasUserDismissedUpdate = (): boolean => {
  const dismissedVersionHash = localStorage.getItem('naflume_dismissed_version_hash');
  const currentVersionHash = getCurrentVersionHash();
  const isDismissed = dismissedVersionHash === currentVersionHash;
  
  if (isDismissed) {
    console.log('Update notification already dismissed for version:', currentVersionHash);
  }
  
  return isDismissed;
};

// Check if user has already updated to current version
export const hasUserUpdatedToCurrentVersion = (): boolean => {
  const storedVersionHash = localStorage.getItem('naflume_version_hash');
  const currentVersionHash = getCurrentVersionHash();
  return storedVersionHash === currentVersionHash;
};

// Mark update as dismissed for current version
export const markUpdateAsDismissed = (): void => {
  const currentVersionHash = getCurrentVersionHash();
  localStorage.setItem('naflume_dismissed_version_hash', currentVersionHash);
  localStorage.setItem('naflume_dismissed_version', APP_VERSION);
  console.log('Update notification dismissed for version:', currentVersionHash);
};

// Reset version tracking (useful for testing or manual reset)
export const resetVersionTracking = (): void => {
  localStorage.removeItem('naflume_version_hash');
  localStorage.removeItem('naflume_version');
  localStorage.removeItem('naflume_dismissed_version_hash');
  localStorage.removeItem('naflume_dismissed_version');
  localStorage.removeItem('naflume_last_update_check');
  console.log('Version tracking reset');
};

// Get version info for debugging
export const getVersionInfo = () => {
  return {
    ...versionInfo,
    storedVersion: localStorage.getItem('naflume_version'),
    hasChanged: hasVersionChanged()
  };
};

// Enhanced force cache refresh with better mobile support
export const forceRefresh = async () => {
  try {
    // Clear all caches more aggressively
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }
    
    // Clear service worker registration
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
    
    // Clear localStorage version data
    localStorage.removeItem('naflume_version');
    localStorage.removeItem('naflume_version_hash');
    localStorage.removeItem('naflume_dismissed_version');
    localStorage.removeItem('naflume_dismissed_version_hash');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Force reload with cache bypass
    window.location.reload();
  } catch (error) {
    console.error('Error during cache refresh:', error);
    // Fallback: simple reload
    window.location.reload();
  }
};

// Banner-specific utility functions
export const getLastBannerShown = (): number | null => {
  const lastShown = localStorage.getItem('naflume_last_banner_shown');
  return lastShown ? parseInt(lastShown) : null;
};

export const getLastUpdateClicked = (): number | null => {
  const lastClicked = localStorage.getItem('naflume_last_update_clicked');
  return lastClicked ? parseInt(lastClicked) : null;
};

export const getLastUpdateVersion = (): string | null => {
  return localStorage.getItem('naflume_last_update_version');
};

export const setLastBannerShown = (timestamp: number): void => {
  localStorage.setItem('naflume_last_banner_shown', timestamp.toString());
};

export const setLastUpdateClicked = (timestamp: number, versionHash: string): void => {
  localStorage.setItem('naflume_last_update_clicked', timestamp.toString());
  localStorage.setItem('naflume_last_update_version', versionHash);
};

export const clearBannerHistory = (): void => {
  localStorage.removeItem('naflume_last_banner_shown');
  localStorage.removeItem('naflume_last_update_clicked');
  localStorage.removeItem('naflume_last_update_version');
};

