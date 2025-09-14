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
  isMobile 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Handle message sending
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
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
      onSendMessage(newMessage);
      setMessage('');
      setReplyToMessage(null);
      setShowEmojiPicker(false);
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
    inputRef.current?.focus();
  };

  // Handle typing simulation
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file upload
      onSendMessage({
        text: `📎 ${file.name}`,
        type: 'file',
        fileName: file.name,
        fileSize: file.size
      });
    }
  };

  // Handle voice message (simulation)
  const handleVoiceMessage = () => {
    onSendMessage({
      text: 'Voice message',
      type: 'voice',
      duration: '0:' + (Math.floor(Math.random() * 59) + 1).toString().padStart(2, '0')
    });
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
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

        {/* Removed phone, video call, and menu buttons as requested */}
      </div>

      {/* Messages Area - with bottom padding for fixed input */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 pb-24">
        <AnimatePresence>
          {activeChat.messages?.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onAddReaction={(emoji) => onAddReaction(msg.id, emoji)}
              onDeleteMessage={onDeleteMessage}
              onReplyToMessage={handleReplyToMessage}
              showReactions={showReactions === msg.id}
              onToggleReactions={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>You are typing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="fixed bottom-20 left-0 right-0 md:left-[300px] lg:left-[340px] xl:left-[400px] p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
        {/* Reply Preview */}
        {replyToMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500"
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
        
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2 ml-1">
          {/* Attachment Button */}
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </label>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg resize-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none h-12 overflow-y-auto"
              rows="1"
              style={{ height: '48px', minHeight: '48px', maxHeight: '48px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Voice Message Button */}
          <button
            type="button"
            onClick={handleVoiceMessage}
            className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Animated Send Button */}
          <AnimatedSendButton
            onClick={async () => {
              if (message.trim()) {
                handleSendMessage({ preventDefault: () => {} });
              }
            }}
            disabled={!message.trim()}
          />
        </form>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 right-4 z-50"
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