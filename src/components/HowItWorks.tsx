import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { language } = useLanguage();
  const steps = [
    {
      number: "1",
      title: language === 'bn' ? 'সাইন আপ ও লক্ষ্য সেট' : 'Sign Up & Set Goals',
      description: language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন এবং আপনার ব্যক্তিগত উন্নতির লক্ষ্য নির্ধারণ করুন' : 'Create your account and define your personal self-improvement goals',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      number: "2",
      title: language === 'bn' ? 'দৈনিক কাজ ট্র্যাক' : 'Track Daily Actions',
      description: language === 'bn' ? 'সারাদিনের সৎ কাজগুলো লগ করুন' : 'Log your good deeds and actions throughout the day',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      number: "3",
      title: language === 'bn' ? 'রিভিউ ও উন্নতি' : 'Review & Improve',
      description: language === 'bn' ? 'আপনার অগ্রগতি বিশ্লেষণ করুন এবং উন্নতির যাত্রা চালিয়ে যান' : 'Analyze your progress and continue your growth journey',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="section-padding relative bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            {language === 'bn' ? 'কিভাবে কাজ করে?' : 'How It Works?'}
          </h2>
                  <p className="text-lg text-blue-600 max-w-2xl mx-auto leading-relaxed">
          {language === 'bn' ? 'মাত্র তিনটি সহজ ধাপে শুরু করুন আপনার উন্নতির যাত্রা' : 'Start your self-improvement journey in just three simple steps'}
        </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 relative overflow-hidden group-hover:border-blue-200">
                {/* Background accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-xl mb-6 text-xl font-bold shadow-md group-hover:scale-110 transition-all duration-300">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-blue-500 text-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-black mb-4">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-blue-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>

              {/* Connecting Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link 
            to="/user-guide"
            onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            className="btn-primary text-lg px-8 py-4 inline-block"
          >
            {language === 'bn' ? 'আরও জানুন' : 'Know More'}
          </Link>
        </div>
      </div>
      
      {/* Removed Language Selection Modal trigger; keeping component import unused removal handled by TS */}
    </section>
  );
};

export default HowItWorks;
