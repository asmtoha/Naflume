import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';

const Donation: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const donationSectionRef = useRef<HTMLDivElement>(null);
  
  const { language, setLanguage } = useLanguage();
  const tGlobal = getTranslations(language);

  // Translation content
  const translations = {
    en: {
      home: "Home",
      vision: "Vision",
      donate: "Donate",
      language: "Language:",
      supportNaflume: "Support Naflume",
      supportSubtitle: "Help us keep Naflume running and growing for the spiritual development community",
      whySupportMatters: "Why Your Support Matters",
      whySupportSubtitle: "Naflume is completely free to use, but maintaining and improving it requires resources",
      serverHosting: "Server Hosting",
      serverHostingDesc: "Keep the app running 24/7 with reliable cloud hosting and database services for all users worldwide.",
      appMaintenance: "App Maintenance",
      appMaintenanceDesc: "Regular updates, bug fixes, security patches, and performance improvements to keep Naflume running smoothly.",
      newFeatures: "New Features",
      newFeaturesDesc: "Develop new tools, integrations, and improvements based on user feedback and spiritual development needs.",
      howToDonate: "How to Donate",
      bkashMobilePayment: "Bkash Mobile Payment",
      personalBkashNumber: "Personal Bkash Number",
      phoneNumber: "Phone Number:",
      referenceNote: "Reference/Note:",
      scanQRCode: "Scan QR Code:",
      scanWithBkash: "Scan with Bkash app to send money",
      referenceInstruction: "Please use \"naflume\" as the reference/note when sending money so we can identify your donation.",
      importantNotice: "Important Notice",
      donationVoluntary: "Donation is Completely Voluntary",
      completelyOptional: "Completely Optional:",
      completelyOptionalDesc: "Naflume will always remain free to use. Donations are purely voluntary and not mandatory in any way.",
      alternativeSupport: "Alternative Support:",
      alternativeSupportDesc: "If you cannot donate financially, you can support us by praying for the developer to Allah (SWT) for guidance and success.",
      yourChoice: "Your Choice:",
      yourChoiceDesc: "Whether you donate or not, you are equally valued as a member of the Naflume community.",
      gratitude: "Gratitude:",
      gratitudeDesc: "Every donation, no matter the amount, is deeply appreciated and helps us continue serving the spiritual development community.",
      thankYouSupport: "Thank You for Your Support",
      thankYouSubtitle: "Your support helps us keep Naflume free and accessible to everyone on their spiritual journey.",
      backToNaflume: "Back to Naflume",
      learnAboutVision: "Learn About Our Vision",
      footerTagline: "Track your spiritual journey, celebrate your growth",
      copyright: "© 2025 Naflume. Made with ❤️ for spiritual growth.",
      copied: "Copied!",
      copy: "Copy"
    },
    bn: {
      home: "হোম",
      vision: "ভিশন",
      donate: "দান",
      language: "ভাষা:",
      supportNaflume: "নাফলুমকে সমর্থন করুন",
      supportSubtitle: "আধ্যাত্মিক উন্নয়ন সম্প্রদায়ের জন্য নাফলুমকে চালু রাখতে এবং বৃদ্ধি করতে আমাদের সাহায্য করুন",
      whySupportMatters: "কেন আপনার সমর্থন গুরুত্বপূর্ণ",
      whySupportSubtitle: "নাফলুম সম্পূর্ণ বিনামূল্যে ব্যবহারযোগ্য, তবে এটি বজায় রাখতে এবং উন্নত করতে সম্পদের প্রয়োজন",
      serverHosting: "সার্ভার হোস্টিং",
      serverHostingDesc: "সারা বিশ্বের সকল ব্যবহারকারীর জন্য নির্ভরযোগ্য ক্লাউড হোস্টিং এবং ডেটাবেস পরিষেবা দিয়ে অ্যাপটি ২৪/৭ চালু রাখুন।",
      appMaintenance: "অ্যাপ রক্ষণাবেক্ষণ",
      appMaintenanceDesc: "নাফলুমকে সুচারুভাবে চালানোর জন্য নিয়মিত আপডেট, বাগ ফিক্স, নিরাপত্তা প্যাচ এবং পারফরম্যান্স উন্নতি।",
      newFeatures: "নতুন বৈশিষ্ট্য",
      newFeaturesDesc: "ব্যবহারকারীর প্রতিক্রিয়া এবং আধ্যাত্মিক উন্নয়নের প্রয়োজনের ভিত্তিতে নতুন সরঞ্জাম, ইন্টিগ্রেশন এবং উন্নতি তৈরি করুন।",
      howToDonate: "কিভাবে দান করবেন",
      bkashMobilePayment: "বিকাশ মোবাইল পেমেন্ট",
      personalBkashNumber: "ব্যক্তিগত বিকাশ নম্বর",
      phoneNumber: "ফোন নম্বর:",
      referenceNote: "রেফারেন্স/নোট:",
      scanQRCode: "QR কোড স্ক্যান করুন:",
      scanWithBkash: "টাকা পাঠাতে বিকাশ অ্যাপ দিয়ে স্ক্যান করুন",
      referenceInstruction: "অনুগ্রহ করে টাকা পাঠানোর সময় রেফারেন্স/নোট হিসেবে \"নাফলুম\" ব্যবহার করুন যাতে আমরা আপনার দান চিহ্নিত করতে পারি।",
      importantNotice: "গুরুত্বপূর্ণ বিজ্ঞপ্তি",
      donationVoluntary: "দান সম্পূর্ণ স্বেচ্ছাসেবী",
      completelyOptional: "সম্পূর্ণ ঐচ্ছিক:",
      completelyOptionalDesc: "নাফলুম সবসময় বিনামূল্যে ব্যবহারযোগ্য থাকবে। দান সম্পূর্ণ স্বেচ্ছাসেবী এবং কোনোভাবেই বাধ্যতামূলক নয়।",
      alternativeSupport: "বিকল্প সমর্থন:",
      alternativeSupportDesc: "আপনি যদি আর্থিকভাবে দান করতে না পারেন, তাহলে আপনি বিকাশকারীর জন্য আল্লাহর কাছে দোয়া করে আমাদের সমর্থন করতে পারেন।",
      yourChoice: "আপনার পছন্দ:",
      yourChoiceDesc: "আপনি দান করুন বা না করুন, আপনি নাফলুম সম্প্রদায়ের একজন সমান মূল্যবান সদস্য।",
      gratitude: "কৃতজ্ঞতা:",
      gratitudeDesc: "প্রতিটি দান, পরিমাণ যাই হোক না কেন, গভীরভাবে প্রশংসিত এবং আমাদের আধ্যাত্মিক উন্নয়ন সম্প্রদায়ের সেবা চালিয়ে যেতে সাহায্য করে।",
      thankYouSupport: "আপনার সমর্থনের জন্য ধন্যবাদ",
      thankYouSubtitle: "আপনার সমর্থন আমাদের নাফলুমকে বিনামূল্যে এবং সকলের আধ্যাত্মিক যাত্রায় অ্যাক্সেসযোগ্য রাখতে সাহায্য করে।",
      backToNaflume: "নাফলুমে ফিরুন",
      learnAboutVision: "আমাদের ভিশন সম্পর্কে জানুন",
      footerTagline: "আপনার আধ্যাত্মিক যাত্রা ট্র্যাক করুন, আপনার বৃদ্ধি উদযাপন করুন",
      copyright: "© ২০২৫ নাফলুম। আধ্যাত্মিক বৃদ্ধির জন্য ❤️ দিয়ে তৈরি।",
      copied: "কপি হয়েছে!",
      copy: "কপি"
    }
  };

  const t = translations[language];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Auto-scroll to donation section when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (donationSectionRef.current) {
        donationSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 500); // Small delay to ensure page is fully loaded

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white flex items-center justify-center shadow-sm rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-black">Naflume</span>
                <span className="text-xs text-gray-500 -mt-1">Tazkiyah an-Nafs</span>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">{t.home}</Link>
              <Link to="/vision" className="text-gray-600 hover:text-blue-600 transition-colors">{t.vision}</Link>
              <Link to="/donation" className="text-blue-600 font-medium">{t.donate}</Link>
              
              {/* Global Language Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{tGlobal('languageLabel')}</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select language"
                >
                  <option value="en">{tGlobal('language_en')}</option>
                  <option value="bn">{tGlobal('language_bn')}</option>
                </select>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding relative bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              {t.supportNaflume}
            </h1>
            <p className="text-lg md:text-xl text-blue-600 leading-relaxed max-w-3xl mx-auto">
              {t.supportSubtitle}
            </p>
          </div>
        </div>
      </section>


      {/* Why Donate Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              {t.whySupportMatters}
            </h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              {t.whySupportSubtitle}
            </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Server Hosting */}
              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{t.serverHosting}</h3>
                <p className="text-blue-600 leading-relaxed">
                  {t.serverHostingDesc}
                </p>
              </div>

              {/* Maintenance */}
              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{t.appMaintenance}</h3>
                <p className="text-blue-600 leading-relaxed">
                  {t.appMaintenanceDesc}
                </p>
              </div>

              {/* New Features */}
              <div className="card text-center group hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{t.newFeatures}</h3>
                <p className="text-blue-600 leading-relaxed">
                  {t.newFeaturesDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section ref={donationSectionRef} className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
              {t.howToDonate}
            </h2>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-200">
                    <img 
                      src="/bkash-logo.jpg" 
                      alt="Bkash Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t.bkashMobilePayment}</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {t.personalBkashNumber}
                  </span>
                </p>
                <div className="bg-white rounded-xl p-6 border border-yellow-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Phone Number Section */}
                    <div>
                      <p className="text-lg font-semibold text-gray-800 mb-2">{t.phoneNumber}</p>
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <p className="text-2xl font-bold text-blue-600">+880 1701012405</p>
                        <button
                          onClick={() => copyToClipboard('+880 1701012405')}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200"
                          title="Copy phone number"
                        >
                          {copied ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-xs font-medium">{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs font-medium">{t.copy}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 mb-2">{t.referenceNote}</p>
                      <p className="text-xl font-bold text-green-600">naflume</p>
                    </div>
                    
                    {/* QR Code Section */}
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800 mb-4">{t.scanQRCode}</p>
                      <div className="inline-block p-6 bg-white rounded-xl border-2 border-yellow-200 shadow-lg">
                        <img 
                          src="/bkasqr.jpg" 
                          alt="Bkash QR Code for Naflume Donation" 
                          className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain mx-auto"
                          onError={(e) => {
                            console.error('QR code image failed to load');
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {t.scanWithBkash}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  {t.referenceInstruction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
              {t.importantNotice}
            </h2>
            <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">{t.donationVoluntary}</h3>
              <div className="text-left max-w-3xl mx-auto space-y-4">
                <p className="text-lg text-gray-700">
                  <strong className="text-blue-600">• {t.completelyOptional}</strong> {t.completelyOptionalDesc}
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="text-blue-600">• {t.alternativeSupport}</strong> {t.alternativeSupportDesc}
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="text-blue-600">• {t.yourChoice}</strong> {t.yourChoiceDesc}
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="text-blue-600">• {t.gratitude}</strong> {t.gratitudeDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              {t.thankYouSupport}
            </h2>
            <p className="text-lg text-blue-600 mb-8 max-w-2xl mx-auto">
              {t.thankYouSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="btn-primary text-lg px-8 py-4 inline-block"
              >
                {t.backToNaflume}
              </Link>
              <Link 
                to="/vision"
                className="btn-secondary text-lg px-8 py-4 inline-block"
              >
                {t.learnAboutVision}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center shadow-sm rounded-xl">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold">Naflume</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t.footerTagline}
            </p>
            <p className="text-sm text-gray-500">
              {t.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Donation;
