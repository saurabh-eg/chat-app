import { Server } from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]; // Retrieve the socket ID for the user
}

// used to store the online users
const userSocketMap = {} // {userId: socketId}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the socket ID for the user
        // console.log('User connected:', userId, 'Socket ID:', socket.id);
    }
  
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Send the list of online users to all clients

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        // Remove the user from the online users list
        delete userSocketMap[userId];
        // Update the list of online users
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); 
    });
});

export { io, app, server };