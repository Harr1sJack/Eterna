import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { getIO } from "../socket.js";

export const createChat = async (req, res) => {
  try {
    const { participants, productId, isGroup = false, name } = req.body;
    
    if (!participants || participants.length < 2) {
      return res.status(400).json({ error: "At least 2 participants required" });
    }

    if (!isGroup && participants.length === 2) {
      let existingChat = await Chat.findOne({
        participants: { $all: participants },
        isGroup: false,
        ...(productId && { product: productId })
      }).populate("participants", "name email profilePic isOnline lastSeen");

      if (existingChat) {
        const formattedChat = await formatChatForFrontend(existingChat, req.user.id);
        return res.status(200).json(formattedChat);
      }
    }

    const chatData = {
      participants,
      isGroup,
      messages: [],
      lastUpdated: new Date(),
      unreadCount: participants.map(userId => ({ userId, count: 0 }))
    };

    if (productId) chatData.product = productId;
    if (name) chatData.name = name;

    const chat = await Chat.create(chatData);
    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "name email profilePic isOnline lastSeen")
      .populate("product", "title");

    const formattedChat = await formatChatForFrontend(populatedChat, req.user.id);
    res.status(201).json(formattedChat);
  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { search } = req.query;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    let query = { participants: userId };
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const users = await User.find({ name: searchRegex }).select('_id');
      const userIds = users.map(u => u._id);
      
      query.$or = [
        { participants: { $in: userIds } },
        { 'lastMessage.text': searchRegex }
      ];
    }

    const chats = await Chat.find(query)
      .populate("participants", "name email profilePic isOnline lastSeen")
      .populate("lastMessage.senderId", "name")
      .populate("product", "title")
      .sort({ lastUpdated: -1 });

    const formattedChats = await Promise.all(
      chats.map(chat => formatChatForFrontend(chat, userId))
    );

    res.status(200).json(formattedChats);
  } catch (error) {
    console.error("Get User Chats Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await Chat.findById(chatId)
      .populate("participants", "name email profilePic isOnline lastSeen")
      .populate("messages.senderId", "name profilePic")
      .populate("product", "title");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    await markMessagesAsRead(chatId, userId);

    const formattedChat = await formatChatForFrontend(chat, userId, true);
    res.status(200).json(formattedChat);
  } catch (error) {
    console.error("Get Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, text, type = 'text', replyTo, fileName, fileSize, duration } = req.body;

    if (req.user.id !== senderId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.participants.includes(senderId)) {
      return res.status(403).json({ error: "Access denied" });
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

    const io = getIO();
    io.to(chatId).emit('receive_message', {
      chatId,
      message: {
        id: sentMessage._id,
        text: sentMessage.text,
        timestamp: formatTimestamp(sentMessage.timestamp),
        sent: false,
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
      },
      senderId
    });

    res.status(201).json({ message: sentMessage, chatId: chat._id });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { userId, emoji } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // CHANGED: Check if the same emoji already exists
    const existingReaction = message.reactions.find(r => r.emoji === emoji);

    if (existingReaction) {
      // If same emoji exists, remove it (toggle off)
      message.reactions = [];
    } else {
      // Replace all reactions with this single new one
      message.reactions = [{ userId, emoji }];
    }

    await chat.save();

    const io = getIO();
    io.to(chatId).emit('reaction_updated', {
      chatId,
      messageId,
      reactions: message.reactions,
      userId,
      added: !existingReaction
    });

    res.status(200).json({ message: "Reaction updated" });
  } catch (error) {
    console.error("Add Reaction Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { userId } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: "Can only delete your own messages" });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.text = "This message was deleted";

    if (chat.messages[chat.messages.length - 1]._id.toString() === messageId) {
      const lastVisibleMessage = chat.messages
        .filter(m => !m.isDeleted)
        .pop();
      
      if (lastVisibleMessage) {
        chat.lastMessage = {
          text: lastVisibleMessage.text,
          timestamp: lastVisibleMessage.timestamp,
          senderId: lastVisibleMessage.senderId
        };
      }
    }

    await chat.save();

    const io = getIO();
    io.to(chatId).emit('message_deleted', { chatId, messageId });

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const io = getIO();
    io.to(chatId).emit('chat_deleted', { chatId });

    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: "Chat deleted" });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const markMessagesAsRead = async (chatId, userId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    let hasChanges = false;
    chat.messages.forEach(message => {
      if (message.senderId.toString() !== userId) {
        if (message.status === 'sent') {
          message.status = 'delivered';
          hasChanges = true;
        } else if (message.status === 'delivered') {
          message.status = 'read';
          hasChanges = true;
        }
      }
    });

    const userUnreadCount = chat.unreadCount.find(uc => uc.userId.toString() === userId);
    if (userUnreadCount && userUnreadCount.count > 0) {
      userUnreadCount.count = 0;
      hasChanges = true;
    }

    if (hasChanges) {
      await chat.save();
    }
  } catch (error) {
    console.error("Mark Messages Read Error:", error);
  }
};

export const setTypingStatus = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId, isTyping } = req.body;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (isTyping) {
      if (!chat.typingUsers.includes(userId)) {
        chat.typingUsers.push(userId);
      }
    } else {
      chat.typingUsers = chat.typingUsers.filter(id => id.toString() !== userId);
    }

    await chat.save();

    const io = getIO();
    io.to(chatId).emit('user_typing', { userId, isTyping, chatId });

    res.status(200).json({ message: "Typing status updated" });
  } catch (error) {
    console.error("Set Typing Status Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper functions
const formatChatForFrontend = async (chat, currentUserId, includeMessages = false) => {
  const otherParticipant = chat.participants.find(p => p._id.toString() !== currentUserId);
  const userUnreadCount = chat.unreadCount.find(uc => uc.userId.toString() === currentUserId);
  
  const result = {
    id: chat._id,
    name: chat.isGroup ? chat.name : (otherParticipant?.name || 'Unknown User'),
    avatar: chat.isGroup ? chat.avatar : (otherParticipant?.profilePic || '/profile/default.png'),
    lastMessage: chat.lastMessage?.text || 'No messages',
    timestamp: chat.lastMessage?.timestamp ? formatTimestamp(chat.lastMessage.timestamp) : '',
    unreadCount: userUnreadCount?.count || 0,
    isOnline: chat.isGroup ? false : (otherParticipant?.isOnline || false),
    isGroup: chat.isGroup,
    participants: chat.participants,
    product: chat.product
  };

  if (includeMessages) {
    result.messages = chat.messages
      .filter(msg => !msg.isDeleted)
      .map(msg => ({
        id: msg._id,
        text: msg.text,
        timestamp: formatTimestamp(msg.timestamp),
        sent: msg.senderId._id.toString() === currentUserId,
        status: msg.status,
        type: msg.type,
        reactions: msg.reactions?.map(r => r.emoji) || [],
        replyTo: msg.replyTo,
        fileName: msg.fileName,
        fileSize: msg.fileSize,
        duration: msg.duration
      }));
  }

  return result;
};

const formatTimestamp = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  
  if (now.toDateString() === messageDate.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (now.getDate() - messageDate.getDate() === 1) {
    return 'Yesterday';
  } else {
    return messageDate.toLocaleDateString();
  }
};
