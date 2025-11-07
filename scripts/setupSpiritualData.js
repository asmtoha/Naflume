#!/usr/bin/env node

const { generateData } = require('./generateSpiritualData');
const { uploadSpiritualData, verifyUpload } = require('./uploadToFirestore');
const fs = require('fs');
const path = require('path');

console.log('🕌 Setting up Spiritual Guidance System...\n');

async function setupSpiritualData() {
  try {
    // Step 1: Generate data
    console.log('📝 Step 1: Generating spiritual content...');
    const content = generateData();
    console.log(`✅ Generated ${content.length} spiritual content entries\n`);
    
    // Step 2: Check if Firebase config exists
    console.log('🔧 Step 2: Checking Firebase configuration...');
    const configPath = path.join(__dirname, '..', 'src', 'firebase', 'config.ts');
    
    if (!fs.existsSync(configPath)) {
      console.log('⚠️  Firebase config not found. Please configure Firebase first.');
      console.log('   Create src/firebase/config.ts with your Firebase configuration.');
      console.log('   See SPIRITUAL_GUIDANCE_SOLUTION.md for details.\n');
      return;
    }
    
    console.log('✅ Firebase config found\n');
    
    // Step 3: Upload to Firestore
    console.log('☁️  Step 3: Uploading to Firestore...');
    await uploadSpiritualData();
    console.log('✅ Data uploaded to Firestore\n');
    
    // Step 4: Verify upload
    console.log('🔍 Step 4: Verifying upload...');
    await verifyUpload();
    console.log('✅ Upload verified\n');
    
    // Step 5: Update component
    console.log('🔄 Step 5: Component update instructions...');
    console.log('   To use the enhanced spiritual guidance system:');
    console.log('   1. Replace SpiritualGuidance with SpiritualGuidanceEnhanced in your app');
    console.log('   2. Import: import SpiritualGuidanceEnhanced from "./components/SpiritualGuidanceEnhanced"');
    console.log('   3. Use: <SpiritualGuidanceEnhanced deeds={deeds} />\n');
    
    console.log('🎉 Spiritual Guidance System setup complete!');
    console.log('   Your app now supports 500+ Quranic verses and hadith with tafsir.');
    console.log('   No more "Tool call ended before result was received" errors!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your Firebase configuration');
    console.log('   2. Ensure you have proper Firestore permissions');
    console.log('   3. Check your internet connection');
    console.log('   4. See SPIRITUAL_GUIDANCE_SOLUTION.md for detailed instructions');
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  setupSpiritualData();
}

module.exports = { setupSpiritualData };

