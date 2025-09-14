import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatArea from '../components/chat/ChatArea';

// Mock data for chats
const mockChats = [
  {
    id: 1,
    name: "Rabin",
    avatar: "/profile/default.png",
    lastMessage: "Hey! How's the project going?",
    timestamp: "2:30 PM",
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 1,
        text: "Hey! How's the project going?",
        timestamp: "2:25 PM",
        sent: false,
        status: "read",
        type: "text"
      },
      {
        id: 2,
        text: "Going great! Almost done with the UI. Shaun Rodrigues has been amazing with the design work!",
        timestamp: "2:28 PM",
        sent: true,
        status: "read",
        type: "text"
      },
      {
        id: 3,
        text: "Can't wait to see it! 🚀",
        timestamp: "2:30 PM",
        sent: false,
        status: "read",
        reactions: ["🔥"],
        type: "text"
      }
    ]
  },
  {
    id: 2,
    name: "Harris",
    avatar: "/profile/default.png",
    lastMessage: "The UI looks incredible! 🎨",
    timestamp: "1:45 PM",
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 1,
        text: "Just saw the new design updates",
        timestamp: "1:40 PM",
        sent: true,
        status: "read",
        type: "text"
      },
      {
        id: 2,
        text: "The UI looks incredible! 🎨",
        timestamp: "1:45 PM",
        sent: false,
        status: "read",
        reactions: ["🔥", "👍"],
        type: "text"
      },
      {
        id: 3,
        text: "Thanks Harris! Shaun Rodrigues really put a lot of effort into this.",
        timestamp: "1:46 PM",
        sent: true,
        status: "read",
        type: "text",
        replyTo: {
          id: 2,
          text: "The UI looks incredible! 🎨",
          senderName: "Harris"
        }
      }
    ]
  },
  {
    id: 3,
    name: "Sarah",
    avatar: "/profile/default.png",
    lastMessage: "Meeting at 3 PM",
    timestamp: "12:15 PM",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 1,
        text: "Don't forget about our meeting today",
        timestamp: "12:10 PM",
        sent: false,
        status: "read",
        type: "text"
      },
      {
        id: 2,
        text: "Meeting at 3 PM",
        timestamp: "12:15 PM",
        sent: false,
        status: "read",
        type: "text"
      }
    ]
  },
  {
    id: 4,
    name: "Mike",
    avatar: "/profile/default.png",
    lastMessage: "Thanks for the help!",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 1,
        text: "Could you review my code?",
        timestamp: "Yesterday",
        sent: false,
        status: "read",
        type: "text"
      },
      {
        id: 2,
        text: "Sure! Sending feedback now",
        timestamp: "Yesterday",
        sent: true,
        status: "read",
        type: "text"
      },
      {
        id: 3,
        text: "Thanks for the help!",
        timestamp: "Yesterday",
        sent: false,
        status: "read",
        type: "text"
      }
    ]
  },
  {
    id: 5,
    name: "Shaun Rodrigues",
    avatar: "/profile/default.png",
    lastMessage: "The chat interface looks amazing! 🚀",
    timestamp: "3:45 PM",
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 1,
        text: "Hey! Just wanted to say the new chat design is fantastic",
        timestamp: "3:40 PM",
        sent: false,
        status: "read",
        type: "text"
      },
      {
        id: 2,
        text: "Thanks! Really appreciate the feedback",
        timestamp: "3:42 PM",
        sent: true,
        status: "read",
        type: "text"
      },
      {
        id: 3,
        text: "The chat interface looks amazing! 🚀",
        timestamp: "3:45 PM",
        sent: false,
        status: "delivered",
        reactions: ["❤️", "🔥"],
        type: "text"
      }
    ]
  }
];

const ChatLayout = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [chats, setChats] = useState(mockChats);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter chats based on search
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    if (isMobile) {
      setShowMobileChat(true);
    }
  };

  // Handle sending messages
  const handleSendMessage = (messageData) => {
    if (!activeChat) return;
    
    const newMessage = {
      id: Date.now(),
      ...messageData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      status: 'sent'
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage.text,
          timestamp: newMessage.timestamp
        };
        setActiveChat(updatedChat);
        return updatedChat;
      }
      return chat;
    });

    setChats(updatedChats);
  };

  // Handle adding reactions
  const handleAddReaction = (messageId, emoji) => {
    if (!activeChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        const updatedMessages = chat.messages.map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || [];
            const hasReaction = reactions.includes(emoji);
            
            return {
              ...msg,
              reactions: hasReaction 
                ? reactions.filter(r => r !== emoji)
                : [...reactions, emoji]
            };
          }
          return msg;
        });
        
        const updatedChat = { ...chat, messages: updatedMessages };
        setActiveChat(updatedChat);
        return updatedChat;
      }
      return chat;
    });

    setChats(updatedChats);
  };

  // Handle deleting messages
  const handleDeleteMessage = (messageId) => {
    if (!activeChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        const updatedMessages = chat.messages.filter(msg => msg.id !== messageId);
        const updatedChat = {
          ...chat,
          messages: updatedMessages,
          lastMessage: updatedMessages.length > 0 
            ? updatedMessages[updatedMessages.length - 1].text 
            : 'No messages'
        };
        setActiveChat(updatedChat);
        return updatedChat;
      }
      return chat;
    });

    setChats(updatedChats);
  };

  // Handle deleting chats
  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  };

  // Handle back to sidebar on mobile
  const handleBackToSidebar = () => {
    setShowMobileChat(false);
    setActiveChat(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      {/* Desktop Layout */}
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
