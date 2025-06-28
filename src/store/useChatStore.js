

import { create } from 'zustand';
import http from '../api/http';

export const useChatStore = create((set, get) => ({
  privateMessages: [], // { userId: [messages] }
  groupMessages: {}, // { groupId: [messages] }
  chats: [],
  unreadGroup: {},
  onlineUsers:[],
  typingUsers: [],

  fetchPrivateMessages: async (userId) => {
    try {
      const { data } = await http.post('/messages/currentChatMessages', { userId });
      set(state => ({
        privateMessages: { ...state.privateMessages, [userId]: data },
        unreadPrivate: { ...state.unreadPrivate, [userId]: 0 },
      }));
    } catch (err) {
      console.error(err);
    }
  },

  getPrivateMessages: async (data) => {
      set(() => ({
        privateMessages: data?.history,
        chats: data?.chats,
      }));
  },

  addPrivateMessage: (userId, message) => {
    const current = get().privateMessages[userId] || [];
    set(state => ({
      privateMessages: { ...state.privateMessages, [userId]: [...current, message] },
    }));
  },

  addGroupMessage: (groupId, message) => {
    const current = get().groupMessages[groupId] || [];
    set(state => ({
      groupMessages: { ...state.groupMessages, [groupId]: [...current, message] },
    }));
  },

  incrementUnreadPrivate: (userId) => {
    const count = get().unreadPrivate[userId] || 0;
    set(state => ({
      unreadPrivate: { ...state.unreadPrivate, [userId]: count + 1 },
    }));
  },

  markPrivateMessagesAsRead: async (fromId) => {
    try {
      await http.post('/messages/markAsRead', {
        from: fromId,
        to: localStorage.getItem("userId"),
      });
      set((state) => ({
        unreadPrivate: {
          ...state.unreadPrivate,
          [fromId]: 0,
        },
      }));
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  },

  incrementUnreadGroup: (groupId) => {
    const count = get().unreadGroup[groupId] || 0;
    set(state => ({
      unreadGroup: { ...state.unreadGroup, [groupId]: count + 1 },
    }));
  },

  setOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },


  addTypingUser: (id) =>
    set((state) => {
      const stringId = String(id);
      return {
        typingUsers: state.typingUsers.includes(stringId)
          ? state.typingUsers
          : [...state.typingUsers, stringId],
      };
    }),
removeTypingUser: (id) =>
  set((state) => ({
    typingUsers: state.typingUsers.filter((userId) => userId !== id),
  })),
}));

