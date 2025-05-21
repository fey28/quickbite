import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/firebaseconfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AdminDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user]);

  useEffect(() => {
    const checkVerification = async () => {
      if (user?.role === 'admin') {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setVerified(data.verified === true);
        }
      }
    };

    checkVerification();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);

      const storageRef = ref(storage, `admin-verification/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', user.uid), {
        verified: true,
        documentURL: downloadURL,
      });

      setVerified(true);
      alert('Document încărcat și verificare completă ✅');
    } catch (err) {
      alert('Eroare la încărcare: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) return <p className="p-6 text-center text-gray-500">Se încarcă...</p>;

  if (user.role !== 'admin') return <p className="p-6 text-center text-red-500">Acces restricționat.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Dashboard Administrator</h2>

        {verified ? (
          <p className="text-green-600 font-semibold text-center">Contul tău este verificat ✅</p>
        ) : (
          <>
            <p className="text-gray-700 mb-4 text-center">
              Pentru a activa contul de administrator, te rugăm să încarci un document de verificare (ex: act de identitate sau certificat firmă).
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
              >
                {uploading ? 'Se încarcă...' : 'Trimite spre verificare'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
