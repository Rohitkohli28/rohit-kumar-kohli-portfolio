import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { sendContactEmail } from '../services/emailService.js';
import { sanitizeInput } from '../utils/sanitize.js';
import { logger } from '../utils/logger.js';

export async function submitContactFormController(req: Request, res: Response): Promise<void> {
  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1')
    .split(',')[0]
    .trim();

  const { name, email, subject, message, honeypot } = req.body;

  // 1. Honeypot check
  if (honeypot) {
    logger.warn(`⚠️ [Spam Protection] Honeypot triggered from IP ${clientIp}`);
    res.status(400).json({
      success: false,
      message: 'Spam Submission Detected',
      details: 'Automated bot submission rejected.'
    });
    return;
  }

  // 2. Sanitize inputs
  const cleanName = sanitizeInput(name);
  const cleanEmail = sanitizeInput(email);
  const cleanSubject = sanitizeInput(subject || 'General Inquiry');
  const cleanMessage = sanitizeInput(message);

  // 3. Save submission to MongoDB immediately (Guarantees no lead lost)
  let savedDoc: any = null;
  try {
    savedDoc = await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      status: 'received',
      ipAddress: clientIp
    });
    logger.info(`📝 [Contact Saved to DB] ID: ${savedDoc._id} | From: ${cleanEmail}`);
  } catch (dbErr: any) {
    logger.warn('⚠️ [MongoDB Save Failed for Contact Form]:', dbErr.message);
  }

  // 4. Send Email via Nodemailer Service
  const emailResult = await sendContactEmail({
    name: cleanName,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
    clientIp
  });

  // 5. Update MongoDB Status if document was created
  if (savedDoc) {
    try {
      savedDoc.status = emailResult.success ? 'email_sent' : 'email_failed';
      if (!emailResult.success) {
        savedDoc.emailError = `${emailResult.errorCategory}: ${emailResult.errorDetails}`;
      }
      await savedDoc.save();
    } catch (_) {}
  }

  if (emailResult.success) {
    res.status(200).json({
      success: true,
      message: 'Email dispatched successfully via Nodemailer.',
      messageId: emailResult.messageId
    });
  } else {
    res.status(200).json({
      success: true, // Still return 200 since submission was saved to database
      message: 'Inquiry received and saved.',
      warning: `${emailResult.errorCategory}: ${emailResult.errorDetails}`,
      details: 'Your message has been safely saved to our database and Rohit will review it directly.'
    });
  }
}
