import { Router } from 'express';
import {
  analyzeSymptomsController,
  analyzeResumeController,
  chatAssistantController
} from '../controllers/geminiController.js';

const router = Router();

router.post('/gemini/symptom-analyze', analyzeSymptomsController);
router.post('/gemini/resume-analyze', analyzeResumeController);
router.post(['/chat', '/ai-assistant'], chatAssistantController);

export default router;
