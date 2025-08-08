import Chat from "../models/Chat.js";

/**
 * Create or fetch one-to-one chat for a product
 */
export const createOrFetchChat = async (req, res) => {
  try {
    const { buyerId, sellerId, productId } = req.body;

    // Ensure array is always sorted so order doesn't matter
    const participants = [buyerId, sellerId].sort();
    let chat = await Chat.findOne({ participants, productId });

    if (!chat) {
      chat = await Chat.create({ participants, productId });
    }

    res.json({ chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create or fetch chat" });
  }
};

/**
 * Get full message history for a chat
 */
export const getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("messages.senderId", "name profilePic");

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

/**
 * List chats for a user (sidebar)
 */
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId })
      .populate("productId", "title images")
      .select("participants productId lastUpdated");

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user chats" });
  }
};
