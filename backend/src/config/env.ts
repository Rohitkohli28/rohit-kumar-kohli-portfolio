import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();
// Also attempt loading root .env if running locally
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rohit_portfolio',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:3000',
  
  // SMTP credentials
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || 'kohlirohit2428@gmail.com',
  SMTP_PASS: (process.env.SMTP_PASS || process.env.EMAIL_PASS || 'pycw qgja dzyt ddyt').replace(/\s+/g, ''),
  SMTP_FROM: process.env.SMTP_FROM || `"Rohit's Portfolio" <${process.env.SMTP_USER || 'kohlirohit2428@gmail.com'}>`,
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || process.env.PORTFOLIO_OWNER_EMAIL || 'kohlirohit2428@gmail.com',

  // API Keys & Tokens
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'Rohitkohli28',
  LEETCODE_USERNAME: process.env.LEETCODE_USERNAME || 'Rohit2028',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};
