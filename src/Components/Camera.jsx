import { Check, RotateCcw } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import Webcam from "react-webcam";

const Camera = ({ setFile, setTakePicture }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef(null);
  
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "user",
  };

  const capture = useCallback(() => {
    setCapturedImage(cameraRef.current.getScreenshot());
  }, [cameraRef]);

  const upload = () => {
    setFile(capturedImage);
    setTakePicture(false);
  };

  const close = () => {
    setTakePicture(false);
  };

  const retake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white shadow-2xl overflow-hidden w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 text-gray-800">
          <h2 className="text-lg font-bold">Take Profile Picture</h2>
          <button 
            onClick={close}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Camera/Preview Area */}
        <div className="relative bg-black aspect-[4/3] flex items-center justify-center">
          {!capturedImage ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              )}
              
              <Webcam
                ref={cameraRef}
                className={`w-full h-full object-cover ${isLoading ? 'invisible' : 'visible'}`}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={() => setIsLoading(false)}
                onUserMediaError={() => setIsLoading(false)}
              />
            </>
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Controls */}
        <div className="px-4 py-2 bg-gray-50 flex flex-col items-center">
          {!capturedImage ? (
            <button
              onClick={capture}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform active:scale-95 shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center cursor-pointer">
                <BsCamera className="text-white text-2xl" />
              </div>
            </button>
          ) : (
            <div className="flex justify-center space-x-4 w-full">
              <button
                onClick={retake}
                className="flex-1 py-2 px-4 cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <RotateCcw size={16} />
                <span>Retake</span>
              </button>
              <button
                onClick={upload}
                className="flex-1 py-2 px-4 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <Check size={20} />
                <span>Use Photo</span>
              </button>
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-500 text-center">
            {!capturedImage 
              ? "Center your face and click the camera button" 
              : "Review your photo before uploading"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Camera;