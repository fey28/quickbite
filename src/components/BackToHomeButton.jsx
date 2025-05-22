// src/components/BackToHomeButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/', { replace: true })}
      className="fixed z-50 top-4 left-4 border border-orange-500 bg-white text-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-50 ease-linear px-4 py-2 rounded-md cursor-pointer text-base font-bold flex items-center"
      aria-label="Go to home page"
    >
      <ArrowLeft className="mr-2 w-6 h-6" />
      Home
    </button>
  );
}
