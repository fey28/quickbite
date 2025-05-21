// src/services/firestoreService.js
import { db } from '../firebase/firebaseconfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function saveUserToFirestore(uid, userData) {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log('✅ Utilizator salvat în Firestore');
  } catch (err) {
    console.error('❌ Eroare salvare Firestore:', err.message);
  }
}
