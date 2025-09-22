import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// --- Basic Setup for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Directory Creation ---
const uploadsDir = path.join(__dirname, '../../uploads');

// **CORRECTED**: Match your existing singular folder names
const subdirectories = ['profile', 'chats', 'product', 'category'];
subdirectories.forEach(dir => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// --- Storage Configurations ---
const createStorage = (folder, prefix) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadsDir, folder));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`;
      cb(null, fileName);
    }
  });
};

// **CORRECTED**: Now uses your existing singular folder names
const profileStorage = createStorage('profile', 'profile');
const chatStorage = createStorage('chats', 'chatfile');
const productStorage = createStorage('product', 'product');
const categoryStorage = createStorage('category', 'category');

// --- File Filter Configurations ---
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type: only images are allowed.'), false);
  }
};

const chatFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/mpeg', 'video/quicktime',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'application/pdf', 'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type: this file type is not permitted in chat.'), false);
  }
};

// --- Multer Instances ---
export const uploadProfilePic = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadChatFile = multer({
  storage: chatStorage,
  fileFilter: chatFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

export const uploadProductImage = multer({
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// --- Centralized Error Handling Middleware ---
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};
