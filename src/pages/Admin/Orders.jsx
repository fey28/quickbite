import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';
import { useAuth } from '../../context/AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'orders'),
      where('restaurantId', '==', 'la-pizzerie') // ← înlocuiește cu restaurantul tău real
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(fetched);
    });

    return () => unsubscribe();
  }, [user]);

  const markCompleted = async (orderId) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'finalizată'
    });
    alert('✅ Comanda a fost marcată ca finalizată.');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Comenzi Live</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Nu există comenzi active.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="bg-white rounded-lg shadow p-4">
              <p className="font-bold text-gray-800 mb-2">Comandă #{order.id}</p>
              <ul className="mb-2 space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item.quantity}x {item.name} – {item.price * item.quantity} RON
                  </li>
                ))}
              </ul>
              <p className="text-right font-bold text-green-600">Total: {order.total} RON</p>
              <p className="text-sm text-gray-500">Status: <strong>{order.status}</strong></p>

              {order.status?.trim().toLowerCase() === 'se prepară' && (
  <button
    onClick={() => markCompleted(order.id)}
    className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    Marchează ca finalizată
  </button>
)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
