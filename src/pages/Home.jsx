// src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const restaurants = [
    { id: 'la-bunica', name: 'La Bunica', type: 'Românesc', img: '/assets/bunica.jpg' },
    { id: 'bella-italia', name: 'Bella Italia', type: 'Pizzerie', img: '/assets/italia.jpg' },
    { id: 'sushi-zen', name: 'Sushi Zen', type: 'Japonez', img: '/assets/sushi.jpg' },
  ];

  const handleSearch = () => {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-orange-500 tracking-tight">QuickBite</h1>
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-orange-600 hover:underline"
        >
          Autentificare
        </button>
      </header>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută mâncare sau local..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />
        <button
          onClick={handleSearch}
          className="mt-3 w-full bg-orange-500 text-white font-semibold py-2 rounded-xl hover:bg-orange-600 transition"
        >
          Caută
        </button>
        <button
          onClick={() => alert('Funcția GPS în curând')}
          className="mt-2 w-full text-sm text-gray-500 hover:underline"
        >
          Caută aproape de mine
        </button>
      </div>

      {/* Restaurante populare */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Restaurante populare</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {restaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/menu/${r.id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img src={r.img} alt={r.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <p className="text-sm text-gray-500">{r.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Produse speciale */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Oferte Speciale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Burger Angus', loc: 'The Grill Spot', price: '36 RON', img: '/assets/burger.jpg' },
            { name: 'Paste Carbonara', loc: 'Bella Italia', price: '29 RON', img: '/assets/pasta.jpg' }
          ].map((p, i) => (
            <div key={i} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.loc}</p>
                <span className="text-orange-600 font-bold">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
