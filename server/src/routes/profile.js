import { Router } from 'express';
import auth from '../middlewares/auth.js'; 
import { getProfile, updateProfile } from '../controllers/profileController.js';

const router = Router();

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);

export default router;
