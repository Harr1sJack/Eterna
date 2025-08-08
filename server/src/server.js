import './configs/env.js'
import express from 'express';
import cors from 'cors';
import http from 'http';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import categoryRoutes from "./routes/category.js";
import { initSocket } from './socket.js';
import ConnectDB from'./configs/db.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/categories", categoryRoutes);

const httpServer = http.createServer(app);

ConnectDB().then(()=>{
    initSocket(httpServer);
    httpServer.listen(PORT, () => console.log('Server on', PORT));

}).catch(err => console.error(err));