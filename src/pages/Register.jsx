/**
 * src/pages/Register.jsx
 *
 * Updated Register page without <body> wrapper and using BackToHomeButton.
 * Ensure your firebaseconfig.js initializes Firestore with long polling to fix gRPC errors:
 * 
 * import { initializeApp } from 'firebase/app';
 * import { initializeFirestore } from 'firebase/firestore';
 * const app = initializeApp(firebaseConfig);
 * export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';
import BackToHomeButton from '../components/BackToHomeButton';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const safeData = {
        uid: user.uid,
        name: form.name,
        email: form.email,
        role,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), safeData);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      alert('Eroare la creare cont: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <BackToHomeButton />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Creează un cont
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nume complet"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Parolă"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />

          <div className="flex justify-between items-center text-sm text-gray-700 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={() => setRole('user')}
              />
              Utilizator
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={() => setRole('admin')}
              />
              Administrator
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
          >
            {loading ? 'Se creează contul...' : 'Creează cont'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Ai deja un cont?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-orange-600 font-medium hover:underline cursor-pointer"
          >
            Autentificare
          </span>
        </p>
      </div>
    </div>
  );
}
