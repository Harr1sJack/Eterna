import { Router } from 'express';
import Chat from '../models/Chat.js';
import auth from '../middlewares/auth.js';

const router = Router();

/* Create or fetch one‑to‑one chat for a product */
router.post('/', auth, async (req, res) => {
  const { buyerId, sellerId, productId } = req.body;

  // Ensure array is always [buyerId, sellerId] sorted by string
  const participants = [buyerId, sellerId].sort();
  let chat = await Chat.findOne({ participants, productId });

  if (!chat) chat = await Chat.create({ participants, productId });
  res.json({ chatId: chat._id });
});

/* Get full message history */
router.get('/:chatId', auth, async (req, res) => {
  const chat = await Chat.findById(req.params.chatId)
    .populate('messages.senderId', 'name profilePic');
  res.json(chat);
});

/* List chats for sidebar */
router.get('/user/:userId', auth, async (req, res) => {
  const chats = await Chat.find({ participants: req.params.userId })
    .populate('productId', 'title images')
    .select('participants productId lastUpdated');
  res.json(chats);
});

export default router;
