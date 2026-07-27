import mongoose, { Schema, Document } from 'mongoose';

export interface IStatsCache extends Document {
  key: string; // 'github' | 'leetcode'
  data: Record<string, any>;
  updatedAt: Date;
}

const StatsCacheSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export const StatsCache = mongoose.model<IStatsCache>('StatsCache', StatsCacheSchema);
