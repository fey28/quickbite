import { useParams } from 'react-router-dom';
import { useState } from 'react';

const mockMenu = [
  { id: 1, name: 'Pizza Margherita', price: 30, category: 'Pizza' },
  { id: 2, name: 'Pizza Quattro Formaggi', price: 35, category: 'Pizza' },
  { id: 3, name: 'Ciorbă de burtă', price: 22, category: 'Supe' },
  { id: 4, name: 'Supă cremă de dovleac', price: 20, category: 'Supe' },
  { id: 5, name: 'Paste Carbonara', price: 29, category: 'Paste' },
];

function RestaurantMock() {
  const { id } = useParams();
  const [category, setCategory] = useState('Pizza');
  const [cart, setCart] = useState([]);

  const categories = [...new Set(mockMenu.map((item) => item.category))];
  const filteredMenu = mockMenu.filter((item) => item.category === category);

  const addToCart = (item) => setCart((prev) => [...prev, item]);
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = () => {
    alert('Comanda a fost trimisă către bucătărie 🍽️!');
    setCart([]);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-orange-600">Comandă la {id}</h1>
        <p className="text-gray-600 text-sm">Scanează QR-ul de pe masă și comandă rapid de pe telefonul tău.</p>
      </header>

      {/* Categorii */}
      <div className="flex gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              cat === category ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meniu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {filteredMenu.map((item) => (
          <div key={item.id} className="border p-4 rounded-xl bg-white shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.price} RON</p>
            </div>
            <button
              onClick={() => addToCart(item)}
              className="mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Adaugă în coș
            </button>
          </div>
        ))}
      </div>

      {/* Coș de comandă */}
      {cart.length > 0 && (
        <div className="bg-gray-50 border-t pt-6">
          <h2 className="text-xl font-bold mb-2">Coșul tău</h2>
          <ul className="mb-2">
            {cart.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-800">
                {item.name} – {item.price} RON
              </li>
            ))}
          </ul>
          <p className="font-semibold">Total: {total} RON</p>
          <div className="mt-4 flex gap-2">
            <button onClick={handleOrder} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Trimite Comanda
            </button>
            <button onClick={clearCart} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Golește Coșul
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantMock;
