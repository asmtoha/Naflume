import React, { useEffect, useState } from 'react';

// Minimal typing for the deferred install prompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Keeping helper removed since we always show across devices

const AddToHomeBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Use native PWA install prompt if available
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        setVisible(false);
        setDeferredPrompt(null);
      } catch (e) {
        setVisible(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback: Show instructions for manual installation
      setShowHelp(true);
    }
  };

  const handleIOSInstall = () => {
    // For iOS, try to trigger the share functionality if available
    if (navigator.share) {
      navigator.share({
        title: 'Naflume - Track Your Daily Good Deeds',
        text: 'Add Naflume to your home screen for easy access',
        url: window.location.href
      }).then(() => {
        // If share was successful, show instructions for adding to home screen
        setShowHelp(true);
      }).catch(() => {
        // If share failed, show instructions
        setShowHelp(true);
      });
    } else {
      // Fallback: Show instructions for manual installation
      setShowHelp(true);
    }
  };

  if (!visible) return null;

  return (
    <div className="mx-auto mb-6 max-w-2xl px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white/70 p-3 sm:p-4 shadow-lg backdrop-blur-sm">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 opacity-50"></div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
            {/* Mobile phone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
              <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H7zm0 2h10v12H7V5zm5 14a1 1 0 110 2 1 1 0 010-2z" />
            </svg>
            </div>
            <div className="flex-1">
              <p className="bangla-text text-sm sm:text-base font-semibold text-blue-800">
                মোবাইলে সেরা অভিজ্ঞতার জন্য, হোম স্ক্রিনে যোগ করুন
              </p>
              <p className="text-xs sm:text-sm text-blue-700">For the best experience, add this app to your Home Screen</p>
            </div>
            <div className="space-y-2 w-full sm:w-auto">
              {/* Platform Selection Label */}
              <div className="text-center">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 rounded-full">
                  Choose your platform
                </span>
              </div>
              
              {/* Platform Buttons */}
              <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
                {/* Android Button */}
                <button
                  className="inline-flex items-center gap-1 sm:gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white shadow hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={handleInstallClick}
                >
                  <span className="text-sm sm:text-lg">🤖</span>
                  <span className="hidden xs:inline">Android</span>
                </button>
                
                {/* iOS Button */}
                <button
                  className="inline-flex items-center gap-1 sm:gap-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white shadow hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={handleIOSInstall}
                >
                  <span className="text-sm sm:text-lg">🍎</span>
                  <span className="hidden xs:inline">iOS</span>
                </button>
              </div>
            </div>
            <button
              aria-label="Dismiss"
              className="ml-2 rounded-md p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-700"
              onClick={() => setVisible(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {showHelp && (
            <div className="mt-2 text-xs text-blue-700">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <strong>Android:</strong> If the install prompt didn't appear, use Chrome menu → "Add to Home screen" or "Install app"
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-lg">🍎</span>
                  <div>
                    <strong>iOS:</strong> Tap the Share button in Safari → "Add to Home Screen" → "Add"
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToHomeBanner;


