import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA with intelligent update checking
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered successfully');
        
        // Check for updates only if it's been more than 5 minutes since last check
        const lastUpdateCheck = localStorage.getItem('naflume_last_update_check');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        if (!lastUpdateCheck || (now - parseInt(lastUpdateCheck)) > fiveMinutes) {
          console.log('Checking for service worker updates...');
          registration.update();
          localStorage.setItem('naflume_last_update_check', now.toString());
        } else {
          console.log('Skipping update check - checked recently');
        }
        
        // Listen for update events
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available, but don't auto-reload
                // Let the CacheManager handle the update notification
                console.log('New service worker available, notifying CacheManager...');
                // Dispatch a custom event to notify CacheManager
                window.dispatchEvent(new CustomEvent('sw-update-available'));
              }
            });
          }
        });
      })
      .catch((err) => console.log('SW registration failed', err));
  });
}