import express from 'express';
import {
  getPendingProducts,
  createProduct,
  getMyProducts,
  getAllProducts,
  getApprovedProducts,
  getProductById
} from '../controllers/productController.js';
import auth from '../middlewares/auth.js';
import { uploadProductImage, handleMulterError } from '../middlewares/upload.js';

const router = express.Router();

router.get('/all', getAllProducts);
router.get('/approved', getApprovedProducts);
router.get('/pending', getPendingProducts);
router.get('/myproducts', auth, getMyProducts);
router.get('/:id', getProductById);

// Use the correct middleware for creating a product
router.post(
  '/',
  auth,
  uploadProductImage.array('productImage', 5), // Use 'uploadProductImage'
  handleMulterError, // Add the error handler
  createProduct
);

export default router;