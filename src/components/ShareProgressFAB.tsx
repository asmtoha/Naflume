import React from 'react';

interface ShareProgressFABProps {
  onClick: () => void;
}

const ShareProgressFAB: React.FC<ShareProgressFABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center group"
      title="Share Your Progress"
    >
      <div className="text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-200">
        📤
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300"></div>
    </button>
  );
};

export default ShareProgressFAB;
