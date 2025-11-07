import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const FirebaseDebug: React.FC = () => {
  const { currentUser } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addDebugMessage = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    setDebugInfo([]);
    
    try {
      addDebugMessage('Starting Firebase test...');
      
      // Test 1: Check authentication
      if (currentUser) {
        addDebugMessage(`✅ User authenticated: ${currentUser.email}`);
        addDebugMessage(`User UID: ${currentUser.uid}`);
      } else {
        addDebugMessage('❌ No user authenticated');
        setIsLoading(false);
        return;
      }

      // Test 2: Try to read from deeds collection
      addDebugMessage('📖 Testing read access to deeds collection...');
      const deedsCollection = collection(db, 'deeds');
      const snapshot = await getDocs(deedsCollection);
      addDebugMessage(`✅ Read access successful. Found ${snapshot.size} documents total`);
      
             // Check for current user's deeds
       const userDeeds = snapshot.docs.filter(doc => doc.data().userId === currentUser.uid);
       addDebugMessage(`📋 Current user has ${userDeeds.length} deeds`);
       
       if (userDeeds.length > 0) {
         addDebugMessage('Sample deed data:');
         const sampleDeed = userDeeds[0].data();
         addDebugMessage(JSON.stringify(sampleDeed, null, 2));
         
         // Show deed types breakdown
         const goodDeeds = userDeeds.filter(doc => doc.data().deedType === 'good').length;
         const badDeeds = userDeeds.filter(doc => doc.data().deedType === 'bad').length;
         addDebugMessage(`📊 Breakdown: ${goodDeeds} good deeds, ${badDeeds} bad deeds`);
       }

      // Test 3: Try to write a test document
      addDebugMessage('✍️ Testing write access...');
      const testDoc = await addDoc(collection(db, 'deeds'), {
        userId: currentUser.uid,
        deedType: 'good',
        description: 'Firebase test deed - please delete',
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
        isTest: true
      });
      addDebugMessage(`✅ Write access successful. Test doc ID: ${testDoc.id}`);

    } catch (error: any) {
      addDebugMessage(`❌ Error: ${error.message}`);
      addDebugMessage(`Error code: ${error.code || 'unknown'}`);
      console.error('Firebase test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      testFirebaseConnection();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please log in to test Firebase connection.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border">
      <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black">Firebase Debug Information</h3>
        <button 
          onClick={testFirebaseConnection}
          disabled={isLoading}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Retest Connection'}
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {debugInfo.length > 0 ? debugInfo.join('\n') : 'Click "Retest Connection" to start debugging...'}
        </pre>
      </div>
      
      {debugInfo.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Next steps if there are issues:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check Firestore security rules in Firebase Console</li>
            <li>Verify that the 'deeds' collection exists</li>
            <li>Check if composite index is needed for queries</li>
            <li>Ensure user has proper permissions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FirebaseDebug;
