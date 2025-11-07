const { initializeApp } = require('firebase/app');
const { getFirestore, collection, writeBatch, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Batch upload function
async function uploadSpiritualData() {
  try {
    console.log('Starting spiritual data upload to Firestore...');
    
    // Read generated data
    const dataPath = path.join(__dirname, '..', 'src', 'data', 'spiritualGuidanceData.json');
    const content = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`Found ${content.length} entries to upload`);
    
    // Upload in batches of 500 (Firestore limit)
    const batchSize = 500;
    const totalBatches = Math.ceil(content.length / batchSize);
    
    for (let i = 0; i < content.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchContent = content.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      console.log(`Processing batch ${batchNumber}/${totalBatches}...`);
      
      batchContent.forEach(item => {
        const docRef = doc(collection(db, 'spiritual_guidance'));
        batch.set(docRef, {
          ...item,
          createdAt: new Date(item.createdAt)
        });
      });
      
      await batch.commit();
      console.log(`Batch ${batchNumber} uploaded successfully`);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < content.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('All data uploaded successfully!');
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Create Firestore indexes
async function createIndexes() {
  console.log('Creating Firestore indexes...');
  
  // Note: In production, you would create these indexes in the Firebase Console
  // or using the Firebase CLI. This is just for documentation.
  
  const indexes = [
    {
      collection: 'spiritual_guidance',
      fields: [
        { field: 'source', order: 'ASCENDING' },
        { field: 'priority', order: 'DESCENDING' },
        { field: 'createdAt', order: 'DESCENDING' }
      ]
    },
    {
      collection: 'spiritual_guidance',
      fields: [
        { field: 'type', order: 'ASCENDING' },
        { field: 'priority', order: 'DESCENDING' },
        { field: 'createdAt', order: 'DESCENDING' }
      ]
    },
    {
      collection: 'spiritual_guidance',
      fields: [
        { field: 'tags', order: 'ASCENDING' },
        { field: 'priority', order: 'DESCENDING' },
        { field: 'createdAt', order: 'DESCENDING' }
      ]
    }
  ];
  
  console.log('Indexes to create in Firebase Console:');
  console.log(JSON.stringify(indexes, null, 2));
}

// Verify upload
async function verifyUpload() {
  try {
    const { getDocs, collection, limit } = require('firebase/firestore');
    
    console.log('Verifying upload...');
    
    const snapshot = await getDocs(collection(db, 'spiritual_guidance'));
    console.log(`Total documents in Firestore: ${snapshot.size}`);
    
    // Check sample documents
    const sampleDocs = snapshot.docs.slice(0, 3);
    sampleDocs.forEach(doc => {
      console.log(`Sample document: ${doc.id} - ${doc.data().reference}`);
    });
    
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Main execution
async function main() {
  try {
    await uploadSpiritualData();
    await verifyUpload();
    console.log('Upload process completed successfully!');
  } catch (error) {
    console.error('Upload process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { uploadSpiritualData, verifyUpload };

