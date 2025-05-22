// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
      console.log('1. Creez utilizatorul...');
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log('2. Utilizator creat:', user.uid);

      // Așteaptă puțin pentru a preveni erori Firestore (Write conflict)
      await new Promise((res) => setTimeout(res, 150));

      const safeData = {
        uid: user.uid,
        name: form.name.trim() || 'Utilizator',
        email: form.email,
        role,
        createdAt: serverTimestamp(),
      };

      console.log('3. Salvez în Firestore...');
      await setDoc(doc(db, 'users', user.uid), safeData);
      await signOut(auth);

      // Redirect to home after successful registration
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Eroare detaliată:', error);

      let errorMessage = 'Eroare la creare cont: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage += 'Email-ul este deja folosit.';
          break;
        case 'auth/invalid-email':
          errorMessage += 'Email invalid.';
          break;
        case 'auth/weak-password':
          errorMessage += 'Parola trebuie să aibă minim 6 caractere.';
          break;
        default:
          errorMessage += error.message;
      }

      alert(errorMessage);
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

          {/* Selectare rol */}
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
            onClick={() => navigate('/login')}
            className="text-orange-600 font-medium hover:underline cursor-pointer"
          >
            Autentificare
          </span>
        </p>
      </div>
    </div>
  );
}
