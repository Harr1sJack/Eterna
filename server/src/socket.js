import { Server } from 'socket.io';
import Chat from './models/Chat.js';
import User from './models/User.js';
import { markMessagesAsRead } from './controllers/chatController.js';

let io;
const connectedUsers = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // 🔥 ALLOW ALL ORIGINS
      methods: ["GET", "POST"],
      credentials: false, // 🔥 DISABLED for wildcard compatibility
      allowedHeaders: ["*"]
    },
    // 🔥 OPTIMIZED FOR GEN2 + FIREBASE APP HOSTING
    transports: ['websocket', 'polling'], // Try WebSocket first
    allowUpgrades: true,
    upgradeTimeout: 30000,
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,
    allowEIO3: true,
    cookie: false
  });

  // 🔥 LOG TRANSPORT PROTOCOL
  console.log('🚀 Socket.IO Server initialized');
  console.log('🔧 Transports: [websocket, polling]');
  console.log('🌐 CORS: fully open for all origins');

  io.on('connection', (socket) => {
    // 🔥 LOG CONNECTION TRANSPORT
    const transport = socket.conn.transport.name;
    console.log(`👤 User connected: ${socket.id}`);
    console.log(`🚗 Transport: ${transport.toUpperCase()}`);
    
    // Monitor transport upgrades
    socket.conn.on('upgrade', () => {
      const upgradedTransport = socket.conn.transport.name;
      console.log(`⬆️ Transport upgraded: ${transport.toUpperCase()} → ${upgradedTransport.toUpperCase()}`);
    });

    socket.on('authenticate', async (userId) => {
      try {
        socket.userId = userId;
        connectedUsers.set(userId, { socketId: socket.id, isOnline: true });
        
        await User.findByIdAndUpdate(userId, { 
          isOnline: true, 
          lastSeen: new Date() 
        });

        const chats = await Chat.find({ participants: userId }).select('_id');
        chats.forEach(chat => {
          socket.join(chat._id.toString());
        });

        socket.broadcast.emit('user_online', userId);
        console.log(`✅ User ${userId} authenticated via ${socket.conn.transport.name.toUpperCase()}`);
      } catch (error) {
        console.error('❌ Authentication error:', error);
      }
    });

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`🏠 User ${socket.userId} joined chat ${chatId}`);
    });

    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`🚪 User ${socket.userId} left chat ${chatId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { chatId, senderId, text, type = 'text', replyTo, fileName, fileSize, duration } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        const newMessage = {
          senderId,
          text,
          type,
          timestamp: new Date(),
          status: 'sent',
          reactions: [],
          ...(replyTo && { replyTo }),
          ...(fileName && { fileName }),
          ...(fileSize && { fileSize }),
          ...(duration && { duration })
        };

        chat.messages.push(newMessage);
        chat.lastMessage = {
          text,
          timestamp: newMessage.timestamp,
          senderId
        };
        chat.lastUpdated = new Date();

        chat.unreadCount = chat.unreadCount.map(uc => {
          if (uc.userId.toString() !== senderId) {
            uc.count += 1;
          }
          return uc;
        });

        await chat.save();

        const populatedChat = await Chat.findById(chatId)
          .populate("messages.senderId", "name profilePic");
        const sentMessage = populatedChat.messages[populatedChat.messages.length - 1];

        const formattedMessage = {
          id: sentMessage._id,
          text: sentMessage.text,
          timestamp: formatTimestamp(sentMessage.timestamp),
          status: sentMessage.status,
          type: sentMessage.type,
          reactions: [],
          replyTo: sentMessage.replyTo,
          fileName: sentMessage.fileName,
          fileSize: sentMessage.fileSize,
          duration: sentMessage.duration,
          senderInfo: {
            id: sentMessage.senderId._id,
            name: sentMessage.senderId.name,
            profilePic: sentMessage.senderId.profilePic
          }
        };

        console.log(`💬 Broadcasting message via ${socket.conn.transport.name.toUpperCase()}`);
        
        io.to(chatId).emit('receive_message', {
          chatId,
          message: formattedMessage,
          senderId
        });

        console.log(`✅ Message sent in chat ${chatId} by ${senderId}`);
      } catch (error) {
        console.error('❌ Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('add_reaction', async (data) => {
      try {
        const { chatId, messageId, userId, emoji } = data;
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const message = chat.messages.id(messageId);
        if (!message) return;

        const existingReactionIndex = message.reactions.findIndex(
          r => r.userId.toString() === userId && r.emoji === emoji
        );

        let added = false;
        if (existingReactionIndex > -1) {
          message.reactions.splice(existingReactionIndex, 1);
        } else {
          message.reactions.push({ userId, emoji });
          added = true;
        }

        await chat.save();

        io.to(chatId).emit('reaction_updated', {
          chatId,
          messageId,
          reactions: message.reactions,
          userId,
          added
        });
      } catch (error) {
        console.error('❌ Add reaction error:', error);
      }
    });

    socket.on('delete_message', async (data) => {
      try {
        const { chatId, messageId, userId } = data;
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        const message = chat.messages.id(messageId);
        if (!message || message.senderId.toString() !== userId) return;

        message.isDeleted = true;
        message.deletedAt = new Date();
        message.text = "This message was deleted";

        await chat.save();

        io.to(chatId).emit('message_deleted', { chatId, messageId });
      } catch (error) {
        console.error('❌ Delete message error:', error);
      }
    });

    socket.on('typing', (data) => {
      const { chatId, isTyping } = data;
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        isTyping,
        chatId
      });
    });

    socket.on('mark_messages_read', async (data) => {
      try {
        const { chatId, userId } = data;
        await markMessagesAsRead(chatId, userId);
        
        socket.to(chatId).emit('messages_read', { chatId, userId });
      } catch (error) {
        console.error('❌ Mark messages read error:', error);
      }
    });

    socket.on('disconnect', async () => {
      const transport = socket.conn.transport.name;
      console.log(`👋 User disconnected: ${socket.id} via ${transport.toUpperCase()}`);
      
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        
        try {
          await User.findByIdAndUpdate(socket.userId, { 
            isOnline: false, 
            lastSeen: new Date() 
          });

          socket.broadcast.emit('user_offline', socket.userId);
        } catch (error) {
          console.error('❌ Disconnect error:', error);
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  if (date >= today) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  } else if (date >= yesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-GB');
  }
};
