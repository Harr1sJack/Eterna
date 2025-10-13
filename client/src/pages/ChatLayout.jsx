import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatArea from "../components/chat/ChatArea";
import io from "socket.io-client";

const ChatLayout = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const productChatInfo = location.state;
  
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use refs to prevent stale closures
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isReconnectingRef = useRef(false);
  const activeChatRef = useRef(null);

  // Update activeChat ref whenever activeChat changes
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // Fetch user chats with proper error handling
  const fetchUserChats = useCallback(async () => {
    if (!user?.id || !token) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery },
      });
      
      const chatData = Array.isArray(res.data) ? res.data : [];
      setChats(chatData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user chats", error);
      setChats([]);
      setLoading(false);
    }
  }, [user?.id, token, searchQuery]);

  // Enhanced mark chat as read function
  const handleMarkChatAsRead = useCallback((chatId) => {
    if (!chatId || !user?.id) return;

    // Update local state immediately
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    );

    // Notify server via socket
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark_chat_read', { chatId, userId: user.id });
    }
  }, [user?.id]);

  // Handle chat select from sidebar
  const handleChatSelect = useCallback(async (chat) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: user.id }
      });
      
      const fullChat = res.data;
      
      const normalizedChat = {
        ...fullChat,
        messages: Array.isArray(fullChat.messages) ? fullChat.messages : []
      };
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('join_chat', normalizedChat.id);
        if (activeChatRef.current) {
          socketRef.current.emit('leave_chat', activeChatRef.current.id);
        }
      }
      
      setActiveChat(normalizedChat);
      
      // Immediately mark as read when selecting chat
      if (normalizedChat.unreadCount > 0) {
        handleMarkChatAsRead(normalizedChat.id);
      }
      
      if (isMobile) setShowMobileChat(true);
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  }, [token, user?.id, handleMarkChatAsRead, isMobile]);

  // 🔥 POLLING ONLY Socket initialization
  const initializeSocket = useCallback(() => {
    if (!user?.id || !token || isReconnectingRef.current) return;
    
    console.log('Initializing socket connection...');
    isReconnectingRef.current = true;

    try {
      // Disconnect existing socket first
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // 🔥 POLLING ONLY CONFIGURATION
      const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['polling'], // 🔥 POLLING ONLY
        upgrade: false,          // 🔥 NEVER UPGRADE TO WEBSOCKET
        rememberUpgrade: false,  // 🔥 DON'T REMEMBER WEBSOCKET
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        forceNew: true,
        autoConnect: true,
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('✅ Socket connected via POLLING:', newSocket.id);
        setIsConnected(true);
        setConnectionError(null);
        isReconnectingRef.current = false;
        
        newSocket.emit('authenticate', user.id);
        
        if (activeChatRef.current?.id) {
          newSocket.emit('join_chat', activeChatRef.current.id);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        setIsConnected(false);
        setConnectionError('Failed to connect to chat server');
        isReconnectingRef.current = false;
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected:', reason);
        setIsConnected(false);
        
        if (reason === 'io server disconnect' || reason === 'transport close') {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isReconnectingRef.current && user?.id && token) {
              initializeSocket();
            }
          }, 2000);
        }
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected after', attemptNumber, 'attempts');
        setIsConnected(true);
        setConnectionError(null);
        isReconnectingRef.current = false;
      });

      newSocket.on('reconnect_failed', () => {
        console.error('❌ Reconnection failed');
        setConnectionError('Failed to reconnect to server');
        isReconnectingRef.current = false;
      });

      // Message handling
      newSocket.on('receive_message', (data) => {
        setActiveChat(prevChat => {
          if (prevChat && data.chatId === prevChat.id) {
            const currentMessages = prevChat.messages || [];
            
            // Check for duplicates
            const messageExists = currentMessages.some(msg => 
              msg.id === data.message.id || 
              (msg.text === data.message.text && Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 1000)
            );
            
            if (!messageExists) {
              // Mark as read since user is viewing the chat
              setTimeout(() => {
                if (socketRef.current?.connected) {
                  socketRef.current.emit('mark_chat_read', { chatId: data.chatId, userId: user.id });
                }
              }, 100);

              return {
                ...prevChat,
                messages: [...currentMessages, {
                  ...data.message,
                  sent: data.senderId === user.id
                }]
              };
            }
          }
          return prevChat;
        });

        // Update chat list
        setChats(prevChats => 
          prevChats.map(chat => {
            if (chat.id === data.chatId) {
              const isCurrentlyActive = activeChatRef.current?.id === data.chatId;
              const shouldIncrementUnread = data.senderId !== user.id && !isCurrentlyActive;
              
              return {
                ...chat,
                lastMessage: data.message.text,
                timestamp: data.message.timestamp,
                unreadCount: shouldIncrementUnread ? (chat.unreadCount || 0) + 1 : (isCurrentlyActive ? 0 : chat.unreadCount)
              };
            }
            return chat;
          })
        );
      });

      newSocket.on('chat_marked_read', (data) => {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === data.chatId 
              ? { ...chat, unreadCount: 0 }
              : chat
          )
        );
      });

      newSocket.on('reaction_updated', (data) => {
        setActiveChat(prevChat => {
          if (prevChat && data.chatId === prevChat.id && prevChat.messages) {
            return {
              ...prevChat,
              messages: prevChat.messages.map(msg => 
                msg.id === data.messageId 
                  ? { 
                      ...msg, 
                      reactions: data.reactions?.map(r => r.emoji) || []
                    }
                  : msg
              )
            };
          }
          return prevChat;
        });
      });

      newSocket.on('message_deleted', (data) => {
        setActiveChat(prevChat => {
          if (prevChat && data.chatId === prevChat.id && prevChat.messages) {
            return {
              ...prevChat,
              messages: prevChat.messages.filter(msg => msg.id !== data.messageId)
            };
          }
          return prevChat;
        });
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

    } catch (error) {
      console.error('Socket initialization error:', error);
      setConnectionError('Failed to initialize chat connection');
      isReconnectingRef.current = false;
    }
  }, [user?.id, token]);

  // Initialize socket on mount
  useEffect(() => {
    if (user?.id && token) {
      initializeSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      
      isReconnectingRef.current = false;
    };
  }, [initializeSocket]);

  // Responsive design handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch chats effect
  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  const handleSendMessage = async (messageData) => {
    if (!activeChat || !socketRef.current?.connected) {
      console.warn('Cannot send message: no active chat or socket not connected');
      return;
    }
    
    const messagePayload = {
      chatId: activeChat.id,
      senderId: user.id,
      ...messageData
    };

    socketRef.current.emit('send_message', messagePayload);
  };

  const handleAddReaction = (messageId, emoji) => {
    if (!activeChat || !socketRef.current?.connected) return;

    const makeReactionRequest = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/chats/${activeChat.id}/messages/${messageId}/reactions`,
          {
            userId: user.id,
            emoji
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (error) {
        console.error('Failed to add reaction:', error);
      }
    };

    makeReactionRequest();
  };

  const handleDeleteMessage = async (messageId) => {
    if (!activeChat || !user?.id) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/chats/${activeChat.id}/messages/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId: user.id }
        }
      );
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: user.id }
      });
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('leave_chat', chatId);
      }
      
      if (activeChat?.id === chatId) {
        setActiveChat(null);
        setShowMobileChat(false);
      }
      
      fetchUserChats();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleBackToSidebar = () => {
    setShowMobileChat(false);
    setActiveChat(null);
  };

  // Filter chats by search term
  const filteredChats = chats.filter(
    (chat) =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-[#000000] pt-16 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (connectionError && !isConnected) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-[#000000] pt-16 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.138 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connection Error</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{connectionError}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setConnectionError(null);
                initializeSocket();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors mr-2"
            >
              Retry Connection
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#000000] pt-16">
      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="fixed top-20 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span className="text-sm">Reconnecting...</span>
          </div>
        </div>
      )}

      {!isMobile && (
        <>
          <div className="w-1/3 min-w-[300px] max-w-[400px]">
            <ChatSidebar
              chats={filteredChats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              onDeleteChat={handleDeleteChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isMobile={false}
            />
          </div>
          <div className="flex-1">
            <ChatArea
              activeChat={activeChat}
              onSendMessage={handleSendMessage}
              onAddReaction={handleAddReaction}
              onDeleteMessage={handleDeleteMessage}
              onBackToSidebar={handleBackToSidebar}
              onMarkChatAsRead={handleMarkChatAsRead}
              isMobile={false}
            />
          </div>
        </>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <div className="w-full h-full">
          <AnimatePresence mode="wait">
            {!showMobileChat ? (
              <ChatSidebar
                key="sidebar"
                chats={filteredChats}
                activeChat={activeChat}
                onChatSelect={handleChatSelect}
                onDeleteChat={handleDeleteChat}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isMobile={true}
              />
            ) : (
              <ChatArea
                key="chat"
                activeChat={activeChat}
                onSendMessage={handleSendMessage}
                onAddReaction={handleAddReaction}
                onDeleteMessage={handleDeleteMessage}
                onBackToSidebar={handleBackToSidebar}
                onMarkChatAsRead={handleMarkChatAsRead}
                isMobile={true}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
