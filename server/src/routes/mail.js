import { Router } from 'express';
import { sendContactEmail } from '../controllers/mailController.js';

const router = Router();

router.post('/contact', sendContactEmail);

export default router;
