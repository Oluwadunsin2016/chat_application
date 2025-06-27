import React from "react";
import { MdOutlineClose } from "react-icons/md";
import "animate.css";

const ImageView = ({ setViewProfilePicture, currentUser }) => {
  const closeViewImage = () => {
    const imageContainer = document.querySelector(".image-container");
    imageContainer.classList.remove("animate__zoomIn");
    imageContainer.classList.add("animate__zoomOut");
    
    setTimeout(() => {
      setViewProfilePicture(false);
      // Reset animation classes for next open
      imageContainer.classList.remove("animate__zoomOut");
      imageContainer.classList.add("animate__zoomIn");
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      // onClick={closeViewImage}
    >
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center">
        <div className="image-container animate__animated animate__zoomIn flex flex-col items-center">
          {/* Close button */}
          
          {/* User info */}
          {/* <div className="mb-4 text-center text-white bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <p className="text-lg font-semibold truncate max-w-xs">
              {currentUser?.userName || "User Profile"}
            </p>
          </div> */}
          
          {/* Image */}
          <div className="relative overflow-hidden rounded-xl shadow-2xl border-2 border-white/60">
            <img
              className="max-w-full max-h-[70vh] object-contain cursor-pointer"
              src={currentUser?.profileImage}
              alt={`${currentUser?.userName || "User"}'s profile`}
              onClick={(e) => e.stopPropagation()}
            />
                 <button
            onClick={closeViewImage}
            className="absolute !top-1 !right-1 z-20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110 cursor-pointer"
            aria-label="Close image viewer"
          >
            <MdOutlineClose size={24} />
          </button>
            {/* Loading shimmer effect */}
            {!currentUser?.profileImage && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 animate-pulse flex items-center justify-center">
                <span className="text-white/50">Loading image...</span>
              </div>
            )}
          </div>
          
          {/* Hint text */}
          <p className="mt-4 text-white/70 text-sm animate-pulse">
            Click the icon to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
