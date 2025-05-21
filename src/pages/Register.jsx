import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // 🔧 default: utilizator
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: form.name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: form.name,
        email: form.email,
        role,
        verified: false,
        createdAt: serverTimestamp()
      });

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin-verification');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err) {
      alert('Eroare la înregistrare: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Creează un cont</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Nume complet" value={form.name} onChange={handleChange}
            required className="w-full border p-3 rounded-lg" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
            required className="w-full border p-3 rounded-lg" />
          <input type="password" name="password" placeholder="Parolă" value={form.password} onChange={handleChange}
            required className="w-full border p-3 rounded-lg" />

          {/* ✅ Selector de rol */}
          <div className="flex justify-between items-center text-sm text-gray-700 mt-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="user" checked={role === 'user'}
                onChange={() => setRole('user')} /> Utilizator
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="role" value="admin" checked={role === 'admin'}
                onChange={() => setRole('admin')} /> Administrator
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition">
            {loading ? 'Se creează...' : 'Creează cont'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Ai deja cont? <span onClick={() => navigate('/login')} className="text-orange-600 hover:underline cursor-pointer">Autentificare</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
