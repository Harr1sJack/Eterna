import { Server } from 'socket.io';
import Chat from './models/Chat.js';

export const initSocket = httpServer => {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', socket => {
    /* client joins a unique room = chatId */
    socket.on('joinChat', chatId => socket.join(chatId));

    /* client sends a message */
    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
      const message = { senderId, text, timestamp: new Date() };

      // push message in DB
      await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: message },
          $set:  { lastUpdated: new Date() }
        },
        { new: true }
      );

      // broadcast only to participants in that room
      io.to(chatId).emit('newMessage', message);
    });
  });
};
