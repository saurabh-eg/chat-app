import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/users');
      set({ users: response.data });
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(`Failed to send message: ${error.response.data.message}`);
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // todo:optimize this later: DONE
    socket.on('newMessage', (newMessage) => {
      // Check if the new message is for the currently selected user
      if (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id) return;
      set({
        messages: [...get().messages, newMessage]
      });
    });
    
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));