import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import EmojiPicker from './EmojiPicker';
import AnimatedSendButton from './AnimatedSendButton';

const ChatArea = ({ 
  activeChat, 
  onSendMessage, 
  onBackToSidebar, 
  onAddReaction,
  onDeleteMessage, 
  onMarkChatAsRead,
  isMobile 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [isSending, setIsSending] = useState(false); // FIXED: Add sending state
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (activeChat?.messages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages?.length]); // Only depend on length

  // FIXED: Mark chat as read when opening (only once per chat)
  useEffect(() => {
    if (activeChat?.id && activeChat.unreadCount > 0 && onMarkChatAsRead) {
      onMarkChatAsRead(activeChat.id);
    }
  }, [activeChat?.id]); // Only depend on chat ID

  // FIXED: Handle message sending with proper debouncing
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (message.trim() && !isSending && activeChat) {
      setIsSending(true);
      
      const newMessage = { 
        text: message.trim(), 
        type: 'text',
        ...(replyToMessage && {
          replyTo: {
            id: replyToMessage.id,
            text: replyToMessage.text,
            senderName: replyToMessage.sent ? 'You' : activeChat.name
          }
        })
      };
      
      try {
        await onSendMessage(newMessage);
        setMessage('');
        setReplyToMessage(null);
        setShowEmojiPicker(false);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        // Reset sending state after a short delay
        setTimeout(() => {
          setIsSending(false);
        }, 500);
      }
    }
  };

  // Handle reply to message
  const handleReplyToMessage = (messageToReply) => {
    setReplyToMessage(messageToReply);
    inputRef.current?.focus();
  };

  // Handle cancel reply
  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle typing simulation
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container') && !event.target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showEmojiPicker]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#000000]">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
          <p className="text-sm">Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#000000] relative h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#131313] border-b border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button
              onClick={onBackToSidebar}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          <div className="relative">
            <img
              src={activeChat.avatar}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
              onError={(e) => {
                e.target.src = '/profile/default.png';
              }}
            />
            {activeChat.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeChat.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeChat.isOnline ? 'Online' : 'Last seen recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#000000] pb-24">
        {activeChat.messages && activeChat.messages.length > 0 ? (
          <>
            <AnimatePresence>
              {activeChat.messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id || `msg-${index}`}
                  message={msg}
                  onAddReaction={(emoji) => onAddReaction(msg.id, emoji)}
                  onDeleteMessage={onDeleteMessage}
                  onReplyToMessage={handleReplyToMessage}
                  showReactions={showReactions === msg.id}
                  onToggleReactions={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator - Removed "You are typing" */}
            {/* Only show typing indicator for other users in header */}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#131313] border-t border-gray-200 dark:border-gray-600 px-4 py-3 z-10">
        {/* Reply Preview */}
        <AnimatePresence>
          {replyToMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-3 bg-gray-100 dark:bg-[#000000] rounded-lg border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                    Replying to {replyToMessage.sent ? 'yourself' : activeChat.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {replyToMessage.text}
                  </div>
                </div>
                <button
                  onClick={handleCancelReply}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 pr-12 bg-gray-100 dark:bg-[#000000] border-0 rounded-xl resize-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none h-[44px] leading-5 overflow-hidden"
              rows="1"
              disabled={isSending} // FIXED: Disable during sending
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              onInput={(e) => {
                e.target.style.height = '44px';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            
            <button
              type="button"
              className={`emoji-button absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                showEmojiPicker 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              disabled={isSending}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          <div className="flex-shrink-0">
            <AnimatedSendButton
              onClick={async () => {
                if (message.trim() && !isSending) {
                  await handleSendMessage({ preventDefault: () => {} });
                }
              }}
              disabled={!message.trim() || isSending} // FIXED: Disable during sending
            />
          </div>
        </form>

        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-4 mb-2 z-50 emoji-picker-container"
            >
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatArea;
