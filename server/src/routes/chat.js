import express from "express";
import { createChat, getUserChats, getChatById } from "../controllers/chatController.js";

const router = express.Router();

// create or get existing chat
router.post("/", createChat);

// get all chats of a user
router.get("/user/:userId", getUserChats);

// get specific chat with messages
router.get("/:chatId", getChatById);

export default router;
