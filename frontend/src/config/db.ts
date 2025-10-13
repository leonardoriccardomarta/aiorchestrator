import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-orchestrator';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB Connected...');
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error('MongoDB connection error:', err.message);
    } else {
      logger.error('MongoDB connection error:', err);
    }
    process.exit(1);
  }
};

mongoose.connection.on('error', (err: Error) => {
  logger.error('MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error('Error closing MongoDB connection:', err.message);
    } else {
      logger.error('Error closing MongoDB connection:', err);
    }
    process.exit(1);
  }
}); 