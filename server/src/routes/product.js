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
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/all', getAllProducts);
router.get('/approved',getApprovedProducts);
router.get('/pending', getPendingProducts);
router.get('/myproducts', auth, getMyProducts);
router.get('/:id', getProductById);

router.post('/', auth, upload.array('productImage', 5), createProduct);

export default router;
