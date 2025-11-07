const fs = require('fs');
const path = require('path');

// Generate version information with better cache busting
const version = process.env.npm_package_version || '1.0.0';
const buildTimestamp = new Date().toISOString();
const buildHash = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
const cacheVersion = Date.now();

// Read the index.html file
const indexPath = path.join(__dirname, '../public/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace placeholders with actual values
html = html.replace(/%REACT_APP_VERSION%/g, version);
html = html.replace(/%BUILD_TIMESTAMP%/g, buildTimestamp);
html = html.replace(/%BUILD_HASH%/g, buildHash);
html = html.replace(/%CACHE_VERSION%/g, cacheVersion);

// Write the updated HTML
fs.writeFileSync(indexPath, html);

// Create version.json for runtime access
const versionData = {
  version,
  buildTimestamp,
  buildHash,
  cacheVersion,
  buildDate: new Date().toLocaleDateString(),
  buildTime: new Date().toLocaleTimeString()
};

fs.writeFileSync(
  path.join(__dirname, '../public/version.json'),
  JSON.stringify(versionData, null, 2)
);

console.log('✅ Version information injected successfully');
console.log(`📦 Version: ${version}`);
console.log(`🕒 Build: ${buildTimestamp}`);
console.log(`🔑 Hash: ${buildHash}`);

