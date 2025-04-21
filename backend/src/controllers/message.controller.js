import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const getUsersforSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getMessages = async (req, res) => {
    try {
        // Extracting userToChatId from request parameters
        // and myId from the authenticated user object

        const userToChatId = req.params.id;
        const myId = req.user._id;

        // Debug logs
        // console.log('Request params:', req.params);
        // console.log('Attempting to fetch messages with:', {
        //     userToChatId,
        //     myId: myId.toString()
        // });

        if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
            return res.status(400).json({
                message: "Invalid user ID format"
            });
        }

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {

        console.error("Error fetching messages:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const sendMessages = async (req, res) => {
    try {
        const { text, images } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let uploadedImages = [];
        if (images && images.length > 0) {
            try {
                // Upload images to Cloudinary
                const uploadPromises = images.map(async (base64Data) => {
                    const uploadResponse = await cloudinary.uploader.upload(
                        base64Data,
                        {
                            folder: "chat-app-messages",
                            resource_type: "image"
                        }
                    );
                    return uploadResponse.secure_url;
                });

                uploadedImages = await Promise.all(uploadPromises);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            images: uploadedImages
        });

        await newMessage.save();
        res.status(201).json(newMessage);

        // todo: real time message here with socket io : DONE

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Send the message to the receiver's socket
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

};

export { getUsersforSidebar, getMessages, sendMessages };