import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ChatSidebar = ({ 
  chats, 
  activeChat, 
  onChatSelect, 
  onDeleteChat,
  searchQuery, 
  onSearchChange, 
  isMobile 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#131313]">
      {/* Header - Matching ChatArea header height */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#131313] border-b border-gray-200 dark:border-gray-600 shadow-sm flex-shrink-0 min-h-[81px]">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chats
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 pt-0 border-b border-gray-200 dark:border-gray-600"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#000000] border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </motion.div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowContextMenu(showContextMenu === chat.id ? null : chat.id);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  activeChat?.id === chat.id
                    ? 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500'
                    : 'hover:bg-gray-100 dark:hover:bg-black'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                      onError={(e) => {
                        e.target.src = '/profile/default.png';
                      }}
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {chat.timestamp}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowContextMenu(showContextMenu === chat.id ? null : chat.id);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate pr-2">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-500 rounded-full min-w-[20px] h-5">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Context Menu */}
                {showContextMenu === chat.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-12 right-2 bg-white dark:bg-[#131313] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-20 min-w-[120px]"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(chat.id);
                        setShowContextMenu(null);
                      }}
                      className="w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-sm">Delete Chat</span>
                    </button>
                  </motion.div>
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm === chat.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-white dark:bg-[#131313] rounded-xl p-6 max-w-sm mx-4 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Delete Chat
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Are you sure you want to delete this chat with {chat.name}? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            onDeleteChat(chat.id);
                            setShowDeleteConfirm(null);
                          }}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-[#000000] hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Selection indicator */}
                {activeChat?.id === chat.id && (
                  <motion.div
                    layoutId="activeChat"
                    className="absolute inset-0 bg-purple-500/5 rounded-lg pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
