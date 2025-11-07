import React from 'react';
import { Link } from 'react-router-dom';

const SellingHighlight: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0, transparent 25%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.3) 0, transparent 30%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.25) 0, transparent 25%)'
      }} />
      <div className="container-custom relative py-10 md:py-14">
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-4 border border-white/30">
                Ready-to-sell Web App
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white mb-4">
                Launch a Spiritual Growth App Business in Days
              </h1>
              <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6">
                Production-ready SaaS-style app with user auth, dashboards, goal tracking, spiritual guidance, PWA support, and growth-ready architecture. Sell subscriptions or license it to communities, institutes, or coaches.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/offer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  See Full Offer
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-transparent border border-white/60 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Read Documentation
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-transparent border border-white/60 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  How it works
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-4 shadow-2xl border border-indigo-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <div className="text-indigo-600 font-semibold text-sm mb-1">Dashboard</div>
                    <div className="h-16 bg-white rounded-lg border border-indigo-100"></div>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="text-purple-600 font-semibold text-sm mb-1">Goals</div>
                    <div className="h-16 bg-white rounded-lg border border-purple-100"></div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-blue-600 font-semibold text-sm mb-1">Guidance</div>
                    <div className="h-16 bg-white rounded-lg border border-blue-100"></div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="text-emerald-600 font-semibold text-sm mb-1">Sharing</div>
                    <div className="h-16 bg-white rounded-lg border border-emerald-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellingHighlight;


