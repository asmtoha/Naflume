import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';
import SpiritualGuidanceModal from './SpiritualGuidanceModal';

const Header: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = getTranslations(language);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spiritualModalOpen, setSpiritualModalOpen] = useState(false);
  const handleGetStarted = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center shadow-sm rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-black">Naflume</span>
              <span className="text-xs text-gray-500 -mt-1">Tazkiyah an-Nafs</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-blue-600 hover:text-black transition-colors duration-300 font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('features')}
            </a>
            <a 
              href="#how-it-works" 
              className="text-black hover:text-blue-600 transition-colors duration-300 font-medium"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('howItWorks')}
            </a>
            <Link to="/vision" className="text-black hover:text-blue-600 transition-colors duration-300 font-medium">{t('vision')}</Link>
            <Link to="/contact" className="text-blue-600 hover:text-black transition-colors duration-300 font-medium">{t('contact')}</Link>
            
            {/* Spiritual Guidance Button */}
            <button
              onClick={() => setSpiritualModalOpen(true)}
              className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors duration-300"
              title="Spiritual Guidance"
              aria-label="Open spiritual guidance"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
              </svg>
            </button>
            
            <a
              href="/store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white"
              style={{ backgroundColor: '#ff6347' }}
              title="Store"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4l2-4h12l2 4z" />
                <path d="M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
                <path d="M16 11a4 4 0 0 1-8 0" />
              </svg>
              <span>Store</span>
            </a>
            {/* Language chooser */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">{t('languageLabel')}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select language"
              >
                <option value="en">{t('language_en')}</option>
                <option value="bn">{t('language_bn')}</option>
              </select>
            </div>
            <button 
              className="btn-primary text-sm px-4 py-2"
              onClick={handleGetStarted}
            >
              {t('getStarted')}
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-black hover:bg-blue-50 transition-colors duration-300"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white">
          <div className="container-custom py-4 space-y-3">
            <a 
              href="#features" 
              className="block text-blue-600 font-medium" 
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('features')}
            </a>
            <a 
              href="#how-it-works" 
              className="block text-black font-medium" 
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('howItWorks')}
            </a>
            <Link to="/vision" className="block text-black font-medium" onClick={() => setMobileOpen(false)}>{t('vision')}</Link>
            <Link to="/contact" className="block text-black font-medium" onClick={() => setMobileOpen(false)}>{t('contact')}</Link>
            
            {/* Mobile Spiritual Guidance Button */}
            <button
              onClick={() => {
                setSpiritualModalOpen(true);
                setMobileOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-3 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-300"
              title="Spiritual Guidance"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
              </svg>
              <span className="font-medium">Spiritual Guidance</span>
            </button>
            
            <a
              href="/store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 font-bold text-white rounded-lg"
              style={{ backgroundColor: '#ff6347' }}
              onClick={() => setMobileOpen(false)}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4l2-4h12l2 4z" />
                <path d="M4 7v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
                <path d="M16 11a4 4 0 0 1-8 0" />
              </svg>
              <span>Store</span>
            </a>
            <div className="h-px bg-blue-100" />
            {/* Mobile language chooser */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('languageLabel')}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                className="px-2 py-2 text-sm border border-gray-300 rounded-md bg-white w-40"
                aria-label="Select language"
              >
                <option value="en">{t('language_en')}</option>
                <option value="bn">{t('language_bn')}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-primary text-sm px-4 py-2 flex-1" onClick={handleGetStarted}>
                {t('getStarted')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Spiritual Guidance Modal */}
      <SpiritualGuidanceModal 
        isOpen={spiritualModalOpen} 
        onClose={() => setSpiritualModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
