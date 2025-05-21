import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

function QRScanner({ onResult, onClose }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result) {
        handleResult(result.getText());
      }
    });

    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (codeReader.current) codeReader.current.reset();
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    // 🛑 Așteaptă puțin și apoi închide componenta vizual
    setTimeout(() => {
      onClose();
    }, 100); // mic delay pentru a permite resetarea completă
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative w-80 h-80 border-4 border-white rounded-xl z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-scan" />
      </div>
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 bg-white text-orange-600 px-4 py-2 rounded-xl z-20 hover:bg-orange-100"
      >
        Închide scanner-ul
      </button>
    </div>
  );
}

export default QRScanner;
