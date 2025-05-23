import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';

function QRScanner({ onResult, onClose }) {
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initScanner = async () => {
      try {
        codeReader.current = new BrowserMultiFormatReader();

        // 🔒 iOS fix: delay înainte de activarea camerei
        await new Promise(res => setTimeout(res, 300));

        await codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result) => {
          if (result) handleResult(result.getText());
        });
      } catch (err) {
        console.error('❌ Eroare la inițializarea camerei:', err);
      }
    };

    initScanner();
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    try {
      codeReader.current?.reset();
      const tracks = videoRef.current?.srcObject?.getTracks() || [];
      tracks.forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch (e) {
      console.warn('⚠️ Eroare la oprirea camerei:', e);
    }
  };

  const handleResult = (text) => {
    stopCamera();

    const baseUrl = 'https://quickbite-56340.web.app';
    if (!text.startsWith(baseUrl)) {
      console.warn('🔐 Cod QR invalid:', text);
      return;
    }

    const path = text.substring(baseUrl.length) || '/';
    navigate(path);
    onResult?.(path);
  };

  const handleClose = () => {
    stopCamera();
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={handleClose}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative w-80 h-80 border-4 border-white rounded-xl z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-scan" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-6 right-6 bg-white text-orange-600 px-4 py-2 rounded-xl z-20 hover:bg-orange-100"
      >
        Închide scanner-ul
      </button>
    </div>
  );
}

export default QRScanner;
