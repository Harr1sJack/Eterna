import express from 'express';
import {
  getPendingProducts,
  createProduct,
  getMyProducts,
  getAllProducts,
  getApprovedProducts,
  getProductById,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController.js';
import auth from '../middlewares/auth.js';
import { uploadProductImage, handleMulterError } from '../middlewares/upload.js';

const router = express.Router();

// GET routes
router.get('/all', getAllProducts);
router.get('/approved', getApprovedProducts);
router.get('/pending', getPendingProducts);
router.get('/myproducts', auth, getMyProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);

// DELETE route
router.delete("/:id", deleteProduct);

// POST route - multer middleware is present but product creation works without depending on it
router.post(
  '/',
  auth,
  // Multer middleware - handles files if present, but doesn't cause errors if absent
  (req, res, next) => {
    // Custom middleware to make multer optional
    uploadProductImage.array('productImage', 5)(req, res, (err) => {
      if (err) {
        console.log('Multer error (non-critical):', err.message);
        // Continue anyway - Firebase upload doesn't need multer
        req.files = req.files || [];
      }
      next();
    });
  },
  handleMulterError, // This now handles errors gracefully
  createProduct
);

export default router;
