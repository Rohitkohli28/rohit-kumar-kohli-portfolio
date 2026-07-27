import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'received' | 'email_sent' | 'email_failed';
  ipAddress?: string;
  emailError?: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, trim: true, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['received', 'email_sent', 'email_failed'], 
    default: 'received' 
  },
  ipAddress: { type: String, default: '' },
  emailError: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const ContactMessage = mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
