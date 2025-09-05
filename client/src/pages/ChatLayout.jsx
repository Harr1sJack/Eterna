import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatPage from "./ChatPage";
import { useAuth } from "../context/AuthContext";

const ChatLayout = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
  
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/chats/user/${user.id}`
        );
        setChats(res.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };
  
    fetchChats();
  }, [user?.id]);
  
  return (
    <div className="h-screen flex bg-gray-100 mt-12">
      {/* Left panel */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 text-lg font-bold border-b">Chats</h2>
        {chats.map((chat) => {
          // find the other user (not current logged-in user)
          const otherUser = chat.participants.find(
            (p) => p._id !== user._id
          );

          return (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)} // store entire chat
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                selectedChat?._id === chat._id ? "bg-purple-100" : ""
              }`}
            >
              <p className="font-medium">{otherUser?.name}</p>
              <p className="text-sm text-gray-500 truncate">
                {chat.messages[chat.messages.length - 1]?.text || "No messages"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatPage chat={selectedChat} currentUser={user} />
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
