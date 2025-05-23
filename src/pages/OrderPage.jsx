import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockRestaurants } from '../data/mockRestaurants';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';
import { db } from '../firebase/firebaseconfig';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function OrderPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartMap, setCartMap] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const rest = mockRestaurants.find(r => r.id === restaurantId);
    setRestaurant(rest || null);
    setProducts(rest?.menuItems || []);
    setCartMap({});
  }, [restaurantId]);

  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    if (categories.length && !selectedCategory) setSelectedCategory(categories[0]);
  }, [categories, selectedCategory]);

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  const addToCart = item => {
    setCartMap(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return { ...prev, [item.id]: { item, quantity: prevQty + 1 } };
    });
  };
  const removeOne = id => {
    setCartMap(prev => {
      const entry = prev[id];
      if (!entry) return prev;
      const newQty = entry.quantity - 1;
      if (newQty > 0) {
        return { ...prev, [id]: { item: entry.item, quantity: newQty } };
      } else {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
    });
  };
  const removeAll = id => {
    setCartMap(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const groupedCart = useMemo(() => Object.values(cartMap), [cartMap]);
  const totalItems = groupedCart.reduce((sum, e) => sum + e.quantity, 0);
  const totalPrice = groupedCart.reduce((sum, e) => sum + e.item.price * e.quantity, 0);

  const checkout = async () => {
    if (!totalItems || !user) return alert('Trebuie să fii autentificat și să ai produse în coș.');

    const orderData = {
      userId: user.uid,
      restaurantId,
      items: groupedCart.map(e => ({
        id: e.item.id,
        name: e.item.name,
        price: e.item.price,
        quantity: e.quantity
      })),
      total: totalPrice,
      status: 'se prepară',
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
    } catch (e) {
      console.error('Eroare la plasarea comenzii:', e);
    }

    setCartMap({});
  };

  useEffect(() => {
    if (!orderId) return;

    const q = query(collection(db, 'orders'), where('__name__', '==', orderId));
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'finalizată') {
          setOrderId(null);
          setOrderStatus(null);
          setSuccessMessage('✅ Comanda a fost finalizată cu succes!');
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setSuccessMessage('');
          }, 4000);
        } else {
          setOrderStatus(data.status);
        }
      });
    });

    return () => unsub();
  }, [orderId]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-800">Restaurant inexistent.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-6 bg-orange-500 text-white px-4 py-2 rounded-lg">
        ← Înapoi
      </button>

      <h2 className="text-3xl font-bold text-orange-600 mb-2">
        Comandă la {restaurant.name}
      </h2>

      {orderStatus && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-2 mb-4 transition-all">
          Status comandă: <strong>{orderStatus}</strong>
        </div>
      )}

      {successMessage && (
        <div className={`transition-opacity duration-500 ease-in-out px-4 py-2 mb-4 rounded-md border
          ${showSuccess ? 'opacity-100 bg-green-100 border-green-300 text-green-800' : 'opacity-0'}
        `}>
          {successMessage}
        </div>
      )}

      <CategoryTabs
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            weight={product.weight}
            imagePath={product.imagePath}
            onAdd={() => addToCart(product)}
          />
        ))}
      </div>

      {/* Coș */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-orange-600 mb-4">
          Coșul tău ({totalItems})
        </h3>
        {totalItems === 0 ? (
          <p className="text-gray-500">Coșul este gol.</p>
        ) : (
          <div className="bg-orange-50 p-6 rounded-xl shadow-md">
            <ul className="space-y-2 mb-4">
              {groupedCart.map(({ item, quantity }) => (
                <li key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{item.name}</span>{' '}
                  <span>({item.weight})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeOne(item.id)}
                    className="bg-gray-200 px-2 rounded"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gray-200 px-2 rounded"
                  >
                    +
                  </button>
                  <span className="font-semibold">
                    {item.price * quantity} RON
                  </span>
                  <button
                    onClick={() => removeAll(item.id)}
                    className="text-red-500 hover:underline text-sm ml-4"
                  >
                    Șterge tot
                  </button>
                </div>
              </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold mb-4">
              <span>Total:</span>
              <span>{totalPrice} RON</span>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Finalizează comanda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
