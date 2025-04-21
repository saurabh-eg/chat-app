import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { ImageIcon, SendIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;


        // Limit number of images
        if (files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        // Validate each file
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10 MB limit
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            return true;
        });

        // if (!file.type || !file.type.startsWith('image/')) {
        //     toast.error('Please select an image file');
        //     return;
        // };

        // if (file.size > 10 * 1024 * 1024) { // 10 MB limit
        //     toast.error('File size should be less than 5MB');
        //     return;
        // }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.onerror = () => {
                toast.error(`Error reading ${file.name}`);
            };
            reader.readAsDataURL(file);

        });
    }


    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (imagePreviews.length === 1) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        try {

            const messageData = {
                text: text.trim() || "", // Ensure text is never undefined
                images: imagePreviews
            };

            // Validate message content
            if (!messageData.text && !messageData.images.length === 0) {
                toast.error("Please enter a message or select an image");
                return;
            }

            // Show loading state
            // const loadingToast = toast.loading("Sending message...");

            // ✅ Only show toast if images are being sent
            let loadingToast;
            if (messageData.images.length > 0) {
                loadingToast = toast.loading("Uploading images...");
            }
            await sendMessage(messageData);
            // toast.success("Message sent!", { id: loadingToast });
            if (loadingToast) {
                toast.success("Images sent!", { id: loadingToast });
            }
            // Reset input fields / form data
            setText('');
            setImagePreviews([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.log("Error sending message:", error);
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    }
    return (
        <div className='p-4 w-full border-t border-base-300'>

            {imagePreviews.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2 mb-4'>
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className='relative'>
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className='w-24 h-24 object-cover rounded-lg'
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
                <input
                    type="file"
                    accept='image/*'
                    multiple
                    className='hidden'
                    ref={fileInputRef}
                    onChange={handleImageChange}
                />
                <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='btn btn-sm btn-primary size-10'>
                    <ImageIcon className='w-5 h-5' />
                </button>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Type a message...'
                    className='input input-bordered flex-1' />
                <button
                    type='submit'
                    className='btn btn-sm btn-primary h-10 w-17 font-bold'
                    disabled={!text.trim() && imagePreviews.length === 0}>
                    <SendIcon className='size-5' />
                </button>
            </form>


        </div>
    )
}

export default MessageInput