// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useGetLoginUser } from '../api/authMutation';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../main';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from 'react-icons/io5';
import { useChatStore } from '../store/useChatStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error } = useGetLoginUser();
  const [authUser, setAuthUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
   const [groupMode, setGroupMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const {onlineUsers} = useChatStore();

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle authentication state
  useEffect(() => {
    if (data?.data) {
      setAuthUser(data.data);
    }

    console.log("errorCode:", error?.response?.status);
    
    // If token is expired or invalid (check if API returned 401 or use any custom error shape)
    if (error?.response?.status === 401) {
      logout();
    }
  }, [data, error]);

  // Handle network status changes
  useEffect(() => {
    if (!isOnline) {
      navigate('/offline', { state: { from: location.pathname } });
    } else {
      // If we come back online, try to return to the original page
      if (location.pathname === '/offline' && location.state?.from) {
        navigate(location.state.from);
      }
    }
  }, [isOnline, navigate, location]);

  const logout = () => {
    if (authUser) {
      socket.emit('userLoggedOut', authUser._id);
    }
    setAuthUser(null);
    setCurrentChat(null);
    localStorage.removeItem('chatToken');
    sessionStorage.removeItem('currentChat');
    navigate('/login');
  };

  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
    sessionStorage.setItem('currentChat', JSON.stringify(chat));
  };
  const handleGroupMode = (mode) => {
    setGroupMode(mode);
    sessionStorage.setItem('groupMode',JSON.stringify(mode));
  };
  
  useEffect(() => {
    const rawChat = sessionStorage.getItem('currentChat');
    const chat = rawChat && rawChat !== "undefined" ? JSON.parse(rawChat) : null;
    setCurrentChat(chat);
  
    const mode = sessionStorage.getItem('groupMode');
    console.log("mode:",mode);
    
    setGroupMode(mode !== "undefined" && mode !== null ? JSON.parse(mode) : false);
  }, []);


   const getMessageStatus = (message,chatId) => {
     const isRead = !message?.unreadBy?.includes(chatId);
     
     const isRecipientOnline = onlineUsers?.includes(chatId);
 
     if (isRead) return "read";
     if (isRecipientOnline) return "delivered"; // was online after message sent
     return "sent";
   };
 
   const renderStatusIcon = (status) => {
     switch (status) {
       case "read":
         return <IoCheckmarkDoneSharp size={18} className="text-blue-400 ml-1" />;
       case "delivered":
         return <IoCheckmarkDoneSharp size={18} className="text-gray-300 ml-1" />;
       case "sent":
       default:
         return <IoCheckmarkSharp size={18} className="text-gray-300 ml-1" />;
     }
   };

  return (
    <AuthContext.Provider 
      value={{ 
        authUser, 
        setAuthUser, 
        isLoading, 
        logout, 
        handleCurrentChat,
        handleGroupMode,
        renderStatusIcon,
        getMessageStatus,
        currentChat,
        groupMode,
        isOnline
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);