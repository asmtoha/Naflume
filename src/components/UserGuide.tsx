import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslations } from '../utils/translations';

const UserGuide: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => getTranslations(language)(key);
  const [activeFeature, setActiveFeature] = useState('progress-tracking');

  // Ensure page opens from top when navigated
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

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
      steps: language === 'bn' ? [
        {
          step: 1,
          title: 'দৈনিক কাজ রেকর্ড করুন',
          description: 'প্রতিদিন আপনার ভালো ও খারাপ কাজগুলো লগ করুন। প্রতিটি কাজের বিস্তারিত বিবরণ দিন।',
          tips: ['প্রতিদিন নির্দিষ্ট সময়ে রেকর্ড করুন', 'বিস্তারিত বিবরণ লিখুন', 'নিয়মিতভাবে আপডেট করুন']
        },
        {
          step: 2,
          title: 'সময়ভিত্তিক ফিল্টারিং',
          description: 'আপনার অগ্রগতি দেখুন দিন, সপ্তাহ, মাস বা বছরের ভিত্তিতে।',
          tips: ['বিভিন্ন সময়কালে অগ্রগতি তুলনা করুন', 'ট্রেন্ড বিশ্লেষণ করুন', 'মাইলস্টোন ট্র্যাক করুন']
        },
        {
          step: 3,
          title: 'ভিজুয়াল প্রগ্রেস চার্ট',
          description: 'আপনার বৃদ্ধির চাক্ষুষ উপস্থাপনা দেখুন এবং প্যাটার্ন চিহ্নিত করুন।',
          tips: ['চার্টে আপনার অগ্রগতি দেখুন', 'প্যাটার্ন চিহ্নিত করুন', 'উন্নতির ক্ষেত্র খুঁজুন']
        }
      ] : [
        {
          step: 1,
          title: 'Daily Deed Logging',
          description: 'Log your good and bad deeds daily. Provide detailed descriptions for each action.',
          tips: ['Record at a specific time each day', 'Write detailed descriptions', 'Update regularly']
        },
        {
          step: 2,
          title: 'Time-based Filtering',
          description: 'View your progress by day, week, month, or year.',
          tips: ['Compare progress across different time periods', 'Analyze trends', 'Track milestones']
        },
        {
          step: 3,
          title: 'Visual Progress Charts',
          description: 'See visual representations of your growth and identify patterns.',
          tips: ['View your progress in charts', 'Identify patterns', 'Find areas for improvement']
        }
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
      steps: language === 'bn' ? [
        {
          step: 1,
          title: 'লক্ষ্য নির্ধারণ করুন',
          description: 'আপনার আধ্যাত্মিক উন্নয়নের জন্য অর্থপূর্ণ লক্ষ্য সেট করুন।',
          tips: ['স্পষ্ট এবং পরিমাপযোগ্য লক্ষ্য সেট করুন', 'সময়সীমা নির্ধারণ করুন', 'প্রতিদিনের লক্ষ্য তৈরি করুন']
        },
        {
          step: 2,
          title: 'প্রগ্রেস মনিটরিং',
          description: 'আপনার লক্ষ্যের দিকে অগ্রগতি ট্র্যাক করুন এবং প্রয়োজন অনুযায়ী সামঞ্জস্য করুন।',
          tips: ['নিয়মিতভাবে অগ্রগতি পর্যালোচনা করুন', 'লক্ষ্য আপডেট করুন', 'উৎসাহ দিন']
        },
        {
          step: 3,
          title: 'অভ্যাস গঠন',
          description: 'দৈনিক, সাপ্তাহিক এবং মাসিক লক্ষ্যের মাধ্যমে স্থায়ী অভ্যাস গড়ে তুলুন।',
          tips: ['ছোট লক্ষ্য দিয়ে শুরু করুন', 'ধারাবাহিকতা বজায় রাখুন', 'অর্জন উদযাপন করুন']
        }
      ] : [
        {
          step: 1,
          title: 'Set Your Goals',
          description: 'Define meaningful goals for your spiritual development.',
          tips: ['Set clear and measurable goals', 'Define timeframes', 'Create daily objectives']
        },
        {
          step: 2,
          title: 'Monitor Progress',
          description: 'Track your progress toward goals and adjust as needed.',
          tips: ['Review progress regularly', 'Update goals as needed', 'Stay motivated']
        },
        {
          step: 3,
          title: 'Build Habits',
          description: 'Create lasting habits through daily, weekly, and monthly goals.',
          tips: ['Start with small goals', 'Maintain consistency', 'Celebrate achievements']
        }
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
      steps: language === 'bn' ? [
        {
          step: 1,
          title: 'ব্যক্তিগত অন্তর্দৃষ্টি',
          description: 'আপনার যাত্রার ভিত্তিতে ব্যক্তিগত অন্তর্দৃষ্টি এবং নির্দেশনা পান।',
          tips: ['নিয়মিতভাবে গাইডেন্স পড়ুন', 'প্রতিফলন করুন', 'জ্ঞান প্রয়োগ করুন']
        },
        {
          step: 2,
          title: 'চিন্তার প্রম্পট',
          description: 'আপনার আধ্যাত্মিক অনুশীলনকে গভীর করার জন্য চিন্তার প্রশ্নগুলি ব্যবহার করুন।',
          tips: ['প্রতিদিন প্রম্পট পড়ুন', 'গভীরভাবে চিন্তা করুন', 'উত্তর লিখুন']
        },
        {
          step: 3,
          title: 'বৃদ্ধির সুপারিশ',
          description: 'আপনার আধ্যাত্মিক উন্নয়নের জন্য ব্যক্তিগত সুপারিশ পান।',
          tips: ['সুপারিশ অনুসরণ করুন', 'নতুন অনুশীলন চেষ্টা করুন', 'অগ্রগতি মূল্যায়ন করুন']
        }
      ] : [
        {
          step: 1,
          title: 'Personalized Insights',
          description: 'Receive personalized insights and guidance based on your journey.',
          tips: ['Read guidance regularly', 'Reflect on insights', 'Apply the wisdom']
        },
        {
          step: 2,
          title: 'Reflection Prompts',
          description: 'Use thought-provoking questions to deepen your spiritual practice.',
          tips: ['Read prompts daily', 'Think deeply', 'Write your responses']
        },
        {
          step: 3,
          title: 'Growth Recommendations',
          description: 'Get personalized recommendations for your spiritual development.',
          tips: ['Follow recommendations', 'Try new practices', 'Evaluate progress']
        }
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
      steps: language === 'bn' ? [
        {
          step: 1,
          title: '৫ ওয়াক্ত নামাজ ট্র্যাকিং',
          description: 'প্রতিদিনের ৫ ওয়াক্ত নামাজের সময় এবং সম্পূর্ণতা রেকর্ড করুন।',
          tips: ['নামাজের সময় দেখুন', 'সম্পূর্ণতা চিহ্নিত করুন', 'নিয়মিততা বজায় রাখুন']
        },
        {
          step: 2,
          title: 'নামাজের সময়',
          description: 'আপনার অবস্থানের ভিত্তিতে সঠিক নামাজের সময় দেখুন।',
          tips: ['সঠিক সময় দেখুন', 'রিমাইন্ডার সেট করুন', 'সময় অনুযায়ী নামাজ পড়ুন']
        },
        {
          step: 3,
          title: 'প্রতিশ্রুতি মনিটরিং',
          description: 'আপনার আধ্যাত্মিক প্রতিশ্রুতির অগ্রগতি ট্র্যাক করুন।',
          tips: ['প্রতিশ্রুতি রেকর্ড করুন', 'অগ্রগতি দেখুন', 'লক্ষ্য অর্জন করুন']
        }
      ] : [
        {
          step: 1,
          title: '5 Daily Prayers Tracking',
          description: 'Record the timing and completion of your 5 daily prayers.',
          tips: ['Check prayer times', 'Mark completion', 'Maintain consistency']
        },
        {
          step: 2,
          title: 'Prayer Times',
          description: 'View accurate prayer times based on your location.',
          tips: ['Check accurate times', 'Set reminders', 'Pray on time']
        },
        {
          step: 3,
          title: 'Commitment Monitoring',
          description: 'Track your progress on spiritual commitments.',
          tips: ['Record commitments', 'View progress', 'Achieve goals']
        }
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
      steps: language === 'bn' ? [
        {
          step: 1,
          title: 'আধ্যাত্মিক পণ্য আবিষ্কার করুন',
          description: 'বিশ্বস্ত বিক্রেতাদের কাছ থেকে আধ্যাত্মিক পণ্য এবং পরিষেবা আবিষ্কার করুন।',
          tips: ['বিভিন্ন পণ্য ব্রাউজ করুন', 'বিক্রেতা রিভিউ পড়ুন', 'গুণমান যাচাই করুন']
        },
        {
          step: 2,
          title: 'কুপন কোড ব্যবহার করুন',
          description: 'একচেটিয়া ডিল এবং কুপন কোডের মাধ্যমে সাশ্রয় করুন।',
          tips: ['কুপন কোড খুঁজুন', 'ডিসকাউন্ট প্রয়োগ করুন', 'সাশ্রয় করুন']
        },
        {
          step: 3,
          title: 'নিয়ন প্রাইস ব্যানার',
          description: 'বিশেষ অফার এবং ডিসকাউন্ট সহজেই চিহ্নিত করুন।',
          tips: ['নিয়ন ব্যানার দেখুন', 'বিশেষ অফার খুঁজুন', 'সাশ্রয়ের সুযোগ নিন']
        }
      ] : [
        {
          step: 1,
          title: 'Discover Spiritual Products',
          description: 'Find spiritual products and services from trusted vendors.',
          tips: ['Browse different products', 'Read vendor reviews', 'Check quality']
        },
        {
          step: 2,
          title: 'Use Coupon Codes',
          description: 'Save money with exclusive deals and coupon codes.',
          tips: ['Find coupon codes', 'Apply discounts', 'Save money']
        },
        {
          step: 3,
          title: 'Neon Price Banners',
          description: 'Easily identify special offers and discounts.',
          tips: ['Look for neon banners', 'Find special offers', 'Take advantage of savings']
        }
      ]
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/vision" className="text-gray-600 hover:text-blue-600 transition-colors">Vision</Link>
              <Link to="/user-guide" className="text-blue-600 font-medium">User Guide</Link>
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
              {language === 'bn' ? 'ব্যবহারকারী নির্দেশিকা' : 'User Guide'}
            </h1>
            <p className="text-lg md:text-xl text-blue-600 leading-relaxed max-w-3xl mx-auto">
              {language === 'bn' ? 'নাফলুমের সমস্ত বৈশিষ্ট্য কীভাবে ব্যবহার করবেন তার বিস্তারিত নির্দেশিকা' : 'Detailed guide on how to use all features of Naflume'}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeFeature === feature.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`${activeFeature === feature.id ? 'text-white' : 'text-blue-500'}`}>
                    {feature.icon}
                  </div>
                  <span>{feature.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Feature Details */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Feature Header */}
            <div className="text-center mb-12">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${activeFeatureData.color} text-white rounded-2xl mb-6 shadow-lg`}>
                {activeFeatureData.icon}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                {activeFeatureData.title}
              </h2>
              <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                {activeFeatureData.description}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8">
              {activeFeatureData.steps.map((step, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-r ${activeFeatureData.color} text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md`}>
                        {step.step}
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-black mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {/* Tips */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">
                          {language === 'bn' ? 'টিপস:' : 'Tips:'}
                        </h4>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-blue-700 text-sm flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              {language === 'bn' ? 'এখনই শুরু করুন' : 'Ready to Get Started?'}
            </h2>
            <p className="text-lg text-blue-600 mb-8 max-w-2xl mx-auto">
              {language === 'bn' ? 'এই নির্দেশিকা অনুসরণ করে আপনার আধ্যাত্মিক যাত্রা শুরু করুন' : 'Start your spiritual journey by following this guide'}
            </p>
            <Link 
              to="/"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started Now'}
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
              {language === 'bn' ? 'আপনার আধ্যাত্মিক যাত্রা ট্র্যাক করুন, আপনার বৃদ্ধি উদযাপন করুন' : 'Track your spiritual journey, celebrate your growth'}
            </p>
            <p className="text-sm text-gray-500">
              © 2025 Naflume. Made with ❤️ for spiritual growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserGuide;
