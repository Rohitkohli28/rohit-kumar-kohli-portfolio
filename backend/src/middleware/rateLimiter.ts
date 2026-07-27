import rateLimit from 'express-rate-limit';

// Rate Limiter for Contact Form Submissions (5 submissions per 15 minutes)
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.socket.remoteAddress || '';
    return ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost');
  },
  message: {
    success: false,
    message: 'Too Many Submissions',
    details: 'You have exceeded the contact submission limit. Please wait 15 minutes before sending another inquiry.'
  }
});

// General API Rate Limiter (100 requests per 15 minutes)
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate Limit Exceeded',
    details: 'Too many requests from this IP address.'
  }
});
