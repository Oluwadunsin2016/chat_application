import React, { useState, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import toastHook from "./hook.jsx";
import { initialToast } from "./toastUtils";

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4"
};

const slideInClasses = {
  "top-right": "animate-slideInRight",
  "top-left": "animate-slideInLeft",
  "bottom-right": "animate-slideInRight",
  "bottom-left": "animate-slideInLeft"
};

// const slideOutClasses = {
//   "top-right": "animate-slideOutRight",
//   "top-left": "animate-slideOutLeft",
//   "bottom-right": "animate-slideOutRight",
//   "bottom-left": "animate-slideOutLeft"
// };

const ToastContainer = () => {
  const [toast, setToast] = useState({});
  const [toastConfig, setToastConfig] = useState({ status: "", message: "", position: "" });
  const [show, setShow] = useState(false);

 
  
  useEffect(() => {
    initialToast(setToastConfig, setShow);
  }, []);

  useEffect(() => {
    if (toastConfig.status) {
      const { status, message, position } = toastConfig;
      
      // Get the appropriate toast function based on status
      const toastFunction = toastHook[status];
      
      if (toastFunction && typeof toastFunction === 'function') {
        const toastData = toastFunction(message, position);
        setToast(toastData);
      }
    }
  }, [toastConfig]);

  useEffect(() => {
    let timer;
    if (show) {
      timer = setTimeout(() => {
        setShow(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [show]);

  const selfClose = () => {
    setShow(false);
  };

  const positionClass = positionClasses[toast?.position] || positionClasses["bottom-right"];
  const slideInClass = slideInClasses[toast?.position] || slideInClasses["bottom-right"];

  return (
    <>
      {show && (
        <div 
          className={`fixed ${positionClass} z-50 transition-all duration-300 animate-fadeIn ${slideInClass}`}
        >
          <div 
            className={`flex items-start p-4 rounded-md shadow-lg min-w-[300px] max-w-md ${toast.backgroundColor} overflow-hidden relative`}
          >
                 <button
              onClick={selfClose}
              className="p-1 rounded-full text-white hover:bg-white/20 transition-all duration-300 focus:outline-none cursor-pointer absolute top-1 right-1"
            >
              <MdOutlineClose size={18} />
            </button>
            <div className="mr-3 text-xl text-white">
              {toast.icon}
            </div>
            <div className="flex-1 text-white">
              <p className="font-semibold">{toast.title}</p>
              <p className="text-sm mt-1">{toast.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToastContainer;