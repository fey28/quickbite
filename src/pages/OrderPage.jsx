import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryTabs from '../components/CategoryTabs';

const mockProducts = [
  {
    name: 'Pizza Margherita',
    weight: '450g',
    price: 28,
    description: 'Clasică, cu mozzarella și busuioc',
    image: '/assets/pizza.jpg',
    category: 'Pizza',
  },
  {
    name: 'Pizza Quattro Formaggi',
    weight: '480g',
    price: 34,
    description: '4 tipuri de brânză',
    image: '/assets/pizza4.jpg',
    category: 'Pizza',
  },
  {
    name: 'Ciorbă de burtă',
    weight: '400ml',
    price: 22,
    description: 'Tradițională, cu smântână',
    image: '/assets/ciorba.jpg',
    category: 'Supe',
  },
  {
    name: 'Supă cremă de dovleac',
    weight: '300ml',
    price: 20,
    description: 'Cremă fină, dulce-picantă',
    image: '/assets/supa.jpg',
    category: 'Supe',
  },
];

function OrderPage() {
  const { restaurantId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('Pizza');
  const [cart, setCart] = useState([]);

  const categories = [...new Set(mockProducts.map((p) => p.category))];
  const filteredProducts = mockProducts.filter((p) => p.category === selectedCategory);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-orange-600">Comandă la {restaurantId}</h2>
        <p className="text-gray-500">Selectează preparatele dorite și plasează comanda direct din aplicație.</p>
      </header>

      {/* Categorii */}
      <CategoryTabs categories={categories} onSelect={setSelectedCategory} />

      {/* Meniu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map((product, i) => (
          <ProductCard key={i} {...product} onAdd={() => addToCart(product)} />
        ))}
      </div>

      {/* Coș comenzi */}
      {cart.length > 0 && (
        <div className="mt-10 bg-orange-50 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">Coșul tău</h3>
          <ul className="space-y-2">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>{item.name}</span>
                <span className="font-semibold">{item.price} RON</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 font-bold">
            <span>Total:</span>
            <span>{total} RON</span>
          </div>
          <button
            onClick={() => alert('Comanda a fost plasată!')}
            className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Plasează comanda
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderPage;
