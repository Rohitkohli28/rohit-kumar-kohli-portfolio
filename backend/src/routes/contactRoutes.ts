import { Router } from 'express';
import { submitContactFormController } from '../controllers/contactController.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';
import { validateContactInput } from '../middleware/validation.js';

const router = Router();

router.post('/contact', contactRateLimiter, validateContactInput, submitContactFormController);

export default router;
