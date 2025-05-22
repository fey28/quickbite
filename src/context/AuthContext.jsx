// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.uid) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        // ✅ întârziere pentru a evita conflict între Write și Listen
        await new Promise((res) => setTimeout(res, 1000));

        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        let data;

        if (!snap.exists()) {
          data = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Utilizator',
            role: 'user',
            verified: false,
            createdAt: serverTimestamp(),
          };
          await setDoc(ref, data);
        } else {
          data = snap.data();
        }

        setUserData(data);
      } catch (err) {
        console.warn('⚠️ Firestore error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user: userData, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
