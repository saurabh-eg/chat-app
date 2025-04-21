import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigingUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers : [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });

            get().connectSocket(); // Connect to socket after checking auth
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigingUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            toast.success("Account created successfully.");

            get().connectSocket(); // Connect to socket after signup
        } catch (error) {
            toast.error("Error in signup", error.response.data.message);
        } finally {
            set({ isSigingUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            toast.success("Login successful.");

            get().connectSocket(); // Connect to socket after login
        } catch (error) {
            toast.error( error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success("Logout successful.");
            get().disconnectSocket(); // Disconnect the socket after logout
        } catch (error) {
            toast.error("Error in logout", error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            console.log("data in updateProfile:", data);
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully.");
        } catch (error) {
            toast.error("Error in updating profile", error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return; // Don't connect if not authenticated or already connected
        const socket = io(BASE_URL, {
            query: { userId: authUser._id }, // Send userId as a query parameter
        });
        socket.connect();
        set({ socket: socket });

        socket.on('getOnlineUsers', (userIds) => {
            // console.log("Online users:", userIds);
            set({ onlineUsers: userIds });
        });
        

    },
    disconnectSocket: () => {
        // const { socket } = get();
        // if (socket) {
        //     socket.close();
        //     set({ socket: null });
        // }

        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null });
        }
    },

}));