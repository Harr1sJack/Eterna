import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext"; 

const ChatPage = () => {
  const { user: currentUser } = useAuth(); 
  const { sellerId } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // ✅ connect socket once
    const newSocket = io(import.meta.env.VITE_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // cleanup on unmount
    };
  }, []);

  useEffect(() => {
    console.log(currentUser)
    if (!currentUser?.id || !socket) return;

    const setupChat = async () => {
      try {
        // ✅ send correct keys (buyerId/sellerId) to match backend
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/chats`,
          {
            buyerId: currentUser.id,
            sellerId: sellerId,
          }
        );

        setChat(res.data);
        setMessages(res.data.messages || []);

        // ✅ join chat room
        socket.emit("joinChat", res.data._id);

        // ✅ listen once
        socket.on("newMessage", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        console.error("Chat setup error:", err);
      }
    };

    setupChat();

    return () => {
      socket.off("newMessage");
    };
  }, [sellerId, currentUser?.id, socket]);

  const sendMessage = () => {
    if (!text.trim() || !chat || !socket) return;

    socket.emit("sendMessage", {
      chatId: chat._id,
      senderId: currentUser.id,
      text,
    });

    setText("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 mt-14">
      <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, i) => {
        const sender = msg.senderId || msg.sender;
        return (
          <div
            key={i}
            className={`my-2 p-2 rounded-lg max-w-xs ${
              sender?.toString() === currentUser.id
                ? "bg-purple-600 text-white self-end ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        );
      })}
      </div>

      <div className="flex p-4 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-6 py-2 bg-purple-600 text-white rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
