import { useState } from 'react';

const mockProducts = [
  { id: 1, name: 'Pizza Margherita', price: 30 },
  { id: 2, name: 'Ciorbă de burtă', price: 22 },
  { id: 3, name: 'Paste Carbonara', price: 29 },
];

const mockOrders = [
  { id: 'ORD123', table: 5, items: ['Pizza Margherita', 'Ciorbă de burtă'], status: 'În curs' },
  { id: 'ORD124', table: 2, items: ['Paste Carbonara'], status: 'Servită' },
];

function Dashboard() {
  const [products] = useState(mockProducts);
  const [orders] = useState(mockOrders);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Panou Administrator</h1>

      {/* Produse */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Meniu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl p-4 shadow">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.price} RON</p>
              <button className="mt-2 text-orange-500 text-sm hover:underline">Editează</button>
            </div>
          ))}
        </div>
      </section>

      {/* Comenzi */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Comenzi Recente</h2>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
              <p className="text-sm font-semibold">Comandă #{o.id} - Masa {o.table}</p>
              <p className="text-sm text-gray-600">Produse: {o.items.join(', ')}</p>
              <p className="text-sm text-gray-500">Status: {o.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
