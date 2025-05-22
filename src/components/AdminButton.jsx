// src/components/AdminButton.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminButton() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading || !user || user.role !== 'admin') return null;

  return (
    <button
      onClick={() => navigate('/admin')}
      className="fixed bottom-6 left-6 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition z-50"
    >
      Admin Dashboard
    </button>
  );
}

export default AdminButton;
