import Chat from "../models/Chat.js";

// ✅ Create a chat between buyer & seller
export const createChat = async (req, res) => {
  try {
    const { buyerId, sellerId } = req.body;
    
    if (!buyerId || !sellerId) {
      return res.status(400).json({ error: "buyerId and sellerId required" });
    }

    // check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [buyerId, sellerId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [buyerId, sellerId],
        messages: [],
        lastUpdated: new Date(),
      });
    }

    // populate before sending back
    chat = await chat.populate("participants", "id name email");

    res.status(200).json(chat);
  } catch (error) {
    console.error("❌ Create Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all chats of a user (with populated participants & last message)
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "id name email")
      .populate("messages") // optional: populate full messages
      .sort({ lastUpdated: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error("❌ Get User Chats Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get a single chat by ID (with participants + messages)
export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("participants", "id name email")
      .populate("messages");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("❌ Get Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
