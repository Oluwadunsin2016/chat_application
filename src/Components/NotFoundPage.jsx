// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import AuthBackground from './shared/AuthBackground';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <AuthBackground>
        <div className='h-full w-full flex items-center justify-center p-6'>
      <div className="max-w-xl w-full backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
        <div className="text-9xl font-bold text-white/40 mb-4">404</div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 cursor-pointer rounded-lg transition-colors"
          >
            <FaArrowLeft /> Go Back
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 cursor-pointer rounded-lg transition-colors"
          >
            <FaHome /> Home
          </Link>
        </div>
      </div>   
        </div>
    </AuthBackground>
  );
};

export default NotFoundPage;