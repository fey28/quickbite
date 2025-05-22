import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import BackToHomeButton from '../components/BackToHomeButton';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [restaurantName, setRestaurantName] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [itemForm, setItemForm] = useState({
    name: '', description: '', price: '', weight: '', category: '', imagePath: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchMenu() {
      if (!user || user.role !== 'admin' || !restaurantId) {
        setLoadingData(false);
        return;
      }
      try {
        const { data } = await axios.get(`/api/restaurants/${restaurantId}`);
        const items = data.menuItems || [];
        setRestaurantName(data.name || '');
        setMenuItems(items);
        setCategories([...new Set(items.map(i => i.category))]);
      } catch (err) {
        console.error(err);
        setError('Nu s-a putut încărca meniul');
      } finally {
        setLoadingData(false);
      }
    }
    fetchMenu();
  }, [user, restaurantId]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await axios.post(`/api/restaurants/${restaurantId}/categories`, { category: newCategory });
      setCategories(prev => [...prev, newCategory]);
      setNewCategory('');
    } catch (err) {
      console.error(err);
      setError('Eroare la adăugarea categoriei');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = e => {
    const { name, value } = e.target;
    setItemForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const uniqueId = Date.now().toString();
      const payload = {
        id: uniqueId,
        ...itemForm,
        price: parseFloat(itemForm.price)
      };
      const { data } = await axios.post(`/api/restaurants/${restaurantId}/menuItems`, payload);
      setMenuItems(prev => [...prev, data.menuItem]);
      if (!categories.includes(data.menuItem.category)) {
        setCategories(prev => [...prev, data.menuItem.category]);
      }
      setItemForm({ name: '', description: '', price: '', weight: '', category: '', imagePath: '' });
    } catch (err) {
      console.error(err);
      setError('Eroare la adăugarea produsului');
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantNameChange = async () => {
    try {
      await axios.put(`/api/restaurants/${restaurantId}`, { name: restaurantName });
    } catch (err) {
      console.error('Eroare la actualizarea numelui restaurantului');
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Se încarcă datele...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 text-center text-red-500">
        Acces restricționat. Această pagină este doar pentru administratori.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackToHomeButton />
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        Panou Administrator
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Restaurant Info + QR */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Numele restaurantului</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleRestaurantNameChange}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Salvează
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">ID Restaurant: <span className="font-mono text-sm">{restaurantId}</span></p>
        <div className="w-32">
          <QRCodeCanvas value={`${window.location.origin}/order/${restaurantId}`} size={128} />
          <p className="text-xs text-center mt-2">Scanează pentru meniu</p>
        </div>
      </section>

      {/* Add Category */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Adaugă categorie nouă</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Nume categorie"
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleAddCategory}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Adaugă
          </button>
        </div>
      </section>

      {/* Add Menu Item */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Adaugă articol în meniu</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <input name="name" value={itemForm.name} onChange={handleItemChange} placeholder="Denumire" required className="w-full border p-2 rounded" />
          <textarea name="description" value={itemForm.description} onChange={handleItemChange} placeholder="Descriere" required className="w-full border p-2 rounded" />
          <input name="price" type="number" value={itemForm.price} onChange={handleItemChange} placeholder="Preț" required className="w-full border p-2 rounded" />
          <input name="weight" value={itemForm.weight} onChange={handleItemChange} placeholder="Greutate (ex: 200g)" required className="w-full border p-2 rounded" />
          <input name="imagePath" value={itemForm.imagePath} onChange={handleItemChange} placeholder="URL Imagine" className="w-full border p-2 rounded" />
          <select name="category" value={itemForm.category} onChange={handleItemChange} required className="w-full border p-2 rounded">
            <option value="" disabled>Selectează categorie</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Adaugă articol
          </button>
        </form>
      </section>

      {/* Existing Menu */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Articole existente în meniu</h2>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id} className="border-b pb-2">
              <strong>{item.name}</strong> ({item.category}) - {item.price} RON
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;