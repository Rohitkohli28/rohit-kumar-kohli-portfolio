import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { env } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';

// Ensure exact unaltered original resume PDF is synced to public/ directory
try {
  const originalPdfPath = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\713f1800-5aed-49f9-86a1-ef58427d8c06\\media__1785165878562.pdf';
  const targetPublicPdf = path.join(process.cwd(), '..', 'public', 'Rohit_Kumar_Kohli_Resume.pdf');
  const targetLocalPublicPdf = path.join(process.cwd(), 'public', 'Rohit_Kumar_Kohli_Resume.pdf');
  if (fs.existsSync(originalPdfPath)) {
    fs.copyFileSync(originalPdfPath, targetPublicPdf);
    if (fs.existsSync(path.dirname(targetLocalPublicPdf))) {
      fs.copyFileSync(originalPdfPath, targetLocalPublicPdf);
    }
    console.log(`✅ [Resume Sync] Successfully synced original unaltered PDF resume (${fs.statSync(targetPublicPdf).size} bytes)`);
  }
} catch (err) {
  console.warn('[Resume Sync Warning]', err);
}

const app = express();

// Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow for development flexibility
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Rate Limiter
app.use('/api', generalRateLimiter);

// Serve static assets from public folder
const publicPath = path.join(process.cwd(), '..', 'public');
app.use(express.static(publicPath));

// API Routes
app.use('/api', healthRoutes);
app.use('/api', contactRoutes);
app.use('/api', statsRoutes);
app.use('/api', geminiRoutes);
app.use('/api', resumeRoutes);

// Centralized Error Handler
app.use(errorHandler);

export default app;
