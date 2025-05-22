import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockRestaurants } from '../data/mockRestaurants';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';

export default function OrderPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Change cart to an object map: { [id]: { item, quantity } }
  const [cartMap, setCartMap] = useState({});

  useEffect(() => {
    setLoading(true);
    const rest = mockRestaurants.find(r => r.id === restaurantId);
    setRestaurant(rest || null);
    setProducts(rest?.menuItems || []);
    setCartMap({});
    setLoading(false);
  }, [restaurantId]);

  // Build categories
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))],
    [products]
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    if (categories.length && !selectedCategory) setSelectedCategory(categories[0]);
  }, [categories, selectedCategory]);
  const filteredProducts = products.filter(p => p.category === selectedCategory);

  // Cart actions using cartMap
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
        // remove key
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

  // Derive grouped array and total
  const groupedCart = useMemo(() => Object.values(cartMap), [cartMap]);
  const totalItems = groupedCart.reduce((sum, e) => sum + e.quantity, 0);
  const totalPrice = groupedCart.reduce((sum, e) => sum + e.item.price * e.quantity, 0);

  const checkout = () => {
    if (!totalItems) return alert('Coșul este gol!');
    alert(
      `Ai comandat ${totalItems} produse (total ${totalPrice} RON). Mulțumim!`
    );
    setCartMap({});
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Se încarcă meniul…</p>
      </div>
    );

  if (!restaurant)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 px-4">
        <h1 className="text-2xl font-bold mb-2">
          Restaurant inexistent sau fără meniu.
        </h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          ← Înapoi la homepage
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 max-w-6xl mx-auto font-sans">
      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        ← Înapoi la homepage
      </button>

      <header className="mb-6">
        <h2 className="text-3xl font-bold text-orange-600">
          Comandă la {restaurant.name}
        </h2>
        <p className="text-gray-500">
          Selectează preparatele dorite și plasează comanda direct din aplicație.
        </p>
      </header>

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

      {/* Cart & Checkout */}
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
            <div className="flex justify-between mb-4 font-bold">
              <span>Total:</span>
              <span>{totalPrice} RON</span>
            </div>
            <button
              onClick={checkout}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Finalizează comanda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
