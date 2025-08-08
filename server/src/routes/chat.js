import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createOrFetchChat, getChatHistory, getUserChats } from "../controllers/chatController.js";

const router = Router();

router.post("/", auth, createOrFetchChat);
router.get("/:chatId", auth, getChatHistory);
router.get("/user/:userId", auth, getUserChats);

export default router;
