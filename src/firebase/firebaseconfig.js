import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBxU3aFH4vWCy1WD_BBG4Y4bB6GCPbcOZQ",
  authDomain: "quickbite-56340.firebaseapp.com",
  projectId: "quickbite-56340",
  storageBucket: "quickbite-56340.firebasestorage.app",
  messagingSenderId: "262160280043",
  appId: "1:262160280043:web:b86ec3339334f3bce2d1ae",
  measurementId: "G-R8LSHD0TE6"
};

const app = initializeApp(firebaseConfig);

// ✅ Fix Firestore: activează cache și long polling
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
  experimentalForceLongPolling: true, // 🔧 evită erori WebChannel în PWA
});

const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, storage, auth };