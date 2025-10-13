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
import adminRoutes from "./routes/admin.js";

// 🔥 FIX: Use PORT environment variable (required for Cloud Run)
const PORT = process.env.PORT || 8080; // Changed from 5000 to 8080

const app = express();

// 🔥 COMPLETELY OPEN CORS
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["*"], // Allow all headers
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Get correct directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve /uploads folder publicly
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    port: PORT,
    timestamp: new Date().toISOString(),
    cors: 'fully open'
  });
});

// Routes
app.use("/api/products", adminRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/chats", chatRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const httpServer = http.createServer(app);

ConnectDB()
  .then(() => {
    initSocket(httpServer);
    // 🔥 CRITICAL: Listen on 0.0.0.0 (all interfaces) with PORT from environment
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Server running on port', PORT);
      console.log('✅ CORS fully open for all origins');
      console.log('🔧 Environment PORT:', process.env.PORT);
    });
  })
  .catch(err => {
    console.error('❌ Server startup error:', err);
    process.exit(1); // Exit on error
  });
