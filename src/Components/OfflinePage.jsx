// src/pages/OfflinePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaWifi, FaArrowLeft, FaSync } from 'react-icons/fa';
import AuthBackground from './shared/AuthBackground';

const OfflinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  // Check network status and redirect when online
  useEffect(() => {
    const checkNetworkAndRedirect = () => {
      if (navigator.onLine) {
        setIsRedirecting(true);
        
        // Start countdown before redirecting
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              navigate(location.state?.from || '/', { replace: true });
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(countdownInterval);
      }
    };

    // Check immediately on mount
    checkNetworkAndRedirect();
    
    // Set up event listener for online events
    window.addEventListener('online', checkNetworkAndRedirect);
    
    return () => {
      window.removeEventListener('online', checkNetworkAndRedirect);
    };
  }, [navigate, location.state]);

  const handleRetry = () => {
    if (navigator.onLine) {
      navigate(location.state?.from || '/');
    }
  };

  return (
    <AuthBackground >
        <div className='h-full w-full flex items-center justify-center p-6'>

      <div className="max-w-xl w-full backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
          <FaWifi className="text-red-400 text-4xl" />
        </div>
        
        {isRedirecting ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Connection Restored!</h1>
            <p className="text-gray-300 mb-6">
              Redirecting back to your page in {countdown} seconds...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin">
                <FaSync className="text-green-400 text-3xl" />
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">You're Offline</h1>
            <p className="text-gray-300 mb-6">
              Please check your internet connection. We'll automatically 
              reconnect you when the network is back.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center cursor-pointer gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Retry Connection
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center cursor-pointer gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <FaArrowLeft /> Go Home
              </button>
            </div>
          </>
        )}
      </div>
        </div>
    </AuthBackground>
  );
};

export default OfflinePage;