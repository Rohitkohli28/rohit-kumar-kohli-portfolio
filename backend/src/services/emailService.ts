import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

function parseSmtpError(error: any): { category: string; details: string } {
  const msg = error?.message || String(error);
  const code = error?.code || '';

  if (msg.includes('EAUTH') || msg.includes('535 5.7.8') || msg.includes('authentication failed')) {
    return {
      category: 'SMTP Authentication Failed',
      details: 'Invalid SMTP credentials. Check SMTP_USER and SMTP_PASS App Password.'
    };
  }
  if (code === 'ETIMEDOUT' || msg.includes('timeout')) {
    return {
      category: 'Network Timeout',
      details: 'Connection to SMTP server timed out. Verify network rules and outbound port 465/587.'
    };
  }
  if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('getaddrinfo')) {
    return {
      category: 'SMTP Host Unreachable',
      details: `Unable to resolve host ${env.SMTP_HOST}.`
    };
  }
  if (msg.includes('550') || msg.includes('Recipient rejected')) {
    return {
      category: 'Recipient Rejected',
      details: 'Target email address was rejected by mail server.'
    };
  }
  return {
    category: 'SMTP Transmission Failure',
    details: msg
  };
}

function getTransporter() {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    logger.error('❌ [SMTP Config Error] Missing SMTP_USER or SMTP_PASS.');
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(env.SMTP_PORT) || 465,
    secure: Number(env.SMTP_PORT) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 5000,
    tls: { rejectUnauthorized: false }
  });
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  clientIp?: string;
}): Promise<{ success: boolean; messageId?: string; errorCategory?: string; errorDetails?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      errorCategory: 'Missing Configuration',
      errorDetails: 'SMTP configuration is incomplete on the server.'
    };
  }

  const timestampStr = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const mailOptions = {
    from: `"${params.name}" <${env.SMTP_USER}>`,
    replyTo: `"${params.name}" <${params.email}>`,
    to: env.CONTACT_RECEIVER_EMAIL,
    subject: `⚡ Portfolio Inquiry: ${params.subject || 'General Opportunity'}`,
    text: `New Portfolio Inquiry:\n\nFrom: ${params.name} (${params.email})\nSubject: ${params.subject || 'General Opportunity'}\nDate: ${timestampStr}\nIP: ${params.clientIp || 'Unknown'}\n\nMessage:\n${params.message}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; padding: 32px 16px; color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">New Portfolio Inquiry</h1>
            <p style="color: #e2e8f0; margin: 4px 0 0 0; font-size: 13px;">Dispatched from Rohit's Portfolio Website</p>
          </div>
          <div style="padding: 24px;">
            <p><strong>Name:</strong> ${params.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${params.email}" style="color: #38bdf8;">${params.email}</a></p>
            <p><strong>Subject:</strong> ${params.subject || 'General Opportunity'}</p>
            <p><strong>Date:</strong> ${timestampStr}</p>
            <p><strong>Client IP:</strong> ${params.clientIp || 'Unknown'}</p>
            <div style="margin-top: 16px; padding: 16px; background-color: #0f172a; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; white-space: pre-wrap; color: #cbd5e1;">${params.message}</p>
            </div>
          </div>
        </div>
      </div>
    `
  };

  try {
    // 5-second timeout guard to prevent hanging requests
    const timeoutPromise = new Promise<{ success: boolean; errorCategory: string; errorDetails: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          errorCategory: 'Network Timeout',
          errorDetails: 'SMTP transmission timed out after 5 seconds.'
        });
      }, 5000);
    });

    const sendPromise = transporter.sendMail(mailOptions).then((info) => ({
      success: true,
      messageId: info.messageId
    }));

    const result: any = await Promise.race([sendPromise, timeoutPromise]);
    return result;
  } catch (error: any) {
    logger.error('❌ [Nodemailer Transport Error]:', error);
    const parsed = parseSmtpError(error);
    return {
      success: false,
      errorCategory: parsed.category,
      errorDetails: parsed.details
    };
  }
}
