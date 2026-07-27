import { Request, Response } from 'express';
import {
  analyzeSymptomsService,
  analyzeResumeService,
  chatAssistantService
} from '../services/geminiService.js';

export async function analyzeSymptomsController(req: Request, res: Response): Promise<void> {
  const { symptoms, gender, age, duration } = req.body;
  if (!symptoms) {
    res.status(400).json({ error: 'Symptoms description is required.' });
    return;
  }
  const result = await analyzeSymptomsService({ symptoms, gender, age, duration });
  res.json(result);
}

export async function analyzeResumeController(req: Request, res: Response): Promise<void> {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText) {
    res.status(400).json({ error: 'Resume text is required.' });
    return;
  }
  const result = await analyzeResumeService({ resumeText, jobDescription });
  res.json(result);
}

export async function chatAssistantController(req: Request, res: Response): Promise<void> {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required.' });
    return;
  }
  const result = await chatAssistantService({ message, history });
  res.json(result);
}
