import React from 'react';
import { Link } from 'react-router-dom';

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">Naflume</Link>
            <Link to="/offer" className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold">Back to Offer</Link>
          </div>
          <div className="mt-6 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">Documentation</h1>
            <p className="text-white/80 text-lg">Everything you need to deploy, customize, and sell the app.</p>
          </div>
        </div>
      </header>

      <main className="container-custom py-10 space-y-12">
        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Project structure and conventions</li>
              <li>Tech stack and versions</li>
              <li>Key features and modules</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Prerequisites and environment</li>
              <li>Install, run, and build</li>
              <li>Firebase setup</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl border shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Customization</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Theming and branding</li>
              <li>Editing with Cursor AI</li>
              <li>Adding new pages and routes</li>
            </ul>
          </div>
        </section>

        <section className="prose max-w-none">
          <h2>1. Project Structure</h2>
          <pre className="bg-gray-50 border rounded-xl p-4 overflow-auto text-sm">{`src/
  components/
  contexts/
  data/
  firebase/
  services/
  utils/
public/
scripts/`}</pre>

          <h2>2. Local Development</h2>
          <ol>
            <li>Install Node.js 18+</li>
            <li>Run <code>npm install</code></li>
            <li>Run <code>npm start</code> to start dev server</li>
          </ol>

          <h2>3. Build & Deploy</h2>
          <p>Build command:</p>
          <pre className="bg-gray-50 border rounded-xl p-4 overflow-auto text-sm"><code>npm run build</code></pre>
          <p>Serve the <code>build/</code> directory on Firebase Hosting, Vercel, Netlify, or any static host. The app includes a service worker and versioning for cache updates.</p>

          <h2>4. Firebase Configuration</h2>
          <p>Update <code>src/firebase/config.ts</code> with your Firebase credentials. Enable Authentication (Google), Firestore, and Hosting if you deploy to Firebase.</p>

          <h2>5. Theming & Branding</h2>
          <p>Update Tailwind config, colors, and components like <code>Header</code>, <code>Hero</code>, and <code>SellingHighlight</code> to reflect your brand.</p>

          <h2>6. AI‑Assisted Editing (Cursor AI)</h2>
          <ul>
            <li>Open the workspace in Cursor</li>
            <li>Ask the AI to rename components, adjust copy, or add modules</li>
            <li>Follow the code style conventions for clean diffs</li>
          </ul>

          <h2>7. Extending Features</h2>
          <ul>
            <li>Add new pages under <code>src/components</code> and wire routes in <code>src/App.tsx</code></li>
            <li>Use contexts for global state (auth, language)</li>
            <li>Leverage <code>utils/version.ts</code> and <code>UpdateBanner</code> for release flows</li>
          </ul>

          <h2>8. Licensing & Ownership</h2>
          <p>You receive full source code access and can customize, rebrand, and deploy under your own account(s). Discuss licensing terms with the seller if you plan to redistribute.</p>

          <hr />

          <h2>Feature Reference</h2>
          <p>This section documents key user-facing features and how to configure or extend them. Implementation details that involve secrets or security-sensitive data are intentionally omitted.</p>

          <h3>Authentication</h3>
          <ul>
            <li>Location: <code>src/contexts/AuthContext.tsx</code></li>
            <li>What it does: Provides current user, loading state, and sign-in/sign-out helpers to the app.</li>
            <li>How to extend: Add providers (e.g., email/password) and expose new methods via context.</li>
            <li>UI integration: <code>Header</code>, <code>Dashboard</code>, and protected routes use this context.</li>
          </ul>

          <h3>Language & Translations</h3>
          <ul>
            <li>Location: <code>src/contexts/LanguageContext.tsx</code>, <code>src/utils/translations.ts</code></li>
            <li>What it does: Switches UI between languages; translation keys consumed by components.</li>
            <li>How to extend: Add new language keys in <code>translations.ts</code>; wire controls in UI as needed.</li>
          </ul>

          <h3>Dashboard</h3>
          <ul>
            <li>Location: <code>src/components/Dashboard.tsx</code></li>
            <li>What it does: Displays progress overview, charts, and sections (salah, growth, activity, guidance).</li>
            <li>Data model: Uses Firestore collections like <code>deeds</code> and <code>goals</code> (schema inferred from UI).</li>
            <li>How to extend: Add new cards, charts, or tabs. Use consistent Tailwind and chart structure.</li>
          </ul>

          <h3>Deeds and Activity</h3>
          <ul>
            <li>Components: <code>DeedItem.tsx</code>, <code>DeedLoggingModal.tsx</code></li>
            <li>What it does: Users log good/bad deeds with timestamps; activity filtered by timeframes.</li>
            <li>How to extend: Add categories, notes, or media fields; update filters and charts accordingly.</li>
          </ul>

          <h3>Goals (Personal Growth)</h3>
          <ul>
            <li>Components: <code>PersonalGrowth.tsx</code></li>
            <li>What it does: Create, track, and visualize goal completion over selected periods.</li>
            <li>How to extend: Add reminders, streaks, or leaderboards; keep Firestore structure consistent.</li>
          </ul>

          <h3>Salah Tracking</h3>
          <ul>
            <li>Components: <code>Salah.tsx</code></li>
            <li>What it does: Stores and displays daily prayer completion counts.</li>
            <li>How to extend: Add notifications or calendar views; keep per-day document structure intact.</li>
          </ul>

          <h3>Spiritual Guidance</h3>
          <ul>
            <li>Components: <code>SpiritualGuidance.tsx</code>, <code>SpiritualGuidanceModal.tsx</code>, <code>SpiritualGuidanceEnhanced.tsx</code></li>
            <li>What it does: Presents curated guidance content and modal interactions.</li>
            <li>How to extend: Add content sources or categories; respect UX patterns in modals.</li>
          </ul>

          <h3>Public Progress Sharing</h3>
          <ul>
            <li>Component: <code>PublicProgressPage.tsx</code></li>
            <li>What it does: Read-only public view of a user’s progress, accessible via share link.</li>
            <li>How to extend: Add share channels, QR generation, or privacy toggles (per user settings).</li>
          </ul>

          <h3>PWA, Caching, and Updates</h3>
          <ul>
            <li>Components: <code>CacheManager.tsx</code>, <code>UpdateBanner.tsx</code></li>
            <li>Utilities: <code>src/utils/version.ts</code></li>
            <li>What it does: Detects new builds, shows an update banner, handles refresh flows.</li>
            <li>How to extend: Customize banner copy/behavior; use <code>version.ts</code> helpers for consistency.</li>
          </ul>

          <h3>Store (Optional)</h3>
          <ul>
            <li>Components: <code>Store.tsx</code>, <code>ProductCard.tsx</code>, <code>ProductDetail.tsx</code>, <code>AdminStore.tsx</code></li>
            <li>What it does: Basic storefront and admin views for products/content.</li>
            <li>How to extend: Integrate a payment provider or subscriptions; keep product schema consistent.</li>
          </ul>

          <h3>Qur'an, Prayer Times, Utilities</h3>
          <ul>
            <li>Components: <code>QuranReader.tsx</code>, utilities: <code>utils/prayerTimes.ts</code>, <code>utils/dateUtils.ts</code></li>
            <li>What it does: Reading experiences and helpers for time/date calculations.</li>
            <li>How to extend: Add translations, recitations, or localization options.</li>
          </ul>

          <h3>Sales & Marketing Pages</h3>
          <ul>
            <li>Components: <code>SellingHighlight.tsx</code>, <code>SalesPage.tsx</code>, <code>DocsPage.tsx</code></li>
            <li>What it does: Landing highlight, sales details, and documentation for buyers.</li>
            <li>How to extend: Add pricing tiers, FAQs, testimonials, and comparison tables.</li>
          </ul>

          <h3>Security & Secrets</h3>
          <p>Do not hardcode credentials or private keys in the repo. Use environment variables and project-level configuration for any sensitive data. Keep Firebase rules and API keys configured outside of this documentation.</p>
        </section>
      </main>
    </div>
  );
};

export default DocsPage;


