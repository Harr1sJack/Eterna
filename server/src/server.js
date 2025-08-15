import './configs/env.js';

import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import { initSocket } from './socket.js';
import ConnectDB from './configs/db.js';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Get correct directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve /uploads folder publicly
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const httpServer = http.createServer(app);

ConnectDB()
  .then(() => {
    initSocket(httpServer);
    httpServer.listen(PORT, () => console.log('Server on', PORT));
  })
  .catch(err => console.error(err));
