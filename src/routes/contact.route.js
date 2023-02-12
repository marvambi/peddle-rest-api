import { Router } from 'express';
import { contactUs } from '../controllers/contact.controller';
const router = Router();

import protect from '../middleWare/auth.middleware';

router.post('contact/', protect, contactUs);

export default router;