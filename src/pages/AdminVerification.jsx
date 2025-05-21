import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../firebase/firebaseconfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function AdminVerification() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Te rugăm să încarci un document!');
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert('Trebuie să fii autentificat pentru a trimite un document.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // Upload în Firebase Storage
      const fileRef = ref(storage, `verificari/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);

      const fileURL = await getDownloadURL(fileRef);

      // Salvare în Firestore
      await addDoc(collection(db, 'verificariAdmini'), {
        uid: user.uid,
        email: user.email,
        documentURL: fileURL,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      alert('Documentul a fost trimis pentru verificare!');
      navigate('/');
    } catch (err) {
      console.error('Eroare la încărcare:', err);
      alert('A apărut o eroare. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Verificare Administrator</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Încarcă un document pentru a fi verificat ca administrator.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 p-3 rounded-lg file:bg-orange-100 file:text-orange-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {loading ? 'Se trimite...' : 'Trimite pentru verificare'}
          </button>
        </form>

        <button
          onClick={() => navigate('/register')}
          className="mt-4 w-full text-sm text-orange-600 hover:underline"
        >
          ← Înapoi la înregistrare
        </button>
      </div>
    </div>
  );
}

export default AdminVerification;
