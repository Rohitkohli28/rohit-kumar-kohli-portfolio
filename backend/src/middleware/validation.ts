import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().trim().email({ message: 'Please provide a valid email address.' }),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, { message: 'Message content must be at least 10 characters long.' }),
  honeypot: z.string().optional()
});

export function validateContactInput(req: Request, res: Response, next: NextFunction): void {
  try {
    const validatedData = contactSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.errors[0];
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        details: issue ? issue.message : 'Invalid request parameters.'
      });
      return;
    }
    next(error);
  }
}
