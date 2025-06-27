// src/components/FullPageLoader.jsx
import React, { useEffect, useState } from 'react';
import AuthBackground from './shared/AuthBackground';

const styles = `
@keyframes progress {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }
  51% {
    transform-origin: right;
  }
  100% {
    transform: scaleX(0);
    transform-origin: right;
  }
}

.animate-progress {
  animation: progress 1.8s infinite ease-in-out;
}
`;

const FullPageLoader = () => {
const [dots, setDots] = useState("");
      useEffect(() => {
        const interval = setInterval(() => {
          setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);
      
        return () => clearInterval(interval);
      }, []);
  return (
    <AuthBackground>
        <style>{styles}</style>
     <div className='w-full h-full flex flex-col items-center justify-center'>
     <div className="w-full max-w-md px-4 z-10">
        <div className="h-1 md:h-1.5 bg-gray-300 rounded-full overflow-hidden">
        <div 
            className="h-full bg-gradient-to-r from-green-500 to-orange-500 rounded-full animate-progress"
          ></div>
        </div>
        <p className="mt-2 text-center text-indigo-200 md:text-lg font-medium">
          Loading your messages{dots}
        </p>
      </div>
     </div>
    </AuthBackground>
  );
};

export default FullPageLoader;