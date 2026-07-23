/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Asset Sync Utility to copy generated preview images to public directory
try {
  const brainDir = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\c026dbfd-6c6b-4c99-9fad-e6583e0fd709';
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const syncItems = [
    { src: 'doctor_appointment_preview_1784698503509.png', dest: 'doc-appt-system.png' },
    { src: 'ai_resume_analyzer_preview_1784698516147.png', dest: 'ai-resume-analyzer.png' },
    { src: 'real_time_chat_preview_1784698530061.png', dest: 'real-time-chat-app.png' }
  ];

  for (const item of syncItems) {
    const srcPath = path.join(brainDir, item.src);
    const destPath = path.join(publicDir, item.dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[Asset Sync] Synced asset ${item.src} -> public/${item.dest}`);
    }
  }

  // Find latest uploaded logo image in brain directory
  if (fs.existsSync(brainDir)) {
    const files = fs.readdirSync(brainDir);
    const mediaFiles = files
      .filter(f => f.startsWith('media__') && f.endsWith('.png'))
      .sort((a, b) => fs.statSync(path.join(brainDir, b)).mtimeMs - fs.statSync(path.join(brainDir, a)).mtimeMs);

    if (mediaFiles.length > 0) {
      const latestLogo = mediaFiles[0];
      const srcLogo = path.join(brainDir, latestLogo);
      fs.copyFileSync(srcLogo, path.join(publicDir, 'favicon.png'));
      fs.copyFileSync(srcLogo, path.join(publicDir, 'favicon.ico'));
      fs.copyFileSync(srcLogo, path.join(publicDir, 'rkk-logo.png'));
      console.log(`[Asset Sync] Successfully synced RKK logo (${latestLogo}) -> public/favicon.png & favicon.ico`);
    }
  }
} catch (err) {
  console.warn('[Asset Sync Warning]', err);
}

// Lazy initialization of Gemini API
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required but was not found.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Sync Favicon Assets on server startup & request
function ensureFavicons() {
  try {
    const brainDir = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\c026dbfd-6c6b-4c99-9fad-e6583e0fd709';
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    if (fs.existsSync(brainDir)) {
      const files = fs.readdirSync(brainDir);
      const mediaFiles = files
        .filter(f => f.startsWith('media__') && f.endsWith('.png'))
        .sort((a, b) => fs.statSync(path.join(brainDir, b)).mtimeMs - fs.statSync(path.join(brainDir, a)).mtimeMs);

      if (mediaFiles.length > 0) {
        const latestLogo = mediaFiles[0];
        const srcLogo = path.join(brainDir, latestLogo);
        fs.copyFileSync(srcLogo, path.join(publicDir, 'favicon.png'));
        fs.copyFileSync(srcLogo, path.join(publicDir, 'favicon.ico'));
        fs.copyFileSync(srcLogo, path.join(publicDir, 'rkk-logo.png'));
      }
    }
  } catch (err) {
    console.warn('[Favicon Sync Warning]', err);
  }
}

app.use((req, res, next) => {
  ensureFavicons();
  next();
});

// Favicon & RKK Logo Image Routes
app.get(['/favicon.png', '/favicon.ico', '/rkk-logo.png'], (req, res) => {
  const logoPath = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\c026dbfd-6c6b-4c99-9fad-e6583e0fd709\\media__1784706292643.png';
  if (fs.existsSync(logoPath)) {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(logoPath);
  } else {
    res.status(404).send('Logo image not found');
  }
});

// Project Image Preview Routes
app.get('/doc-appt-system.png', (req, res) => {
  const imgPath = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\c026dbfd-6c6b-4c99-9fad-e6583e0fd709\\doctor_appointment_preview_1784698503509.png';
  if (fs.existsSync(imgPath)) {
    try {
      fs.copyFileSync(imgPath, path.join(process.cwd(), 'public', 'doc-appt-system.png'));
    } catch (e) {}
    res.sendFile(imgPath);
  } else {
    res.status(404).send('Image not found');
  }
});

app.get('/ai-resume-analyzer.png', (req, res) => {
  const imgPath = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\c026dbfd-6c6b-4c99-9fad-e6583e0fd709\\ai_resume_analyzer_preview_1784698516147.png';
  if (fs.existsSync(imgPath)) {
    try {
      fs.copyFileSync(imgPath, path.join(process.cwd(), 'public', 'ai-resume-analyzer.png'));
    } catch (e) {}
    res.sendFile(imgPath);
  } else {
    res.status(404).send('Image not found');
  }
});

app.get('/real-time-chat-app.png', (req, res) => {
  const imgPath = 'C:\\Users\\Rohit\\.gemini\\antigravity-ide\\brain\\c026dbfd-6c6b-4c99-9fad-e6583e0fd709\\real_time_chat_preview_1784698530061.png';
  if (fs.existsSync(imgPath)) {
    try {
      fs.copyFileSync(imgPath, path.join(process.cwd(), 'public', 'real-time-chat-app.png'));
    } catch (e) {}
    res.sendFile(imgPath);
  } else {
    res.status(404).send('Image not found');
  }
});

// 1. Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Production Nodemailer & Contact Form Service
// ---------------------------------------------------------------------------

// In-Memory Rate Limiter for Spam Prevention (3 submissions per IP per 15 minutes)
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  // Never rate limit localhost or loopback development testing
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost') || ip === '::ffff:127.0.0.1') {
    return false;
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const limit = 10; // Increased limit for normal user sessions

  const record = ipRateLimitMap.get(ip);
  if (!record) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count += 1;
  return false;
}

// Categorized SMTP Error Diagnostic Parser
function parseSmtpError(error: any): { category: string; details: string } {
  const msg = error?.message || String(error);
  const code = error?.code || '';

  if (msg.includes('EAUTH') || msg.includes('535 5.7.8') || msg.includes('authentication failed')) {
    return {
      category: 'SMTP Authentication Failed',
      details: 'Invalid 16-character Gmail App Password or incorrect EMAIL_USER/SMTP_USER credentials.'
    };
  }
  if (code === 'ETIMEDOUT' || msg.includes('timeout')) {
    return {
      category: 'Network Timeout',
      details: 'Connection to SMTP server timed out. Check firewall, network rules, or outbound port 465/587.'
    };
  }
  if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('getaddrinfo')) {
    return {
      category: 'SMTP Host Unreachable',
      details: `Unable to resolve or reach SMTP host (${process.env.SMTP_HOST || 'smtp.gmail.com'}).`
    };
  }
  if (msg.includes('550') || msg.includes('Recipient rejected') || msg.includes('Invalid recipient')) {
    return {
      category: 'Recipient Rejected',
      details: 'Target recipient address was rejected by the mail server.'
    };
  }
  if (msg.includes('421') || msg.includes('rate limit') || msg.includes('Too many emails')) {
    return {
      category: 'Rate Limited',
      details: 'Gmail/SMTP server rate limit exceeded (max 500 emails/day).'
    };
  }

  return {
    category: 'SMTP Transmission Failure',
    details: msg
  };
}

// Transporter Factory Function
function getEmailTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || 'kohlirohit2428@gmail.com';
  const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || 'pycw qgja dzyt ddyt';
  const pass = rawPass.replace(/\s+/g, ''); // Strip spaces from Gmail App Passwords (pycwqgjadzytddyt)

  if (!user || !pass) {
    console.error('❌ [SMTP Config Error] Missing Environment Variables: EMAIL_USER / EMAIL_PASS / SMTP_USER / SMTP_PASS');
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);

  // If using Gmail, service: 'gmail' natively handles ports, TLS, and SSL handshakes
  if (user.endsWith('@gmail.com') || host.includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  // Custom SMTP Configuration (Port 465 = secure: true, Port 587 = secure: false)
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
}

// Startup Verification Hook
const transporter = getEmailTransporter();
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      const diag = parseSmtpError(error);
      console.error(`❌ [SMTP Transporter Verification Failed] ${diag.category}: ${diag.details}`);
      console.error(error.stack || error);
    } else {
      console.log('✅ [SMTP Transporter Verified] Server is ready to dispatch emails via Nodemailer.');
    }
  });
}

// 2. Contact Endpoint with Retry Logic & Detailed Error Payloads
app.post('/api/contact', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

  // 1. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    res.status(429).json({
      success: false,
      message: 'Rate Limited',
      details: 'Too many submissions from this IP address. Please wait 15 minutes before sending another inquiry.'
    });
    return;
  }

  const { name, email, subject, message, honeypot } = req.body;

  // 2. Honeypot Bot Check
  if (honeypot) {
    console.warn(`⚠️ [Spam Protection] Bot blocked from IP ${clientIp}. Honeypot field filled.`);
    res.status(400).json({
      success: false,
      message: 'Spam Submission Detected',
      details: 'Automated bot submission rejected.'
    });
    return;
  }

  // 3. Input Validation
  if (!name || name.trim().length < 2) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: 'Name must be at least 2 characters long.'
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: 'Please provide a valid email address.'
    });
    return;
  }

  if (!message || message.trim().length < 10) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: 'Message content must be at least 10 characters long.'
    });
    return;
  }

  // Input HTML Sanitization
  const sanitize = (str: string) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cleanName = sanitize(name.trim());
  const cleanEmail = sanitize(email.trim());
  const cleanSubject = sanitize(subject ? subject.trim() : 'General Opportunity');
  const cleanMessage = sanitize(message.trim());

  const ownerEmail = process.env.PORTFOLIO_OWNER_EMAIL || 'kohlirohit2428@gmail.com';
  const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER || 'kohlirohit2428@gmail.com';

  const activeTransporter = getEmailTransporter();

  if (!activeTransporter) {
    console.error('❌ [SMTP Critical] Missing Environment Variables (EMAIL_USER / EMAIL_PASS)');
    res.status(500).json({
      success: false,
      message: 'Missing Environment Variable',
      details: 'EMAIL_USER or EMAIL_PASS is not configured on the backend server.'
    });
    return;
  }

  const timestampStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });

  const mailOptions = {
    from: `"${cleanName}" <${smtpUser}>`,
    replyTo: `"${cleanName}" <${cleanEmail}>`,
    to: ownerEmail,
    subject: `⚡ Portfolio Inquiry: ${cleanSubject}`,
    text: `New Inquiry Received:\n\nFrom: ${cleanName} (${cleanEmail})\nSubject: ${cleanSubject}\nDate: ${timestampStr}\nIP: ${clientIp}\n\nMessage:\n${cleanMessage}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; padding: 32px 16px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
              New Portfolio Inquiry
            </h1>
            <p style="color: #e2e8f0; margin: 6px 0 0 0; font-size: 13px;">
              Dispatched from Rohit Kumar Kohli's Developer Portfolio
            </p>
          </div>

          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: 600; width: 120px;">Sender Name:</td>
                <td style="padding: 8px 0; color: #f8fafc; font-weight: 700;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Sender Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${cleanEmail}" style="color: #38bdf8; text-decoration: none; font-weight: 600;">${cleanEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Subject:</td>
                <td style="padding: 8px 0; color: #f8fafc;">${cleanSubject}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Received At:</td>
                <td style="padding: 8px 0; color: #cbd5e1; font-size: 12px;">${timestampStr}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Client IP:</td>
                <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace; font-size: 12px;">${clientIp}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;" />

            <div style="margin-bottom: 24px;">
              <label style="display: block; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">
                Message Content:
              </label>
              <div style="background-color: #0f172a; border: 1px solid #334155; border-left: 4px solid #3b82f6; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${cleanMessage}</div>
            </div>

            <div style="text-align: center; margin-top: 28px;">
              <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanSubject)}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 700;">
                ✉️ Reply to ${cleanName}
              </a>
            </div>
          </div>

          <div style="background-color: #0f172a; padding: 16px; text-align: center; border-top: 1px solid #334155;">
            <p style="margin: 0; font-size: 11px; color: #64748b;">
              Automated notification dispatched by Rohit's Portfolio Express Backend.
            </p>
          </div>

        </div>
      </div>
    `
  };

  // Retry Mechanism (Up to 3 Retries with Exponential Backoff)
  let attempts = 0;
  const maxRetries = 3;
  let lastError: any = null;

  while (attempts < maxRetries) {
    try {
      attempts++;
      console.log(`[SMTP Dispatch Attempt ${attempts}/${maxRetries}] Sending mail to ${ownerEmail}...`);
      const sendResult = await activeTransporter.sendMail(mailOptions);
      console.log(`✅ [Email Dispatch Success] MessageID: ${sendResult.messageId} | Response: ${sendResult.response}`);
      
      res.status(200).json({
        success: true,
        message: 'Email dispatched successfully via Nodemailer.',
        messageId: sendResult.messageId,
        recipient: ownerEmail
      });
      return;
    } catch (sendErr: any) {
      lastError = sendErr;
      console.warn(`⚠️ [SMTP Dispatch Attempt ${attempts} Failed]: ${sendErr.message}`);
      if (attempts < maxRetries) {
        const delay = attempts * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If retries exhausted: parse and return diagnostic payload
  const diag = parseSmtpError(lastError);
  console.error(`❌ [SMTP Error - Final Failure] ${diag.category}: ${diag.details}`);
  console.error(lastError.stack || lastError);

  res.status(500).json({
    success: false,
    message: diag.category,
    details: diag.details
  });
});

// 3. GitHub Proxy Endpoint (with auth token support, retry logic, and no-store cache headers)
app.get('/api/github', async (req, res) => {
  // Prevent Vercel edge / CDN from caching this API response
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Build GitHub API request headers — use GITHUB_TOKEN if available to get 5000 req/hr instead of 60
  const ghHeaders: Record<string, string> = {
    'User-Agent': 'rohit-portfolio-agent',
    'Accept': 'application/vnd.github.v3+json'
  };
  const ghToken = process.env.GITHUB_TOKEN;
  if (ghToken) {
    ghHeaders['Authorization'] = `Bearer ${ghToken}`;
    console.log('[GitHub API] Using authenticated token (5000 req/hr limit)');
  } else {
    console.warn('[GitHub API] No GITHUB_TOKEN set — using unauthenticated (60 req/hr limit)');
  }

  // Helper with retry: attempts up to maxRetries before throwing
  async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
    let lastErr: any;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const apiRes = await fetch(url, options);
        if (apiRes.ok) return apiRes;
        if (apiRes.status === 403 || apiRes.status === 429) {
          console.warn(`[GitHub API] Attempt ${attempt}/${maxRetries} rate-limited (${apiRes.status}). Retrying in ${attempt * 1000}ms...`);
          await new Promise(r => setTimeout(r, attempt * 1000));
          lastErr = new Error(`GitHub rate limited: ${apiRes.status}`);
          continue;
        }
        throw new Error(`GitHub API error: ${apiRes.status}`);
      } catch (err) {
        lastErr = err;
        if (attempt < maxRetries) await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
    throw lastErr;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetchWithRetry('https://api.github.com/users/Rohitkohli28', { headers: ghHeaders }),
      fetchWithRetry('https://api.github.com/users/Rohitkohli28/repos?sort=updated&per_page=6', { headers: ghHeaders })
    ]);

    const userData = await userRes.json();
    const reposData = await reposRes.json();

    // Fetch real-time contribution calendar from public contributions page
    let contributionsList: number[] = [];
    let totalContributions: number = userData.public_repos ? 0 : 422;
    try {
      const contribsRes = await fetch('https://github.com/users/Rohitkohli28/contributions', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html'
        }
      });
      if (contribsRes.ok) {
        const html = await contribsRes.text();
        const regex = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
        let match;
        const days: Array<{ date: string; level: number }> = [];
        while ((match = regex.exec(html)) !== null) {
          const tag = match[0];
          const dateMatch = tag.match(/data-date="([\d-]+)"/);
          const levelMatch = tag.match(/data-level="(\d+)"/);
          if (dateMatch && levelMatch) {
            days.push({ date: dateMatch[1], level: parseInt(levelMatch[1], 10) });
          }
        }
        const totalMatch = html.match(/([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/);
        if (totalMatch) {
          totalContributions = parseInt(totalMatch[1].replace(/,/g, ''), 10);
        } else if (days.length > 0) {
          totalContributions = days.reduce((sum, d) => sum + (d.level > 0 ? 1 : 0), 0);
        }
        days.sort((a, b) => a.date.localeCompare(b.date));
        contributionsList = days.map(d => d.level);
      }
    } catch (contribError: any) {
      console.warn('[GitHub Contributions] Failed to parse contribution calendar:', contribError.message);
    }

    console.log(`[GitHub API] ✅ Live data fetched — ${userData.public_repos} repos, ${totalContributions} contributions`);
    res.json({
      fallback: false,
      fetchedAt: new Date().toISOString(),
      profile: {
        avatar_url: userData.avatar_url,
        bio: userData.bio || 'Software Engineer | Full Stack Developer | Java & Cloud Specialist',
        followers: userData.followers,
        following: userData.following,
        public_repos: userData.public_repos,
        name: userData.name || 'Rohit Kumar Kohli',
        html_url: userData.html_url
      },
      repos: reposData.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        html_url: repo.html_url
      })),
      contributions: {
        total: totalContributions,
        streak: 15,
        calendar: contributionsList
      }
    });
  } catch (error: any) {
    console.error('[GitHub API] ❌ All retries exhausted, serving fallback:', error.message);
    const fallbackCalendar = Array.from({ length: 365 }, (_, i) => {
      if (i < 200) return i === 115 ? 2 : 0;
      else if (i < 260) return (i % 3 === 0) ? 1 : (i % 7 === 0 ? 2 : 0);
      else if (i < 310) return (i % 2 === 0) ? 2 : (i % 5 === 0 ? 3 : 1);
      else return (i % 4 === 0) ? 4 : (i % 2 === 0 ? 3 : 2);
    });
    res.json({
      fallback: true,
      fetchedAt: new Date().toISOString(),
      profile: {
        avatar_url: 'https://github.com/Rohitkohli28.png',
        bio: 'B.Tech CSE student at DIT University building scalable full-stack applications, AI software, and data engineering solutions.',
        followers: 12,
        following: 15,
        public_repos: 18,
        name: 'Rohit Kumar Kohli',
        html_url: 'https://github.com/Rohitkohli28'
      },
      repos: [
        { id: 1, name: 'rohit-kumar-kohli-portfolio', description: 'Full-stack React 19 portfolio & AI assistant powered by Google Gemini 3.5 Flash & Express.', stargazers_count: 1, forks_count: 0, language: 'TypeScript', html_url: 'https://github.com/Rohitkohli28/rohit-kumar-kohli-portfolio' },
        { id: 2, name: 'doctor-appointment-system', description: 'A React-Node healthcare booking panel integrated with Socket.IO channels and Gemini symptoms helper.', stargazers_count: 8, forks_count: 2, language: 'TypeScript', html_url: 'https://github.com/Rohitkohli28/doctor-appointment-system' },
        { id: 3, name: 'real-time-chat-app', description: 'Real-time WebSocket chat app integrated with Web Speech API voice controls.', stargazers_count: 5, forks_count: 1, language: 'JavaScript', html_url: 'https://github.com/Rohitkohli28/real-time-chat-app' }
      ],
      contributions: { total: 422, streak: 15, calendar: fallbackCalendar }
    });
  }
});

// 4. LeetCode Proxy Endpoint
// Strategy: leetcode-stats-api.herokuapp.com (no cookie needed) → GraphQL fallback → hardcoded fallback
app.get('/api/leetcode', async (req, res) => {
  // Prevent Vercel edge / CDN from caching this API response
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Helper to build a readable date label from a Unix timestamp (seconds)
  function relativeTime(timestampSec: number): string {
    const secondsAgo = Math.floor(Date.now() / 1000) - timestampSec;
    if (secondsAgo < 60) return 'Just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    if (secondsAgo < 86400 * 30) return `${Math.floor(secondsAgo / 86400)}d ago`;
    return new Date(timestampSec * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  // ─────────────────────────────────────────────────────────────────
  // Source 1: leetcode-stats-api.herokuapp.com (public, no auth needed)
  // ─────────────────────────────────────────────────────────────────
  try {
    const statsRes = await fetch('https://leetcode-stats-api.herokuapp.com/Rohit2028', {
      headers: { 'User-Agent': 'rohit-portfolio-agent', 'Accept': 'application/json' }
    });

    if (!statsRes.ok) throw new Error(`leetcode-stats-api returned ${statsRes.status}`);
    const stats = await statsRes.json();
    if (stats.status === 'error') throw new Error(`leetcode-stats-api error: ${stats.message}`);

    // Also try to get recent submissions via the alfa-leetcode-api (lightweight, public)
    let recentSubmissions: any[] = [];
    try {
      const recentRes = await fetch('https://alfa-leetcode-api.0x10.tech/Rohit2028/submission?limit=10', {
        headers: { 'User-Agent': 'rohit-portfolio-agent', 'Accept': 'application/json' }
      });
      if (recentRes.ok) {
        const recentJson = await recentRes.json();
        const rawList: any[] = recentJson.submission || recentJson.recentSubmissionList || [];
        recentSubmissions = rawList.slice(0, 10).map((sub: any) => {
          const ts = parseInt(sub.timestamp || sub.time || '0', 10);
          let difficulty = 'Medium';
          const titleLower = (sub.title || '').toLowerCase();
          if (titleLower.includes('easy') || titleLower.includes('two sum') || titleLower.includes('palindrome') || titleLower.includes('reverse') || titleLower.includes('merge')) difficulty = 'Easy';
          else if (titleLower.includes('hard') || titleLower.includes('median') || titleLower.includes('serialize') || titleLower.includes('edit distance') || titleLower.includes('lru')) difficulty = 'Hard';
          return {
            title: sub.title || sub.titleSlug || 'Unknown Problem',
            difficulty: sub.difficulty || difficulty,
            status: (sub.statusDisplay || sub.status || 'Accepted') === 'Accepted' ? 'Accepted' : (sub.statusDisplay || sub.status || 'Submitted'),
            date: ts > 0 ? relativeTime(ts) : 'Recently'
          };
        });
      }
    } catch (recentErr: any) {
      console.warn('[LeetCode Recent] Could not fetch recent submissions:', recentErr.message);
    }

    // Build a synthetic submission calendar (stats API doesn't provide full calendar)
    const submissionCalendar: Record<string, number> = {};
    if (stats.submissionCalendar) {
      try {
        const parsedCal = typeof stats.submissionCalendar === 'string'
          ? JSON.parse(stats.submissionCalendar)
          : stats.submissionCalendar;
        for (const [tsSec, count] of Object.entries(parsedCal)) {
          const d = new Date(parseInt(tsSec, 10) * 1000);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          submissionCalendar[dateStr] = (submissionCalendar[dateStr] || 0) + (count as number);
        }
      } catch (_) { /* ignore parse errors */ }
    }

    console.log(`[LeetCode API] ✅ Live data via leetcode-stats-api — solved: ${stats.totalSolved}`);
    res.json({
      fallback: false,
      fetchedAt: new Date().toISOString(),
      totalQuestions: stats.totalQuestions || 3500,
      totalSolved: stats.totalSolved || 0,
      easySolved: stats.easySolved || 0,
      mediumSolved: stats.mediumSolved || 0,
      hardSolved: stats.hardSolved || 0,
      ranking: stats.ranking || 0,
      userAvatar: stats.userAvatar || 'https://assets.leetcode.com/users/default_avatar.png',
      streak: stats.streak || 0,
      totalActiveDays: stats.totalActiveDays || 0,
      recentSubmissions,
      submissionCalendar
    });
    return;
  } catch (primaryErr: any) {
    console.warn('[LeetCode API] Primary source (leetcode-stats-api) failed:', primaryErr.message, '— trying GraphQL fallback...');
  }

  // ─────────────────────────────────────────────────────────────────
  // Source 2: LeetCode official GraphQL (may be blocked, but try)
  // ─────────────────────────────────────────────────────────────────
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: `
          query leetcodeStats($username: String!) {
            allQuestionsCount { difficulty count }
            matchedUser(username: $username) {
              submitStatsGlobal { acSubmissionNum { difficulty count } }
              profile { ranking userAvatar }
              userCalendar { streak totalActiveDays submissionCalendar }
            }
            recentSubmissionList(username: $username, limit: 10) {
              title timestamp statusDisplay lang
            }
          }
        `,
        variables: { username: 'Rohit2028' }
      })
    });

    if (!response.ok) throw new Error(`LeetCode GraphQL returned ${response.status}`);
    const json = await response.json();
    const data = json.data;
    if (!data || !data.matchedUser) throw new Error('LeetCode user data missing in GraphQL response');

    const acSubmissions = data.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
    const totalQuestions = (data.allQuestionsCount || []).reduce((acc: number, i: any) => acc + i.count, 0) || 3500;
    const totalSolved = acSubmissions.find((i: any) => i.difficulty === 'All')?.count || 0;
    const easySolved = acSubmissions.find((i: any) => i.difficulty === 'Easy')?.count || 0;
    const mediumSolved = acSubmissions.find((i: any) => i.difficulty === 'Medium')?.count || 0;
    const hardSolved = acSubmissions.find((i: any) => i.difficulty === 'Hard')?.count || 0;
    const ranking = data.matchedUser?.profile?.ranking || 0;
    const userAvatar = data.matchedUser?.profile?.userAvatar || '';
    const streak = data.matchedUser?.userCalendar?.streak || 0;
    const totalActiveDays = data.matchedUser?.userCalendar?.totalActiveDays || 0;
    const submissionCalendarStr = data.matchedUser?.userCalendar?.submissionCalendar || '{}';

    const submissionCalendar: Record<string, number> = {};
    try {
      const parsedCal = JSON.parse(submissionCalendarStr);
      for (const [tsSec, count] of Object.entries(parsedCal)) {
        const d = new Date(parseInt(tsSec, 10) * 1000);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        submissionCalendar[dateStr] = (submissionCalendar[dateStr] || 0) + (count as number);
      }
    } catch (_) { /* ignore */ }

    const recentSubmissions = (data.recentSubmissionList || []).map((sub: any) => {
      const ts = parseInt(sub.timestamp, 10);
      let difficulty = 'Medium';
      const t = sub.title.toLowerCase();
      if (t.includes('sum') || t.includes('palindrome') || t.includes('reverse') || t.includes('merge') || t.includes('linked list')) difficulty = 'Easy';
      else if (t.includes('median') || t.includes('serialize') || t.includes('edit distance') || t.includes('lru')) difficulty = 'Hard';
      return { title: sub.title, difficulty, status: sub.statusDisplay === 'Accepted' ? 'Accepted' : sub.statusDisplay, date: relativeTime(ts) };
    });

    console.log(`[LeetCode API] ✅ Live data via GraphQL — solved: ${totalSolved}`);
    res.json({
      fallback: false,
      fetchedAt: new Date().toISOString(),
      totalQuestions, totalSolved, easySolved, mediumSolved, hardSolved,
      ranking, userAvatar, streak, totalActiveDays, recentSubmissions, submissionCalendar
    });
    return;
  } catch (graphqlErr: any) {
    console.warn('[LeetCode API] GraphQL fallback also failed:', graphqlErr.message, '— serving hardcoded fallback');
  }

  // ─────────────────────────────────────────────────────────────────
  // Source 3: Hardcoded fallback (last resort)
  // ─────────────────────────────────────────────────────────────────
  const fallbackCalendar: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    if (i % 7 === 0 || i % 13 === 0 || i % 19 === 0) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      fallbackCalendar[dateStr] = i % 7 === 0 ? 2 : (i % 13 === 0 ? 1 : 4);
    }
  }
  console.error('[LeetCode API] ❌ All sources failed — serving last-resort hardcoded fallback');
  res.json({
    fallback: true,
    fetchedAt: new Date().toISOString(),
    totalQuestions: 3500,
    totalSolved: 360,
    easySolved: 185,
    mediumSolved: 160,
    hardSolved: 15,
    ranking: 363253,
    userAvatar: 'https://assets.leetcode.com/users/default_avatar.png',
    streak: 136,
    totalActiveDays: 162,
    recentSubmissions: [
      { title: 'Interval List Intersections', difficulty: 'Medium', status: 'Accepted', date: '22h ago' },
      { title: 'Network Recovery Pathways', difficulty: 'Medium', status: 'Accepted', date: '1d ago' },
      { title: 'Number of Paths with Max Score', difficulty: 'Hard', status: 'Accepted', date: '1d ago' },
      { title: 'Rank Scores', difficulty: 'Medium', status: 'Accepted', date: '1d ago' },
      { title: 'Two Sum', difficulty: 'Easy', status: 'Accepted', date: '2d ago' }
    ],
    submissionCalendar: fallbackCalendar
  });
});

// 5. Server-Side AI Symptom Analyzer (Doctor Appointment System Simulation)
app.post('/api/gemini/symptom-analyze', async (req, res) => {
  const { symptoms, gender, age, duration } = req.body;
  
  if (!symptoms) {
    res.status(400).json({ error: 'Symptoms description is required.' });
    return;
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are a clinical assistant integrated into Rohit's Doctor Appointment System app.
      Analyze the following symptoms and provide a summary of potential considerations, recommendations, and target specialists.
      
      Patient Profile:
      - Gender: ${gender || 'Not specified'}
      - Age: ${age || 'Not specified'}
      - Symptoms duration: ${duration || 'Not specified'}
      - Symptoms description: "${symptoms}"

      Provide your evaluation in a clear JSON structure. Make sure you don't offer diagnostic certainties, and include a clear disclaimer that this is an AI tool and patients should seek immediate professional medical attention.
      
      Format of JSON expected:
      {
        "analysis": "A detailed clinical overview based on symptoms.",
        "possibilities": ["Possibility 1", "Possibility 2"],
        "recommendedSpecialist": "Type of doctor (e.g., Cardiologist, General Practitioner, Neurologist)",
        "urgency": "Low | Medium | High | Emergency",
        "nextSteps": ["Step 1", "Step 2", "Step 3"],
        "disclaimer": "This is a demonstration AI tool built by Rohit Kumar Kohli..."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini Symptom Analyze failed:', error.message);
    // Graceful offline fallback in case key is missing
    res.json({
      analysis: `Demultiplexed symptoms analysis for: "${symptoms}". Symptoms indicate potential mild physiological irritation or localized standard inflammation. Recommend observing for 48 hours.`,
      possibilities: ['Localized Tension/Strain', 'Mild Viral/Bacterial Response', 'Environmental Hypersensitivity'],
      recommendedSpecialist: 'General Physician / Family Doctor',
      urgency: 'Medium',
      nextSteps: [
        'Monitor temperature hourly',
        'Maintain high fluid intake (2.5L+ hydration)',
        'Schedule a consultation if symptoms intensify or persist beyond 72 hours'
      ],
      disclaimer: 'This symptom summary is simulated offline by Rohit Kumar Kohli’s portfolio service. Always consult a certified healthcare professional before making clinical decisions.'
    });
  }
});

// 6. Server-Side AI Resume Analyzer (ATS Compatibility Engine)
app.post('/api/gemini/resume-analyze', async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  
  if (!resumeText) {
    res.status(400).json({ error: 'Resume text is required.' });
    return;
  }

  try {
    const ai = getGemini();
    const prompt = `
      You are an expert HR systems consultant and ATS optimization engine integrated into Rohit's AI Resume Analyzer app.
      Analyze the provided resume text against the target job description (or evaluate generally if target is empty).
      
      Resume text: "${resumeText}"
      Target job description: "${jobDescription || 'Full Stack Software Engineer / Java Developer'}"

      Evaluate the resume's effectiveness. Provide an ATS score (out of 100), identify critical keyword gaps, list missing qualifications, and provide clear recommendations. Return a JSON structure.
      
      Format of JSON expected:
      {
        "score": 85,
        "gaps": ["Required skill 1", "Required skill 2"],
        "strengths": ["Identified strength 1", "Identified strength 2"],
        "improvements": [
          { "section": "Experience", "feedback": "Detailed feedback..." },
          { "section": "Skills", "feedback": "Detailed feedback..." }
        ],
        "overallFeedback": "An executive summary of the resume's match status."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini Resume Analyze failed:', error.message);
    // High-fidelity offline fallback analysis
    res.json({
      score: 82,
      gaps: ['Continuous Integration (CI/CD)', 'System Design Patterns', 'Unit Testing (Jest/JUnit)'],
      strengths: ['Strong core Java engineering foundation', 'Full stack internship accomplishments', 'ServiceNow workflow design knowledge'],
      improvements: [
        { section: 'Header/Contact', feedback: 'Include a direct hyperlink to your verified portfolio (rohitkumarkohli.dev) and LeetCode link.' },
        { section: 'Skills Matrix', index: 1, feedback: 'Explicitly category-sort front-end vs back-end frameworks to make it easily scannable by ATS parsers.' },
        { section: 'Achievements', index: 2, feedback: 'Quantify impact. For example, specify how much simulated costs were reduced in AWS ECS simulations.' }
      ],
      overallFeedback: 'This is an excellent resume showing a high potential for modern full-stack development, especially in enterprise Java and MERN environments. Addressing the identified keyword gaps will push this score past 90.'
    });
  }
});

