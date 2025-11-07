import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { language } = useLanguage();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'progress-tracking',
      title: language === 'bn' ? 'প্রগ্রেস ট্র্যাকিং' : 'Progress Tracking',
      description: language === 'bn' ? 'আপনার আধ্যাত্মিক যাত্রার প্রতিটি পদক্ষেপ ট্র্যাক করুন' : 'Track every step of your spiritual journey',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      details: language === 'bn' ? [
        'দৈনিক ভালো কাজ রেকর্ড করুন',
        'সময়ভিত্তিক ফিল্টারিং',
        'ভিজুয়াল প্রগ্রেস চার্ট',
        'প্রগ্রেস শেয়ার করুন'
      ] : [
        'Daily deed logging',
        'Time-based filtering',
        'Visual progress charts',
        'Share your progress'
      ]
    },
    {
      id: 'goal-management',
      title: language === 'bn' ? 'গোল ম্যানেজমেন্ট' : 'Goal Management',
      description: language === 'bn' ? 'ব্যক্তিগত উন্নতির লক্ষ্য নির্ধারণ ও ট্র্যাক করুন' : 'Set and track personal development goals',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      details: language === 'bn' ? [
        'ব্যক্তিগত বৃদ্ধির লক্ষ্য',
        'কী হাইলাইটার',
        'প্রগ্রেস মনিটরিং',
        'অভ্যাস গঠন'
      ] : [
        'Personal growth goals',
        'Key highlighters',
        'Progress monitoring',
        'Habit building'
      ]
    },
    {
      id: 'spiritual-guidance',
      title: language === 'bn' ? 'আধ্যাত্মিক নির্দেশনা' : 'Spiritual Guidance',
      description: language === 'bn' ? 'ব্যক্তিগত আধ্যাত্মিক নির্দেশনা ও অন্তর্দৃষ্টি পান' : 'Get personalized spiritual guidance and insights',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      details: language === 'bn' ? [
        'ব্যক্তিগত অন্তর্দৃষ্টি',
        'চিন্তার প্রম্পট',
        'বৃদ্ধির সুপারিশ',
        'কুরআন পাঠ'
      ] : [
        'Personalized insights',
        'Reflection prompts',
        'Growth recommendations',
        'Quran reading'
      ]
    },
    {
      id: 'prayer-tracking',
      title: language === 'bn' ? 'নামাজ ট্র্যাকিং' : 'Prayer Tracking',
      description: language === 'bn' ? 'দৈনিক নামাজ ও আধ্যাত্মিক প্রতিশ্রুতি ট্র্যাক করুন' : 'Track daily prayers and spiritual commitment',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-orange-500 to-red-500',
      details: language === 'bn' ? [
        '৫ ওয়াক্ত নামাজ ট্র্যাকিং',
        'নামাজের সময়',
        'সম্পূর্ণতা রেকর্ড',
        'প্রতিশ্রুতি মনিটরিং'
      ] : [
        '5 daily prayers tracking',
        'Prayer times',
        'Completion records',
        'Commitment monitoring'
      ]
    },
    {
      id: 'multilingual-support',
      title: language === 'bn' ? 'বহুভাষিক সমর্থন' : 'Multilingual Support',
      description: language === 'bn' ? 'ইংরেজি ও বাংলা ভাষায় সম্পূর্ণ সমর্থন' : 'Full support in English and Bengali',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-indigo-500 to-blue-500',
      details: language === 'bn' ? [
        'ইংরেজি ও বাংলা',
        'সাংস্কৃতিক সংবেদনশীলতা',
        'স্থানীয়কৃত অভিজ্ঞতা',
        'ভাষা পরিবর্তন'
      ] : [
        'English & Bengali',
        'Cultural sensitivity',
        'Localized experience',
        'Language switching'
      ]
    },
    {
      id: 'store-marketplace',
      title: language === 'bn' ? 'স্টোর ও মার্কেটপ্লেস' : 'Store & Marketplace',
      description: language === 'bn' ? 'আধ্যাত্মিক পণ্য ও পরিষেবার জন্য মার্কেটপ্লেস' : 'Marketplace for spiritual products and services',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
      color: 'from-yellow-500 to-orange-500',
      details: language === 'bn' ? [
        'আধ্যাত্মিক পণ্য',
        'কুপন কোড',
        'বিশ্বস্ত বিক্রেতা',
        'নিয়ন প্রাইস ব্যানার'
      ] : [
        'Spiritual products',
        'Coupon codes',
        'Trusted vendors',
        'Neon price banners'
      ]
    },
    {
      id: 'analytics-insights',
      title: language === 'bn' ? 'অ্যানালিটিক্স ও অন্তর্দৃষ্টি' : 'Analytics & Insights',
      description: language === 'bn' ? 'আপনার বৃদ্ধির বিশদ বিশ্লেষণ ও রিপোর্ট' : 'Detailed analysis and reports of your growth',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: 'from-teal-500 to-cyan-500',
      details: language === 'bn' ? [
        'প্রগ্রেস চার্ট',
        'ট্রেন্ড বিশ্লেষণ',
        'অর্জন ব্যাজ',
        'ব্যক্তিগত রিপোর্ট'
      ] : [
        'Progress charts',
        'Trend analysis',
        'Achievement badges',
        'Personalized reports'
      ]
    },
    {
      id: 'social-sharing',
      title: language === 'bn' ? 'সোশাল শেয়ারিং' : 'Social Sharing',
      description: language === 'bn' ? 'আপনার মাইলস্টোন সোশাল মিডিয়ায় শেয়ার করুন' : 'Share your milestones on social media',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 8a6 6 0 11-11.473 2.227L2 12l2.227-4.527A6 6 0 1118 8z" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-500',
      details: language === 'bn' ? [
        'এক ক্লিক শেয়ার',
        'মাইলস্টোন শেয়ার',
        'প্রগ্রেস ভিজিবিলিটি',
        'সম্প্রদায় উৎসাহ'
      ] : [
        'One-click sharing',
        'Milestone sharing',
        'Progress visibility',
        'Community encouragement'
      ]
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section id="features" className="section-padding relative bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            {language === 'bn' ? 'নাফলুমের বৈশিষ্ট্যসমূহ' : 'Naflume Features'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'bn' ? 'আপনার আধ্যাত্মিক যাত্রাকে সহজ, অর্থবহ ও ফলপ্রসূ করার জন্য ডিজাইন করা হয়েছে' : 'Designed to make your spiritual journey simple, meaningful, and fruitful'}
        </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(index)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFeature === index
                  ? `bg-gradient-to-r ${feature.color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {feature.title}
            </button>
          ))}
        </div>

        {/* Active Feature Display */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Feature Content */}
              <div className="p-12 lg:p-16">
                <div className="flex items-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${features[activeFeature].color} text-white rounded-2xl shadow-lg mr-6`}>
                    {features[activeFeature].icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {features[activeFeature].title}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {features[activeFeature].description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {features[activeFeature].details.map((detail, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 bg-gradient-to-r ${features[activeFeature].color} rounded-full mr-4`}></div>
                      <span className="text-gray-700">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button className={`px-8 py-4 bg-gradient-to-r ${features[activeFeature].color} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                    {language === 'bn' ? 'আরও জানুন' : 'Learn More'}
                  </button>
                </div>
              </div>

              {/* Feature Visual */}
              <div className={`bg-gradient-to-br ${features[activeFeature].color} p-12 lg:p-16 flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    {features[activeFeature].icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">
                    {language === 'bn' ? 'বিশেষ বৈশিষ্ট্য' : 'Special Features'}
                  </h4>
                  <p className="text-lg opacity-90">
                    {language === 'bn' ? 'আপনার আধ্যাত্মিক যাত্রাকে উন্নত করার জন্য বিশেষভাবে ডিজাইন করা' : 'Specially designed to enhance your spiritual journey'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {language === 'bn' ? 'সমস্ত বৈশিষ্ট্য' : 'All Features'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.id} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} text-white rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
                  </h4>
                  <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
                  <div className="space-y-2">
                    {feature.details.slice(0, 3).map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className={`w-1.5 h-1.5 bg-gradient-to-r ${feature.color} rounded-full mr-3`}></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
