import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';

import { ArrowLeft } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // 🔍 Obține datele din Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        alert('Contul nu are date asociate.');
        return;
      }

      const userData = userDoc.data();

      // 🔁 Redirecționează în funcție de rol
      if (userData.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      alert('Eroare la autentificare: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <body className="overflow-hidden">{
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Autentificare</h2>
      <button
      type="button"
      onClick={() => navigate('/', { replace: true })}
      className="fixed z-50 top-4 left-4 border border-orange-500 bg-white text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-50 ease-linear px-4 py-2 rounded-md cursor-pointer text-base font-bold flex items-center"
      aria-label="Go to home page"
    >
      <ArrowLeft className="mr-2 w-6 h-6" />
      Home
    </button>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
          >
            {loading ? 'Se conectează...' : 'Autentificare'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Nu ai cont?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-orange-600 font-medium hover:underline cursor-pointer"
          >
            Creează cont
          </span>
        </p>
      </div>
    </div>}
    </body>
  );
}

export default Login;
