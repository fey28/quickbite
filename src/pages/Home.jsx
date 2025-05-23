import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeenSlider } from 'keen-slider/react';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import QRScanner from '../components/QRScanner';
import { searchPlace } from '../services/googleSearch';
import 'keen-slider/keen-slider.min.css';

function Home() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const allRestaurants = [
    { id: 'la-bunica', name: 'La Bunica', type: 'Românesc', img: '/assets/bunica.jpg', position: [44.4268, 26.1025] },
    { id: 'bella-italia', name: 'Bella Italia', type: 'Pizzerie', img: '/assets/bella-italia.png', position: [44.4372, 26.0979] },
    { id: 'sushi-zen', name: 'Sushi Zen', type: 'Japonez', img: '/assets/sushi-zen.png', position: [44.4295, 26.1158] },
    { id: 'casa-di-david', name: 'Casa di David', type: 'Fine Dining', img: '/assets/casadidavid.jpg', position: [44.4601, 26.0826] },
  ];

  const filteredRestaurants = query.trim()
    ? allRestaurants.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : allRestaurants;

  const handleLiveSearch = async () => {
    if (!query.trim()) return setSearchResult(null);

    try {
      const result = await searchPlace(query);
      setSearchResult({
        id: 'search-result',
        name: result.name,
        type: 'Rezultat Google',
        img: '',
        position: result.position,
      });
    } catch {
      setSearchResult(null);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleLiveSearch(), 700);
    return () => clearTimeout(timeout);
  }, [query]);

  const restaurantsToDisplay = [...filteredRestaurants];
  if (searchResult && !filteredRestaurants.find(r => r.id === 'search-result')) {
    restaurantsToDisplay.push(searchResult);
  }

  const [sliderRef] = useKeenSlider({ loop: true, slides: { perView: 3, spacing: 15 } });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 max-w-5xl mx-auto relative">
      {showScanner && (
        <QRScanner
          onResult={(link) => {
            setShowScanner(false);
            navigate(link);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Buton QR */}
      <button
        onClick={() => setShowScanner(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 flex items-center justify-center bg-orange-500 rounded-full shadow-lg hover:bg-orange-600"
      >
        <img src="/assets/qrcode.png" alt="Scan QR" className="w-10 h-10" />
      </button>

      {/* Buton Panou Admin */}
      {user?.role === 'admin' && (
        <button
          onClick={() => navigate('/dashboard')}
          className="fixed bottom-24 right-6 z-40 bg-orange-700 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-orange-800"
        >
          Panou Administrator
        </button>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">QuickBite</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-800">👋 Bun venit, {user.name}</span>
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin-orders')}
                  className="text-sm font-medium text-orange-600 hover:underline"
                >
                  Panou Comenzi
                </button>
              )}
              <button
                onClick={logout}
                className="text-sm font-medium text-orange-600 hover:underline"
              >
                Deconectare
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-orange-600 hover:underline"
              >
                Autentificare
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium text-orange-600 hover:underline"
              >
                Creare cont
              </button>
            </>
          )}
        </div>
      </header>

      {/* Search + Map */}
      <section className="mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută un restaurant sau o locație..."
          className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 mb-4"
        />
        <MapView restaurants={restaurantsToDisplay} />
      </section>

      {/* Restaurante Partenere */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-10 px-6 rounded-xl shadow-inner mb-12">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Restaurante Partenere</h2>
        <p className="text-gray-700 max-w-3xl mb-6">
          Colaborăm cu restaurante locale și de top pentru a-ți oferi o experiență culinară rapidă și rafinată.
        </p>

        <div ref={sliderRef} className="keen-slider">
          {allRestaurants.map((r, i) => (
            <div key={i} className="keen-slider__slide flex justify-center items-center">
              <img src={r.img} alt={r.name} className="w-32 aspect-square object-cover rounded-full shadow-md border-4 border-white" />
            </div>
          ))}
        </div>
      </section>

      {/* Descriere */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Revoluționează modul în care comanzi în restaurant</h2>
        <p className="text-gray-600 max-w-2xl leading-relaxed">
          QuickBite îți permite să comanzi rapid, direct de pe telefon, fără a mai aștepta un ospătar.
          Scanezi un cod QR aflat pe masă, accesezi meniul digital al restaurantului și plasezi comanda.
        </p>
      </section>
    </div>
  );
}

export default Home;
