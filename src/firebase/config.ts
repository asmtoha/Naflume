import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrSgARBHnMQJtnY6oZCC8HXiwjoH4ndD4",
  authDomain: "naflume-82d76.firebaseapp.com",
  projectId: "naflume-82d76",
  storageBucket: "naflume-82d76.appspot.com",
  messagingSenderId: "397892732015",
  appId: "1:397892732015:web:5411196197446a440df99a",
  measurementId: "G-CPY65L6TYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };

export default app;
