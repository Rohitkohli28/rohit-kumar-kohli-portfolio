import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (isConnected) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = true;
    console.log(`🍃 [MongoDB Connected] Host: ${conn.connection.host} | Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB Connection Error]:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB Disconnected] Attempting reconnect...');
      isConnected = false;
    });

    return conn;
  } catch (error: any) {
    console.warn(`⚠️ [MongoDB Connection Failed] ${error.message}`);
    console.warn('💡 Tip: Server will continue running with fallback in-memory/cache functionality if DB is unreachable.');
    return null;
  }
}
