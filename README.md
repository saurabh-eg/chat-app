A real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. This app enables secure real-time communication with features like instant messaging, image sharing, and user presence tracking.

## 🚀 Key Features

- **📱 Real-Time Communication**: Instant messaging and user status updates
- **🔒 Secure Authentication**: User signup, login, and session management
- **📸 Media Sharing**: Image upload and sharing capabilities
- **🎨 Customizable UI**: Multiple theme options
- **👥 User Management**: Online status tracking and user filtering
- **🖼️ Profile Management**: Profile picture updates with history

## 🛠️ Technology Stack

### Frontend Stack
- React + React Router
- Zustand (State Management)
- Tailwind CSS + DaisyUI
- Socket.IO Client

### Backend Stack
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- Cloudinary

## ⚙️ Setup Guide

1. **Clone & Install**
```bash
git clone https://github.com/saurabh_eg/chat-app.git
cd chat-app
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment**
Create `.env`:
```plaintext
MONGO_URI=your_mongodb_uri
PORT=PORT
JWT_SECRET=your_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

4. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   └── lib/          # Utilities
frontend/
├── src/
│   ├── components/   # UI components
│   ├── pages/        # Route pages
│   ├── store/        # State management
│   └── constants/    # App constants
```

## 🔌 API Routes

### Auth Routes
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/update-profile` - Update profile
- `GET /api/auth/check` - Auth check

### Message Routes
- `GET /api/messages/users` - Get users
- `GET /api/messages/:id` - Get chat history
- `POST /api/messages/send/:id` - Send message

## 🔄 Socket Events
- `connection` - User connects
- `disconnect` - User disconnects
- `getOnlineUsers` - Online users list
- `newMessage` - Real-time messages

## 🔜 Roadmap
- Group chat functionality
- Message search
- Typing indicators
- Enhanced mobile UI

## 👨‍💻 Author
Saurabh Mishra
Feel free to reach out for any questions or contributions!
