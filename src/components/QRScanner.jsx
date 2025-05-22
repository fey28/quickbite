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
        const reader = new BrowserMultiFormatReader();
        codeReader.current = reader;

        await reader.decodeFromVideoDevice(null, videoRef.current, (result) => {
          if (result) {
            handleResult(result.getText());
          }
        });
      } catch (error) {
        console.error('Eroare la inițializarea camerei:', error);
      }
    };

    initScanner();
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    try {
      codeReader.current?.reset();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (e) {
      console.warn('Stop camera error:', e);
    }
  };

  const handleResult = (text) => {
    stopCamera();

    const baseUrl = 'https://quickbite-d6f77.web.app';

    // Only allow URLs from our domain
    if (!text.startsWith(baseUrl)) {
      console.warn('Scanned URL is not allowed:', text);
      return;
    }

    // Extract path after the domain
    const path = text.substring(baseUrl.length) || '/';

    // Navigate within the app
    navigate(path);
    onResult?.(path);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={handleClose}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
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
