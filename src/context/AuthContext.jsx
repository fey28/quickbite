import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        // ⏳ opțional: întârziere pentru a evita conflict între write și read
        await new Promise((res) => setTimeout(res, 500));

        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserData(snap.data());
        } else {
          // fallback dacă nu există documentul în Firestore
          console.warn('⚠️ Documentul utilizator nu există în Firestore');
          setUserData({
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Utilizator',
            role: 'user',
            verified: false,
          });
        }
      } catch (err) {
        console.warn('⚠️ Eroare la citire Firestore:', err);
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
    <AuthContext.Provider value={{ user: userData, role: userData?.role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
