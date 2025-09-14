import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, onAddReaction, onDeleteMessage, onReplyToMessage, showReactions, onToggleReactions }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const renderMessageContent = () => {
    switch (message.type) {
      case 'voice':
        return (
          <div className="flex items-center space-x-3 min-w-[200px]">
            <button className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {message.duration}
                </span>
              </div>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 min-w-[250px]">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {message.fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : 'File'}
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        );
    }
  };

  const renderMessageStatus = () => {
    if (!message.sent) return null;

    const statusIcons = {
      sent: (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      delivered: (
        <div className="flex">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <svg className="w-4 h-4 text-gray-400 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      read: (
        <div className="flex">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <svg className="w-4 h-4 text-blue-500 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    };

    return statusIcons[message.status] || statusIcons.sent;
  };

  const quickReactions = ['❤️', '😊', '😂', '😮', '😢', '👍', '👎', '🔥'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${message.sent ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative max-w-[70%] ${message.sent ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            message.sent
              ? 'bg-purple-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600'
          }`}
        >
          {/* Reply Context */}
          {message.replyTo && (
            <div className={`mb-2 pb-2 border-l-2 pl-3 ${
              message.sent 
                ? 'border-purple-300 bg-purple-500/20' 
                : 'border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-600'
            } rounded`}>
              <div className={`text-xs font-medium ${
                message.sent ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {message.replyTo.senderName || 'You'}
              </div>
              <div className={`text-xs mt-1 ${
                message.sent ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
              } truncate`}>
                {message.replyTo.text}
              </div>
            </div>
          )}
          
          {renderMessageContent()}

          {/* Message timestamp and status */}
          <div className={`flex items-center justify-end space-x-1 mt-2 ${
            message.sent ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span className="text-xs">{message.timestamp}</span>
            {renderMessageStatus()}
          </div>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-2 left-2 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md border border-gray-200 dark:border-gray-600">
            {message.reactions.slice(0, 3).map((reaction, index) => (
              <span key={index} className="text-sm">
                {reaction}
              </span>
            ))}
            {message.reactions.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{message.reactions.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Quick Action Buttons */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute top-0 flex items-center space-x-1 ${
              message.sent ? 'right-full mr-2' : 'left-full ml-2'
            }`}
          >
            <button
              onClick={onToggleReactions}
              className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button 
              onClick={() => onReplyToMessage && onReplyToMessage(message)}
              className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            
            {/* Delete Button - only show for sent messages */}
            {message.sent && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </motion.div>
        )}

        {/* Reaction Picker */}
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={`absolute top-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-2 z-10 ${
              message.sent ? 'right-0' : 'left-0'
            }`}
          >
            <div className="flex items-center space-x-2">
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onAddReaction(emoji);
                    onToggleReactions();
                  }}
                  className="text-lg hover:scale-125 transition-transform p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-4 z-20 min-w-[200px] ${
              message.sent ? 'right-0' : 'left-0'
            }`}
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Delete this message?
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onDeleteMessage(message.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;