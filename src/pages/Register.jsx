import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulează crearea contului
    console.log('Cont creat:', form, 'Rol:', role);

    if (role === 'admin') {
      navigate('/admin-verification');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Creează un cont</h2>
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
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Creează cont
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

export default Register;
