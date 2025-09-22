import React, { useState, useEffect } from "react";
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

  // Initialize socket connection with proper error handling
  useEffect(() => {
    if (user?.id && token) {
      try {
        const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling'], // Allow fallback to polling
          timeout: 20000,
          forceNew: true
        });

        newSocket.on('connect', () => {
          console.log('Connected to server');
          setConnectionError(null);
          newSocket.emit('authenticate', user.id);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setConnectionError('Failed to connect to chat server');
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Disconnected:', reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            newSocket.connect();
          }
        });

        newSocket.on('receive_message', (data) => {
          if (activeChat && data.chatId === activeChat.id) {
            setActiveChat(prev => {
              // Ensure messages array exists
              const currentMessages = prev?.messages || [];
              return {
                ...prev,
                messages: [...currentMessages, {
                  ...data.message,
                  sent: data.senderId === user.id
                }]
              };
            });
          }
          // Update chat list
          fetchUserChats();
        });

        newSocket.on('reaction_updated', (data) => {
          if (activeChat && data.chatId === activeChat.id) {
            setActiveChat(prev => {
              if (!prev?.messages) return prev;
              return {
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === data.messageId 
                    ? { ...msg, reactions: data.reactions?.map(r => r.emoji) || [] }
                    : msg
                )
              };
            });
          }
        });

        newSocket.on('message_deleted', (data) => {
          if (activeChat && data.chatId === activeChat.id) {
            setActiveChat(prev => {
              if (!prev?.messages) return prev;
              return {
                ...prev,
                messages: prev.messages.filter(msg => msg.id !== data.messageId)
              };
            });
          }
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
        setConnectionError('Failed to initialize chat connection');
      }
    }
  }, [user, token]); // Removed activeChat from dependencies to prevent reconnection loops

  // Responsive design handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch user chats with proper error handling
  const fetchUserChats = async () => {
    if (!user?.id || !token) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchQuery },
      });
      
      // Ensure we have an array
      const chatData = Array.isArray(res.data) ? res.data : [];
      setChats(chatData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user chats", error);
      setChats([]); // Set empty array on error
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserChats();
  }, [user, token, searchQuery]);

  // Open or create chat given participantId and optional productId
  const openChatWithUser = async (participantId, productId = null) => {
    if (!user?.id || !token) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/chats`, {
        participants: [user.id, participantId],
        productId,
        isGroup: false,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const chat = res.data;
      
      // Ensure messages array exists
      const normalizedChat = {
        ...chat,
        messages: Array.isArray(chat.messages) ? chat.messages : []
      };
      
      if (socket) {
        socket.emit('join_chat', chat.id);
      }

      setActiveChat(normalizedChat);

      if (isMobile) {
        setShowMobileChat(true);
      }

      fetchUserChats();
    } catch (error) {
      console.error("Error opening chat", error);
    }
  };

  // Handle product chat info on mount
  useEffect(() => {
    if (
      productChatInfo &&
      productChatInfo.ownerId &&
      productChatInfo.productId &&
      user?.id &&
      socket
    ) {
      openChatWithUser(productChatInfo.ownerId, productChatInfo.productId);
    }
  }, [productChatInfo, user, socket]);

  // Handle chat select from sidebar
  const handleChatSelect = async (chat) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chat.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId: user.id }
      });
      
      const fullChat = res.data;
      
      // Ensure messages array exists
      const normalizedChat = {
        ...fullChat,
        messages: Array.isArray(fullChat.messages) ? fullChat.messages : []
      };
      
      if (socket) {
        socket.emit('join_chat', normalizedChat.id);
        if (activeChat) {
          socket.emit('leave_chat', activeChat.id);
        }
      }
      
      setActiveChat(normalizedChat);
      
      if (isMobile) setShowMobileChat(true);
    } catch (error) {
      console.error("Error selecting chat:", error);
    }
  };

  // Handle sending messages with validation
  const handleSendMessage = async (messageData) => {
    if (!activeChat || !socket) return;
    
    const messagePayload = {
      chatId: activeChat.id,
      senderId: user.id,
      ...messageData
    };

    socket.emit('send_message', messagePayload);

    // Optimistically update UI
    const optimisticMessage = {
      id: Date.now(),
      ...messageData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      status: 'sent'
    };

    setActiveChat(prev => {
      const currentMessages = prev?.messages || [];
      return {
        ...prev,
        messages: [...currentMessages, optimisticMessage]
      };
    });
  };

  // Handle adding reactions
  const handleAddReaction = (messageId, emoji) => {
    if (!activeChat || !socket) return;

    socket.emit('add_reaction', {
      chatId: activeChat.id,
      messageId,
      userId: user.id,
      emoji
    });
  };

  // Handle deleting messages
  const handleDeleteMessage = (messageId) => {
    if (!activeChat || !socket) return;

    socket.emit('delete_message', {
      chatId: activeChat.id,
      messageId,
      userId: user.id
    });
  };

  // Handle deleting chats
  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: user.id }
      });
      
      if (socket) {
        socket.emit('leave_chat', chatId);
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

  // Handle back to sidebar in mobile view
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

  if (connectionError) {
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
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#000000] pt-16">
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
