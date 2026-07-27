import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { ResumeAnalytics } from '../models/ResumeAnalytics.js';
import { logger } from '../utils/logger.js';

export async function downloadResumeController(req: Request, res: Response): Promise<void> {
  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1')
    .split(',')[0]
    .trim();
  const userAgent = req.headers['user-agent'] || '';

  // Track analytics in MongoDB asynchronously
  try {
    await ResumeAnalytics.create({
      ipAddress: clientIp,
      userAgent,
      downloadedAt: new Date()
    });
    logger.info(`📄 [Resume Download] Downloaded by IP: ${clientIp}`);
  } catch (err: any) {
    logger.warn('[Resume Analytics Save Error]:', err.message);
  }

  // Look for PDF file in public/ directory or root public/
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'Rohit_Kumar_Kohli_Resume.pdf'),
    path.join(process.cwd(), '..', 'public', 'Rohit_Kumar_Kohli_Resume.pdf'),
    path.join(process.cwd(), 'dist', 'Rohit_Kumar_Kohli_Resume.pdf')
  ];

  let pdfPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      pdfPath = p;
      break;
    }
  }

  if (!pdfPath) {
    res.status(404).json({
      success: false,
      message: 'Resume PDF file not found on server.'
    });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Rohit_Kumar_Kohli_Resume.pdf"');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const readStream = fs.createReadStream(pdfPath);
  readStream.pipe(res);
}
