import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';

const ChatContainer = () => {

  const navigate = useNavigate();

  const { selectedUser, messages, getMessages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore()

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  useEffect(() => {
    
      getMessages(selectedUser._id);

      subscribeToMessages();

    
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);


  if (!selectedUser) return null;

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />

      </div>
    )
  }
  return (
    <div className='flex-1 flex flex-col'>
      <ChatHeader />

      <div className='flex-1 flex flex-col overflow-auto'>
        <div className='flex-1 flex flex-col overflow-auto px-3 py-2'>
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full cursor-pointer hover:opacity-80 transition"
                // onClick={() => {
                //   if (message.senderId === authUser._id) {
                //     navigate(`/profile/${authUser._id}`);
                //   } else {
                //     navigate(`/profile/${message.senderId}`);
                //   }
                // }}
                >
                  <img
                    src={message.senderId === authUser._id ? authUser?.profilePic?.[0]?.url || "/avatar.png" : selectedUser?.profilePic?.[0]?.url || "/avatar.png"}
                    alt={"User"}

                  />
                </div>
              </div>
              <div className="chat-bubble rounded-2xl bg-base-200 text-base-content break-words max-w-[70%]">


                {message.images && message.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Message ${index + 1}`}
                        className="max-w-[200px] rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {message.text}

                <div className="text-right text-xs opacity-50">
                  {new Date(message.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                  {/* - {message.senderId === authUser._id ? 'You' : selectedUser?.fullname} */}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

      </div>

      <MessageInput />

    </div>
  )
}

export default ChatContainer