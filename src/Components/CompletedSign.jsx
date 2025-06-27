import React, { useEffect, useState } from "react";

export const CompletedSign = ({ setIsUploading, setIsCompleted }) => {
  const [completeStatus, setCompleteStatus] = useState(false);

  useEffect(() => {
    setCompleteStatus(true);
    setTimeout(() => {
      setCompleteStatus(false);
      setIsUploading(false);
      setIsCompleted(false);
    }, 2000);
  }, []);

  return (
   <>
   { completeStatus && 
    <div className="absolute inset-0 flex items-center justify-center z-50 transition-opacity duration-500">
    {/* Animated background circle */}
    <div className="absolute !w-[15rem] h-[15rem] bg-green-500 rounded-full animate-ping opacity-10"></div>
    
    {/* Main checkmark container */}
    <div className="relative flex items-center justify-center w-[10rem] h-[10rem] bg-green-500 rounded-full shadow-xl">
      {/* Animated checkmark */}
      <svg 
        className="w-22 h-22 text-white" 
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      >
        <path 
          className="path"
          d="M5 13l4 4L19 7" 
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 24,
            strokeDashoffset: 24,
            animation: 'draw 0.5s ease-out forwards 0.2s'
          }}
        />
      </svg>
    </div>
    
    {/* Style tag for the animation */}
    <style jsx>{`
      @keyframes draw {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>
  </div>
  }
   </>
  );
};