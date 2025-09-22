import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import auth from '../middlewares/auth.js';
import { uploadProfilePic } from '../middlewares/upload.js';

const router = Router();

router.get('/', auth, getProfile);

router.put('/', auth, uploadProfilePic.single('profilePic'), updateProfile);

export default router;
