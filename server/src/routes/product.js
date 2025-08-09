import express from 'express';
import { getProducts, createProduct, getMyProducts } from '../controllers/productController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/myproducts', auth, getMyProducts);
router.post('/', auth, createProduct);

export default router;
