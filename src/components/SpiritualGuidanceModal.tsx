import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SpiritualGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpiritualGuidanceModal: React.FC<SpiritualGuidanceModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const content = {
    arabic: "ألا وإن في الجسد مضغة إذا صلحت صلح الجسد كله وإذا فسدت فسد الجسد كله ألا وهي القلب.",
    bengali: "জেনে রেখো, শরীরের ভেতরে একটি মাংসপিণ্ড আছে, যা পরিশুদ্ধ হলে পুরো শরীরই পরিশুদ্ধ হয়ে যায়। আর তা দূষিত হলে পুরো শরীরই দূষিত হয়ে যায়। জেনে রেখো, আর তা হলো অন্তর (ক্বলব)।",
    english: "Indeed, in the body there is a lump of flesh which, if it is sound, the whole body is sound, and if it is corrupt, the whole body is corrupt. Truly, it is the heart.",
    source: "Source: Sahih al-Bukhari"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Spiritual Guidance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Arabic Text */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <p className="text-2xl md:text-3xl font-bold text-green-800 leading-relaxed" dir="rtl">
                {content.arabic}
              </p>
            </div>
          </div>

          {/* Bengali Text */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <p className="text-lg md:text-xl bangla-text text-blue-800 leading-relaxed">
                {content.bengali}
              </p>
            </div>
          </div>

          {/* English Text */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <p className="text-lg md:text-xl font-medium text-purple-800 leading-relaxed">
                {content.english}
              </p>
            </div>
          </div>

          {/* Source */}
          <div className="text-center">
            <p className="text-sm text-gray-600 italic">
              {content.source}
            </p>
          </div>

          {/* Reflection Prompt */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              {language === 'bn' ? 'চিন্তা করুন' : 'Reflect'}
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              {language === 'bn' 
                ? 'আমাদের অন্তরের অবস্থা আমাদের সমগ্র জীবনের গুণমান নির্ধারণ করে। আমাদের হৃদয় পরিশুদ্ধ রাখার জন্য প্রতিদিন কী করতে পারি?'
                : 'The condition of our heart determines the quality of our entire life. What can we do daily to keep our heart pure?'
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {language === 'bn' ? 'বুঝেছি' : 'I Understand'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiritualGuidanceModal;
