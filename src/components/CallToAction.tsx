import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Removed Firestore imports after dropping user count

// Removed DynamicUserCount per request

const CallToAction: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  const handleGetStarted = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleWatchDemo = () => {
    // Scroll to how-it-works section
    document.getElementById('how-it-works')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section id="contact" className="section-padding relative bg-white">
      <div className="container-custom">
        <div className="text-center">
          {/* Main Slogan */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">
            Ready to Start Your <span className="text-black">Journey?</span>
          </h2>
          
          {/* Sub Slogan */}
                  <p className="text-lg md:text-xl mb-8 text-blue-600 leading-relaxed max-w-2xl mx-auto">
          Start your self-improvement journey today
        </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
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
              <p className="text-xs text-blue-500">Start immediately</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                {/* No Ads icon (ban symbol) */}
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M5 19L19 5" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black mb-1">No Ads</h3>
              <p className="text-xs text-blue-500">Distraction-free experience</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              className="btn-primary text-lg px-8 py-4"
              onClick={handleGetStarted}
            >
              Get Started Free
            </button>
            <button 
              className="btn-secondary text-lg px-8 py-4"
              onClick={handleWatchDemo}
            >
              Watch Demo
            </button>
          </div>
          
          
          
          {/* Removed dynamic user count */}
        </div>
      </div>
      
    </section>
  );
};

export default CallToAction;
