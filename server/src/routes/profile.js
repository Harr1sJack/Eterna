import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js'; // same as category upload

const router = Router();

router.get('/', auth, getProfile);

router.put('/', auth, upload.single('profilePic'), updateProfile);

export default router;
