

import { create } from 'zustand';

export const useChatStore = create((set) => ({
  privateMessages: [], // { userId: [messages] }
  groupMessages: [], // { groupId: [messages] }
  chats: [],
  onlineUsers:[],
  typingUsers: [],

  getPrivateMessages: async (data) => {
    set(() => ({
      privateMessages: data?.history,
      chats: data?.chats,
    }));
  },

  getGroupMessages: async (data) => {
      set(() => ({
        groupMessages: data?.history,
        chats: data?.chats,
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

