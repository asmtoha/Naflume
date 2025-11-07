import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';

const Vision: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => getTranslations(language)(key);

  // Translation content migrated to global translations where needed
  const translations = {
    en: {
      home: "Home",
      vision: "Vision",
      language: "Language:",
      ourVision: "Our Vision",
      visionSubtitle: "Empowering individuals to track their spiritual journey and build meaningful habits through conscious self-reflection",
      whyWeBuilt: "Why We Built Naflume",
      whyWeBuiltText1: "In our fast-paced world, we often focus on our mistakes and negative actions while forgetting the positive impact we make daily.",
      whyWeBuiltText2: "Naflume was born from a simple observation:",
      whyWeBuiltText3: "we remember our bad deeds more than our good ones.",
      whyWeBuiltText4: "Our vision is to create a space where individuals can consciously track their spiritual and personal growth, celebrate their positive actions, and build awareness of their daily choices that shape their character.",
      howFeaturesSupport: "How Our Features Support This Vision",
      howFeaturesSubtitle: "Every feature is designed to support your spiritual and personal development journey",
      dailyTracking: "Daily Tracking",
      dailyTrackingDesc: "Build awareness of your daily actions. Track both positive deeds and areas for improvement to create conscious living.",
      progressInsights: "Progress Insights",
      progressInsightsDesc: "Visualize your growth over time. See patterns, celebrate improvements, and identify areas where you can grow further.",
      shareOnSocial: "Share on Social",
      shareOnSocialDesc: "Inspire others by sharing your milestones. Create a positive ripple effect in your community through your journey.",
      personalGrowthGoals: "Personal Growth Goals",
      personalGrowthGoalsDesc: "Set meaningful goals for your spiritual development. Track progress toward becoming the person you aspire to be.",
      spiritualGuidance: "Spiritual Guidance",
      spiritualGuidanceDesc: "Receive personalized insights and guidance based on your journey. Find wisdom that resonates with your current path.",
      keyHighlighters: "Key Highlighters",
      keyHighlightersDesc: "Focus on your most important commitments. Track long-term goals that matter most to your spiritual development.",
      prayerTracking: "Prayer Tracking",
      prayerTrackingDesc: "Track your daily prayers and spiritual commitments. Monitor your consistency in maintaining your spiritual practices.",
      storeMarketplace: "Store & Marketplace",
      storeMarketplaceDesc: "Discover spiritual products and services from trusted vendors. Access exclusive deals and coupons for your spiritual journey.",
      analyticsInsights: "Analytics & Insights",
      analyticsInsightsDesc: "Get detailed analysis of your spiritual growth. View comprehensive reports, trends, and personalized insights about your journey.",
      multilingualSupport: "Multilingual Support",
      multilingualSupportDesc: "Experience Naflume in your preferred language. Full support for English and Bengali with cultural sensitivity.",
      ourMission: "Our Mission",
      missionText1: "To create a world where individuals consciously track their spiritual growth, celebrate their positive actions, and build meaningful habits that contribute to their character development.",
      missionText2: "Because remembering our good deeds is just as important as learning from our mistakes.",
      readyToStart: "Ready to Start Your Journey?",
      readyToStartSubtitle: "Join thousands of users who are already tracking their spiritual growth and building better habits.",
      getStartedFree: "Get Started Free",
      footerTagline: "Track your spiritual journey, celebrate your growth",
      copyright: "© 2025 Naflume. Made with ❤️ for spiritual growth."
    },
    bn: {
      home: "হোম",
      vision: "ভিশন",
      language: "ভাষা:",
      ourVision: "আমাদের ভিশন",
      visionSubtitle: "সচেতন আত্ম-প্রতিফলনের মাধ্যমে ব্যক্তিদের তাদের আধ্যাত্মিক যাত্রা ট্র্যাক করতে এবং অর্থপূর্ণ অভ্যাস গড়ে তুলতে সক্ষম করা",
      whyWeBuilt: "কেন আমরা নাফলুম তৈরি করেছি",
      whyWeBuiltText1: "আমাদের দ্রুত গতির বিশ্বে, আমরা প্রায়ই আমাদের ভুল এবং নেতিবাচক কর্মের দিকে মনোনিবেশ করি এবং প্রতিদিন যে ইতিবাচক প্রভাব আমরা তৈরি করি তা ভুলে যাই।",
      whyWeBuiltText2: "নাফলুম একটি সহজ পর্যবেক্ষণ থেকে জন্ম নিয়েছে:",
      whyWeBuiltText3: "আমরা আমাদের খারাপ কাজের চেয়ে আমাদের ভালো কাজ বেশি মনে রাখি।",
      whyWeBuiltText4: "আমাদের ভিশন হল এমন একটি স্থান তৈরি করা যেখানে ব্যক্তিরা সচেতনভাবে তাদের আধ্যাত্মিক এবং ব্যক্তিগত বৃদ্ধি ট্র্যাক করতে পারে, তাদের ইতিবাচক কর্ম উদযাপন করতে পারে এবং তাদের দৈনন্দিন পছন্দ সম্পর্কে সচেতনতা গড়ে তুলতে পারে যা তাদের চরিত্র গঠন করে।",
      howFeaturesSupport: "কিভাবে আমাদের বৈশিষ্ট্যগুলি এই ভিশনকে সমর্থন করে",
      howFeaturesSubtitle: "প্রতিটি বৈশিষ্ট্য আপনার আধ্যাত্মিক এবং ব্যক্তিগত উন্নয়নের যাত্রাকে সমর্থন করার জন্য ডিজাইন করা হয়েছে",
      dailyTracking: "দৈনিক ট্র্যাকিং",
      dailyTrackingDesc: "আপনার দৈনিক কর্ম সম্পর্কে সচেতনতা গড়ে তুলুন। ইতিবাচক কর্ম এবং উন্নতির ক্ষেত্রগুলি উভয়ই ট্র্যাক করুন সচেতন জীবনযাপনের জন্য।",
      progressInsights: "অগ্রগতির অন্তর্দৃষ্টি",
      progressInsightsDesc: "সময়ের সাথে আপনার বৃদ্ধি কল্পনা করুন। প্যাটার্ন দেখুন, উন্নতি উদযাপন করুন এবং এমন ক্ষেত্রগুলি চিহ্নিত করুন যেখানে আপনি আরও বৃদ্ধি পেতে পারেন।",
      shareOnSocial: "সোশ্যাল মিডিয়ায় শেয়ার করুন",
      shareOnSocialDesc: "আপনার মাইলফলক শেয়ার করে অন্যদের অনুপ্রাণিত করুন। আপনার যাত্রার মাধ্যমে আপনার সম্প্রদায়ে ইতিবাচক প্রভাব তৈরি করুন।",
      personalGrowthGoals: "ব্যক্তিগত বৃদ্ধির লক্ষ্য",
      personalGrowthGoalsDesc: "আপনার আধ্যাত্মিক উন্নয়নের জন্য অর্থপূর্ণ লক্ষ্য নির্ধারণ করুন। আপনি যে ব্যক্তি হতে চান তার দিকে অগ্রগতি ট্র্যাক করুন।",
      spiritualGuidance: "আধ্যাত্মিক নির্দেশনা",
      spiritualGuidanceDesc: "আপনার যাত্রার ভিত্তিতে ব্যক্তিগত অন্তর্দৃষ্টি এবং নির্দেশনা পান। আপনার বর্তমান পথের সাথে মিলে যায় এমন জ্ঞান খুঁজুন।",
      keyHighlighters: "মূল হাইলাইটার",
      keyHighlightersDesc: "আপনার সবচেয়ে গুরুত্বপূর্ণ প্রতিশ্রুতির দিকে মনোনিবেশ করুন। আপনার আধ্যাত্মিক উন্নয়নের জন্য সবচেয়ে গুরুত্বপূর্ণ দীর্ঘমেয়াদী লক্ষ্যগুলি ট্র্যাক করুন।",
      prayerTracking: "নামাজ ট্র্যাকিং",
      prayerTrackingDesc: "আপনার দৈনিক নামাজ ও আধ্যাত্মিক প্রতিশ্রুতি ট্র্যাক করুন। আপনার আধ্যাত্মিক অনুশীলন বজায় রাখার ধারাবাহিকতা নিরীক্ষণ করুন।",
      storeMarketplace: "স্টোর ও মার্কেটপ্লেস",
      storeMarketplaceDesc: "বিশ্বস্ত বিক্রেতাদের কাছ থেকে আধ্যাত্মিক পণ্য ও পরিষেবা আবিষ্কার করুন। আপনার আধ্যাত্মিক যাত্রার জন্য একচেটিয়া ডিল ও কুপন অ্যাক্সেস করুন।",
      analyticsInsights: "অ্যানালিটিক্স ও অন্তর্দৃষ্টি",
      analyticsInsightsDesc: "আপনার আধ্যাত্মিক বৃদ্ধির বিশদ বিশ্লেষণ পান। আপনার যাত্রা সম্পর্কে বিস্তৃত রিপোর্ট, ট্রেন্ড এবং ব্যক্তিগত অন্তর্দৃষ্টি দেখুন।",
      multilingualSupport: "বহুভাষিক সমর্থন",
      multilingualSupportDesc: "আপনার পছন্দের ভাষায় নাফলুমের অভিজ্ঞতা নিন। সাংস্কৃতিক সংবেদনশীলতার সাথে ইংরেজি ও বাংলায় সম্পূর্ণ সমর্থন।",
      ourMission: "আমাদের মিশন",
      missionText1: "এমন একটি বিশ্ব তৈরি করা যেখানে ব্যক্তিরা সচেতনভাবে তাদের আধ্যাত্মিক বৃদ্ধি ট্র্যাক করে, তাদের ইতিবাচক কর্ম উদযাপন করে এবং এমন অর্থপূর্ণ অভ্যাস গড়ে তোলে যা তাদের চরিত্র উন্নয়নে অবদান রাখে।",
      missionText2: "কারণ আমাদের ভালো কাজ মনে রাখা আমাদের ভুল থেকে শেখার মতোই গুরুত্বপূর্ণ।",
      readyToStart: "আপনার যাত্রা শুরু করতে প্রস্তুত?",
      readyToStartSubtitle: "হাজার হাজার ব্যবহারকারীর সাথে যোগ দিন যারা ইতিমধ্যে তাদের আধ্যাত্মিক বৃদ্ধি ট্র্যাক করছে এবং ভালো অভ্যাস গড়ে তুলছে।",
      getStartedFree: "বিনামূল্যে শুরু করুন",
      footerTagline: "আপনার আধ্যাত্মিক যাত্রা ট্র্যাক করুন, আপনার বৃদ্ধি উদযাপন করুন",
      copyright: "© ২০২৫ নাফলুম। আধ্যাত্মিক বৃদ্ধির জন্য ❤️ দিয়ে তৈরি।"
    }
  } as const;
  const local = translations[language];

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
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">{local.home}</Link>
              <Link to="/vision" className="text-blue-600 font-medium">{local.vision}</Link>
              {/* Global Language Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{t('languageLabel')}</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select language"
                >
                  <option value="en">{t('language_en')}</option>
                  <option value="bn">{t('language_bn')}</option>
                </select>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding relative bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              {local.ourVision}
            </h1>
            <p className="text-lg md:text-xl text-blue-600 leading-relaxed max-w-3xl mx-auto">
              {local.visionSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
              {local.whyWeBuilt}
            </h2>
            <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
              <p className="text-xl mb-6">
                {local.whyWeBuiltText1} 
                <strong className="text-blue-600"> {local.whyWeBuiltText2}</strong> {local.whyWeBuiltText3}
              </p>
              <p className="text-lg mb-8">
                {local.whyWeBuiltText4}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              {local.howFeaturesSupport}
            </h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              {local.howFeaturesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Daily Tracking */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.dailyTracking}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.dailyTrackingDesc}
              </p>
            </div>

            {/* Progress Insights */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.progressInsights}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.progressInsightsDesc}
              </p>
            </div>

            {/* Share on Social */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 8a6 6 0 11-11.473 2.227L2 12l2.227-4.527A6 6 0 1118 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.shareOnSocial}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.shareOnSocialDesc}
              </p>
            </div>

            {/* Personal Growth Goals */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.personalGrowthGoals}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.personalGrowthGoalsDesc}
              </p>
            </div>

            {/* Spiritual Guidance */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.spiritualGuidance}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.spiritualGuidanceDesc}
              </p>
            </div>

            {/* Key Highlighters */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.keyHighlighters}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.keyHighlightersDesc}
              </p>
            </div>

            {/* Prayer Tracking */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-orange-500 text-orange-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.prayerTracking}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.prayerTrackingDesc}
              </p>
            </div>

            {/* Store & Marketplace */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-yellow-500 text-yellow-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.storeMarketplace}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.storeMarketplaceDesc}
              </p>
            </div>

            {/* Analytics & Insights */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-teal-500 text-teal-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.analyticsInsights}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.analyticsInsightsDesc}
              </p>
            </div>

            {/* Multilingual Support */}
            <div className="card text-center group hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-indigo-500 text-indigo-500 rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{local.multilingualSupport}</h3>
              <p className="text-blue-600 leading-relaxed">
                {local.multilingualSupportDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
              {local.ourMission}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {local.missionText1}
              </p>
              <p className="text-lg text-blue-600 font-medium">
                {local.missionText2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              {local.readyToStart}
            </h2>
            <p className="text-lg text-blue-600 mb-8 max-w-2xl mx-auto">
              {local.readyToStartSubtitle}
            </p>
            <Link 
              to="/"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              {local.getStartedFree}
            </Link>
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
              {local.footerTagline}
            </p>
            <p className="text-sm text-gray-500">
              {local.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Vision;
