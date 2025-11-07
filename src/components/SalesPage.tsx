import React from 'react';
import { Link } from 'react-router-dom';

const SalesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom py-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">Naflume</Link>
            <Link to="/" className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold">Back to Home</Link>
          </div>
          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">A Complete Spiritual Growth App For Sell</h1>
            <p className="text-lg md:text-2xl text-white/90">Production-ready features, modern UI, and a growth-focused architecture. Package it, brand it, and sell it to your market.</p>
            <p className="mt-4 text-white/90 text-base md:text-lg">Built with vibe coding and designed to be AI-friendly — easily modify and extend using an AI-powered coding system like Cursor AI. Buyers receive full access and the full source code. Pricing is affordable.</p>
          </div>
        </div>
      </header>

      <main className="container-custom py-12 space-y-16">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Authentication & Accounts</h3>
            <p className="text-gray-600">Google sign-in, protected routes, user profiles, and session handling built-in.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Progress Dashboard</h3>
            <p className="text-gray-600">Beautiful analytics for good/bad deeds, goals, trends, and daily summaries.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Goals & Guidance</h3>
            <p className="text-gray-600">Create goals, track completion, and offer spiritual guidance experiences.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Sharing & Public Profiles</h3>
            <p className="text-gray-600">Public progress pages to help users share growth and invite others.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">PWA & Caching</h3>
            <p className="text-gray-600">Offline-ready with cache management and update banners for smooth UX.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Store Integration</h3>
            <p className="text-gray-600">Built-in store pages if you want to sell digital products or subscriptions.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Who will buy this?</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Religious institutions and communities</li>
              <li>Spiritual coaches and mentors</li>
              <li>Nonprofits and youth groups</li>
              <li>EdTech organizations focusing on character building</li>
            </ul>
          </div>
          <div className="p-8 rounded-3xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Business models</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>One-time license sale with setup</li>
              <li>Monthly subscription (SaaS)</li>
              <li>White-labeling for institutions</li>
              <li>Freemium with premium features</li>
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">AI‑Friendly Customization</h3>
            <p className="text-gray-600">Crafted with vibe coding principles and clean TypeScript. Effortlessly ask an AI like Cursor AI to refactor pages, add features, or rebrand components.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Full Access & Full Code</h3>
            <p className="text-gray-600">You get the complete source code and unrestricted project access. Host anywhere, change anything, and truly own your product.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Affordable Pricing</h3>
            <p className="text-gray-600">Priced to be accessible — get a production-ready app without a heavy upfront cost. Reach out to discuss the offer.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-1">Tech Stack</h3>
            <p className="text-gray-600">React + TypeScript, Firebase (Auth/Firestore), TailwindCSS, PWA.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-1">Performance</h3>
            <p className="text-gray-600">Optimized bundle, lazy routes, and smart caching for snappy UX.</p>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-1">Deployment</h3>
            <p className="text-gray-600">Works with Firebase Hosting, Vercel, or any static host + service worker.</p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Want a personalized walkthrough?</h2>
          <p className="text-gray-600 mb-6">I can help tailor the app for your niche and prepare a sales-ready demo.</p>
          <a href="mailto:naflumeinfo@gmail.com" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">Contact for Offer</a>
        </section>
      </main>
    </div>
  );
};

export default SalesPage;


