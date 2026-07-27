import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeAnalytics extends Document {
  ipAddress: string;
  userAgent?: string;
  downloadedAt: Date;
}

const ResumeAnalyticsSchema: Schema = new Schema({
  ipAddress: { type: String, required: true },
  userAgent: { type: String, default: '' },
  downloadedAt: { type: Date, default: Date.now }
});

export const ResumeAnalytics = mongoose.model<IResumeAnalytics>('ResumeAnalytics', ResumeAnalyticsSchema);
