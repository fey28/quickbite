// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB6mkHtdKTQdgnvu_CdR_NlpgNBkX-teUs",
  authDomain: "quickbite-d6f77.firebaseapp.com",
  projectId: "quickbite-d6f77",
  storageBucket: "quickbite-d6f77.appspot.com",
  messagingSenderId: "298143433690",
  appId: "1:298143433690:web:8bd85c9ecdf326d40c36e3",
  measurementId: "G-QVCWK5G7PX"
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
