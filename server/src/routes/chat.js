import express from "express";
import {
  createChat,
  getUserChats,
  getChatById,
  sendMessage,
  addReaction,
  deleteMessage,
  deleteChat,
  setTypingStatus,
  markMessagesAsRead
} from "../controllers/chatController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// All chat routes require authentication using your existing middleware
router.use(auth);

router.post("/", createChat);
router.get("/user/:userId", getUserChats);
router.get("/:chatId", getChatById);
router.delete("/:chatId", deleteChat);
router.post("/:chatId/messages", sendMessage);
router.delete("/:chatId/messages/:messageId", deleteMessage);
router.put("/:chatId/messages/read", (req, res) => {
  markMessagesAsRead(req.params.chatId, req.body.userId)
    .then(() => res.status(200).json({ message: "Messages marked as read" }))
    .catch(error => res.status(500).json({ error: "Server error" }));
});
router.post("/:chatId/messages/:messageId/reactions", addReaction);
router.post("/:chatId/typing", setTypingStatus);

export default router;
