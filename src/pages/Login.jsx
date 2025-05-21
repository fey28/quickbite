import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulare login (în viitor vom adăuga backend)
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/restaurant/la-bunica'); // exemplu redirect client
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-500 text-center mb-6">Autentificare QuickBite</h1>

        {/* Selectare tip utilizator */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRole('client')}
            className={`px-4 py-2 rounded-full border transition ${
              role === 'client'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 border-orange-300'
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-4 py-2 rounded-full border transition ${
              role === 'admin'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 border-orange-300'
            }`}
          >
            Deținător Restaurant
          </button>
        </div>

        {/* Formular */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Parolă</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition"
          >
            Autentificare
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
