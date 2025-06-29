// src/hooks/useSocketEvents.js
import { useEffect } from 'react';
import socket from '../main';
import { useAuth } from '../contex/authContex';
import { useChatStore } from '../store/useChatStore';
import { useQueryClient } from '@tanstack/react-query';

const useSocketEvents = () => {
  const { authUser } = useAuth();
  const queryClient = useQueryClient();
  const {
    getPrivateMessages,
    getGroupMessages,
    setOnlineUsers,
    addTypingUser,
    removeTypingUser,
  } = useChatStore();

  useEffect(() => {
    if (!authUser) return;
    // socket.emit('currentlyOnline', authUser._id);
    if (authUser) {
      socket.emit('currentlyOnline', authUser._id);
    } else {
      socket.disconnect(); // or handle properly
    }
    
    socket.on('onlineUsers', (data) => {
      const onlineUsers = data.filter(user => user._id !== authUser._id);
      // You can handle the online users here, e.g., update state or notify UI
      queryClient.invalidateQueries(['users']);
      setOnlineUsers(onlineUsers);
    });

    socket.on('user-typing', ({ from }) => {
      console.log(`${from} is typing...`);
      addTypingUser(from);
    });

    socket.on('user-stopped-typing', ({ from }) => {
      removeTypingUser(from);
    });

    // if (!authUser) {
    //    socket.emit('disconnect',authUser._id)
    // }


    socket.on('received-message', (data) => {
      
      getPrivateMessages(data);
    });

    socket.on('received-group-message', (data) => {    
      console.log("Received group message",data)
      getGroupMessages(data);
    });

    return () => {
      socket.off('currentlyOnline');
      socket.off('received-message');
      socket.off('received-group-message');
      socket.off('onlineUsers');
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [authUser]);
};

export default useSocketEvents;
