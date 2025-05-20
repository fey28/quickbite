// src/pages/Menu.jsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';

const mockProducts = [
  {
    name: 'Pizza Margherita',
    weight: '450g',
    price: 28,
    description: 'Clasică, cu mozzarella și busuioc',
    image: '/assets/pizza.jpg',
    category: 'Pizza'
  },
  {
    name: 'Pizza Quattro Formaggi',
    weight: '480g',
    price: 34,
    description: '4 tipuri de brânză',
    image: '/assets/pizza4.jpg',
    category: 'Pizza'
  },
  {
    name: 'Ciorbă de burtă',
    weight: '400ml',
    price: 22,
    description: 'Tradițională, acră cu smântână',
    image: '/assets/ciorba.jpg',
    category: 'Supe'
  },
  {
    name: 'Supă cremă de dovleac',
    weight: '300ml',
    price: 20,
    description: 'Cremă fină, dulce-picantă',
    image: '/assets/supa.jpg',
    category: 'Supe'
  }
];

function Menu() {
  const { restaurantId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('Pizza');
  const categories = [...new Set(mockProducts.map(p => p.category))];
  const filteredProducts = mockProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-6xl mx-auto text-primaryText">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-tomato">Meniu {restaurantId}</h2>
        <p className="text-secondaryText">Alege din preparatele disponibile:</p>
      </header>

      <CategoryTabs categories={categories} onSelect={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={index}
            {...product}
            onAdd={() => alert(`Ai adăugat ${product.name}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