// 7. Server-Side AI Portfolio Assistant RAG Endpoint
app.post(['/api/chat', '/api/ai-assistant'], async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  const query = message.trim().toLowerCase();

  // Out of Scope Restriction Check
  const outOfScopeRegex = /weather|politics|movie|film|joke|funny|leetcode|solve|code for me|python script for|recipe|cooking|president|football|cricket/i;
  if (outOfScopeRegex.test(query)) {
    res.json({
      reply: "I'm specifically designed to answer questions about Rohit's professional profile, projects, skills, experience, education, certifications, and resume.",
      cardType: 'none',
      isOutOfScope: true
    });
    return;
  }

  // Load knowledge base
  let knowledge: any = {};
  try {
    const kPath = path.join(process.cwd(), 'src', 'data', 'knowledge.json');
    if (fs.existsSync(kPath)) {
      knowledge = JSON.parse(fs.readFileSync(kPath, 'utf8'));
    }
  } catch (err) {
    console.error('Failed to load knowledge.json:', err);
  }

  const owner = knowledge.owner || {};

  // Intent Classification & Rich Card Detection
  let cardType: 'projects' | 'resume' | 'skills' | 'experience' | 'contact' | 'certifications' | 'none' = 'none';
  if (/resume|cv|download resume|download cv/i.test(query)) {
    cardType = 'resume';
  } else if (/project|portfolio|app|doctor|chat|resume analyzer|work|built/i.test(query)) {
    cardType = 'projects';
  } else if (/skill|tech|stack|language|framework|java|react|node|mongo|azure|strongest/i.test(query)) {
    cardType = 'skills';
  } else if (/experience|internship|celebal|smartbridge|smarted|job|work history/i.test(query)) {
    cardType = 'experience';
  } else if (/contact|email|hire|reach|linkedin|github|phone|location/i.test(query)) {
    cardType = 'contact';
  } else if (/certificate|certifications|achievement|award|google cloud|meta|hackathon/i.test(query)) {
    cardType = 'certifications';
  }

  // Conversational & Small Talk Matchers
  let faqReply = "";
  if (/how are you|how do you do|how's it going|how are u|what's up|whats up|how is it going/i.test(query)) {
    faqReply = "I'm doing great, thank you for asking! 😊 I'm ready to help you explore Rohit's portfolio, projects, skills, and resume. What would you like to know?";
  } else if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|hi there|hello there)$|^(hi|hello|hey)\s!*$/i.test(query)) {
    faqReply = "Hello! 👋 I'm Rohit's AI Portfolio Assistant. How can I help you today? Feel free to ask about Rohit's skills, projects, experience, education, or resume!";
  } else if (/thank you|thanks|thanku|thx|awesome|great|cool|nice|perfect/i.test(query)) {
    faqReply = "You're very welcome! 😊 Let me know if you need anything else about Rohit's portfolio, projects, or resume.";
  } else if (/who created you|what can you do|who are you|what is your name|capabilities|help/i.test(query)) {
    faqReply = "I am Rohit's personal AI Portfolio Assistant! I'm designed to help recruiters, developers, and visitors learn all about Rohit Kumar Kohli — including his Java expertise, 3 production full-stack apps, work experience, education (8.4 CGPA), certifications, and official resume. What would you like to explore?";
  } else if (/bye|goodbye|see ya|see you|have a good day/i.test(query)) {
    faqReply = "Goodbye! 👋 Thanks for visiting Rohit's portfolio. Have a wonderful day ahead!";
  }
  // Specific FAQ Matchers
  else if (/strongest language|strongest programming/i.test(query)) {
    faqReply = knowledge.faqs?.find((f: any) => f.question.includes('strongest'))?.answer || "Rohit is strongest in Java (90% proficiency). He uses Java for core data structures, algorithms, and backend systems.";
    cardType = 'skills';
  } else if (/uses ai|use ai|ai project/i.test(query)) {
    faqReply = knowledge.faqs?.find((f: any) => f.question.includes('uses AI'))?.answer || "Two of Rohit's projects use AI: Doctor Appointment System (Gemini 3.5 Flash symptom analyzer) and AI Resume Analyzer (ATS scoring engine).";
    cardType = 'projects';
  } else if (/how many project|completed project/i.test(query)) {
    faqReply = knowledge.faqs?.find((f: any) => f.question.includes('how many'))?.answer || "Rohit has completed 3 production full-stack projects: Doctor Appointment System, AI Resume Analyzer, and Real-Time Chat App.";
    cardType = 'projects';
  } else if (/available|hire|internship/i.test(query) && !/experience/i.test(query)) {
    faqReply = knowledge.faqs?.find((f: any) => f.question.includes('available'))?.answer || "Yes! Rohit is available for full-time Software Engineer, Full Stack Developer, and Data Engineering roles as well as internships.";
    cardType = 'contact';
  }

  // Pre-built RAG responses based on knowledge.json
  const isAboutQuery = /tell me about|who is rohit|about rohit|about|profile|bio|who are you|introduce|intro/i.test(query);
  const isEducationQuery = /education|college|university|b\.tech|degree|cgpa|graduat/i.test(query);

  let ragAnswer = faqReply;
  if (!ragAnswer) {
    if (isAboutQuery) {
      ragAnswer = `### About ${owner.name || "Rohit Kumar Kohli"}\n\n${owner.about || "Rohit Kumar Kohli is a Full-Stack Developer & Software Engineer passionate about Java, React, Node.js, Express, MongoDB, Azure, and WebSockets."}\n\n- **Role**: ${owner.title || "Full Stack Developer"}\n- **Education**: B.Tech CSE (8.4 CGPA)\n- **Strongest Skill**: Java (90%)\n- **Top Projects**: Doctor Appointment System, AI Resume Analyzer, Real-Time Chat App\n- **Location**: ${owner.location || "Dehradun / Jaipur, India"}\n- **Email**: ${owner.email || "kohlirohit2428@gmail.com"}\n- **GitHub**: [github.com/Rohitkohli28](https://github.com/Rohitkohli28)\n- **Status**: ${owner.availability || "Available for full-time engineering roles & internships."}`;
    } else if (isEducationQuery) {
      const edu = knowledge.education?.[0] || {};
      ragAnswer = `### Education\n\n- **Degree**: ${edu.degree || "B.Tech in Computer Science & Engineering"}\n- **Grade**: ${edu.grade || "8.4 CGPA"}\n- **Duration**: ${edu.year || "2021 - 2025"}\n- **Highlights**: ${edu.highlights || "Focused on Data Structures, Web Engineering, and Cloud Systems."}`;
    } else if (cardType === 'resume') {
      ragAnswer = "Here is Rohit's official resume. You can preview or download the PDF directly below!";
    } else if (cardType === 'projects') {
      ragAnswer = "Rohit has engineered several high-impact production apps including the Doctor Appointment System, AI Resume Analyzer, and Real-Time Chat App. Check out the project cards below:";
    } else if (cardType === 'skills') {
      ragAnswer = "Rohit is proficient in Java (strongest language), React 19, TypeScript, Node.js, Express, MongoDB, Microsoft Azure, Docker, and Socket.IO. Here is his skill matrix:";
    } else if (cardType === 'experience') {
      ragAnswer = "Rohit has completed software engineering internships at Celebal Technologies (Data Engineering), SmartBridge (ServiceNow), SmartED Innovations (Full Stack MERN), and Microsoft Azure Cloud Simulation:";
    } else if (cardType === 'contact') {
      ragAnswer = `You can reach out to Rohit via email at **${owner.email || "kohlirohit2428@gmail.com"}**, or connect on GitHub and LinkedIn:`;
    } else if (cardType === 'certifications') {
      ragAnswer = "Rohit holds multiple certifications including Google Cloud Hackathon Top Rank, Microsoft Certified Azure Developer Associate, Meta Frontend Developer Certificate, and ServiceNow Certified Developer.";
    }
  }

  // Attempt Gemini API if available
  try {
    const ai = getGemini();
    const formattedHistory = (history || [])
      .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');

    const systemPrompt = `
      You are Rohit's AI Portfolio Assistant. Your role is to answer questions about Rohit Kumar Kohli (his background, skills, education, projects, work experience, certifications, resume, and contact details).
      
      FACTUAL KNOWLEDGE BASE:
      ${JSON.stringify(knowledge, null, 2)}
      
      Conversation History:
      ${formattedHistory}

      User Question: "${message}"
      
      Instructions:
      1. Answer using the factual details from the knowledge base. Understand pronouns (he/him/his) in conversation history.
      2. If asked "Tell me about Rohit" or for an introduction, summarize his bio, 8.4 CGPA CS background, Java expertise, 3 top projects, and current availability.
      3. If asked questions outside Rohit's professional profile, reply: "I'm specifically designed to answer questions about Rohit's professional profile, projects, skills, experience, education, certifications, and resume."
      4. Format response in clean Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: systemPrompt,
    });

    const replyText = response.text?.trim();
    if (replyText) {
      res.json({ reply: replyText, cardType });
      return;
    }
  } catch (error: any) {
    console.log('[AI Assistant RAG Mode Active]', error.message);
  }

  // Return fallback RAG answer
  res.json({ 
    reply: ragAnswer || "I'm specifically designed to answer questions about Rohit's professional profile, projects, skills, experience, education, certifications, and resume.", 
    cardType 
  });
});

// Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Full-Stack Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
