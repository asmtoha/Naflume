import React from 'react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: 'English' | 'Bangla') => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onLanguageSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">
            Choose Your Language
          </h2>
          <p className="text-gray-600 mb-6">
            Select your preferred language for the best experience
          </p>
          
          <div className="space-y-4">
                         <button
               onClick={() => onLanguageSelect('English')}
               className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 text-left"
             >
               <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                   <span className="text-white font-bold text-sm">EN</span>
                 </div>
                <div>
                  <div className="font-semibold text-black">English</div>
                  <div className="text-sm text-gray-500">Continue in English</div>
                </div>
              </div>
            </button>
            
                         <button
               onClick={() => onLanguageSelect('Bangla')}
               className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 text-left"
             >
               <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                   <span className="text-white font-bold text-sm">বাং</span>
                 </div>
                 <div>
                   <div className="font-semibold text-black">বাংলা</div>
                   <div className="text-sm text-gray-500">বাংলায় চালিয়ে যান</div>
                 </div>
               </div>
             </button>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
