import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// ✅ Inițializare context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔔 FCM
  const messaging = getMessaging();

  const requestPermissionAndSaveToken = async (userId) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BIGevLJRyLQwNAb_bUSgmuulF_cd-aZYD4_Qk9xvHsaiKyE2mXHYCWQttcpeilVLdF24tFDuBCs_nK9pbil4e6w'
        });
        if (token) {
          await setDoc(doc(db, 'fcmTokens', userId), { token });
          console.log('✅ Token FCM salvat:', token);
        }
      } else {
        console.warn('🔕 Permisiunea pentru notificări a fost refuzată.');
      }
    } catch (err) {
      console.error('❌ Eroare la cererea permisiunii FCM:', err);
    }
  };

  // 🔔 Primi notificări în timp real (opțional)
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('📨 Notificare primită:', payload);
      alert(`📨 ${payload.notification?.title}`);
    });
  }, []);

  // 🔐 Monitorizare autentificare
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        let data;
        if (snap.exists()) {
          data = snap.data();
        } else {
          data = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'Utilizator',
            role: 'user',
            verified: false,
          };
          await setDoc(ref, data);
        }

        setUserData(data);

        // ✅ Solicită permisiune pentru FCM și salvează tokenul
        await requestPermissionAndSaveToken(user.uid);

      } catch (err) {
        console.warn('⚠️ Eroare Firestore:', err);
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
