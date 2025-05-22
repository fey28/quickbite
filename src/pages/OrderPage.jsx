import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';

export default function OrderPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const snapshot = await getDoc(doc(db, 'restaurants', restaurantId));
        if (!mounted) return;
        if (snapshot.exists()) {
          setProducts(snapshot.data().menuItems || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [restaurantId]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory
  );
  const [cart, setCart] = useState([]);
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Se încarcă meniul…</p></div>;

  if (!products.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 px-4">
      <h1 className="text-2xl font-bold mb-2">Restaurant inexistent sau fără meniu.</h1>
      <button onClick={() => navigate('/')} className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">← Înapoi la homepage</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 max-w-6xl mx-auto font-sans">
      <button onClick={() => navigate('/')} className="mb-6 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">← Înapoi la homepage</button>
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-orange-600">Comandă la {restaurantId}</h2>
        <p className="text-gray-500">Selectează preparatele dorite și plasează comanda direct din aplicație.</p>
      </header>
      <CategoryTabs categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map((product, i) => <ProductCard key={i} {...product} onAdd={() => addToCart(product)} />)}
      </div>
      {cart.length > 0 && (
        <div className="mt-12 bg-orange-50 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Coșul tău</h3>
          <ul className="space-y-2">
            {cart.map((item, i) => <li key={i} className="flex justify-between border-b pb-1"><span>{item.name}</span><span className="font-semibold">{item.price} RON</span></li>)}
          </ul>
          <div className="flex justify-between mt-4 font-bold"><span>Total:</span><span>{total} RON</span></div>
          <button onClick={() => alert('Comanda a fost plasată!')} className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">Plasează comanda</button>
        </div>
      )}
    </div>
  );
}
