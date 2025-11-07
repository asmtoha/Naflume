import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelectionModal from './LanguageSelectionModal';
import AddToHomeBanner from './AddToHomeBanner';

const Hero: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const { language } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleGetStarted = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleLanguageSelect = async (language: 'English' | 'Bangla') => {};

  return (
    <section className="section-padding relative bg-white">
      <div className="container-custom">
        <div className="text-center">
          {/* Add to Home Screen Banner - shown on all devices */}
          <AddToHomeBanner />
          {/* Main Headline */}
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-gradient ${language === 'bn' ? 'bangla-heading' : ''}`}>
            {language === 'bn' ? (
              <>
                প্রকৃত ভ্রমণটা <span className="text-black">ভেতরেই</span> শুরু হয়
              </>
            ) : (
              <>The real journey begins <span className="text-black">within</span></>
            )}
          </h1>
          
          {/* Bengali Slogan with enhanced typography */}
          <div className="mb-8">
            <p className="bangla-text text-xl md:text-2xl text-blue-600 max-w-3xl mx-auto">
              {'আমরা নিজের খারাপ কাজগুলো বেশি মনে রাখি, ভালো কাজ কতগুলো মনে আছে!'}
            </p>
          </div>
          
          {/* Sub Headline */}
          <p className="text-lg md:text-xl mb-10 text-blue-600 leading-relaxed max-w-2xl mx-auto">
            {language === 'bn'
              ? 'সহজ ও অর্থবহ দৈনিক ট্র্যাকিংয়ের মাধ্যমে শুরু করুন আপনার উন্নতির যাত্রা'
              : 'Start your self-improvement journey with our simple and meaningful daily tracking app'}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              className="btn-primary"
              onClick={handleGetStarted}
            >
              {language === 'bn' ? 'ফ্রি তে শুরু করুন' : 'Get Started Free'}
            </button>
            {/* Free Badge */}
            <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2 text-white shadow-sm">
              {language === 'bn' ? (
                <>
                  <span className="bangla-text text-sm font-semibold">সম্পূর্ণ বিনামূল্যে</span>
                </>
              ) : (
                <span className="text-xs tracking-wide">Totally Free</span>
              )}
            </div>
            <button 
              className="btn-secondary"
              onClick={() => {
                // Scroll to features section
                document.getElementById('features')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              {language === 'bn' ? 'আরও জানুন' : 'Learn More'}
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="card text-center">
              <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black mb-1">100% Secure</h3>
              <p className="text-xs text-blue-500">Your data is completely safe</p>
            </div>
            
                        <div className="card text-center">
              <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black mb-1">Totally Free</h3>
              <p className="text-xs text-blue-500">Start using instantly</p>
            </div>
            
                        <div className="card text-center">
              <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M5 19L19 5" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black mb-1">No Ads</h3>
              <p className="text-xs text-blue-500">Ad-free experience</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Removed Language Selection Modal trigger; keeping component import unused removal handled by TS */}
    </section>
  );
};

export default Hero;
