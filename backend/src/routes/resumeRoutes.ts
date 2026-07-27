import { Router } from 'express';
import { downloadResumeController } from '../controllers/resumeController.js';

const router = Router();

router.get(['/resume/download', '/resume'], downloadResumeController);

export default router;
