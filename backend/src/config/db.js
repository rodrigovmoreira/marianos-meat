import mongoose from 'mongoose';

import { env } from './env.js';
import { logError, logInfo } from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    logInfo('db.connect', 'Conectado ao MongoDB com sucesso.');
  } catch (error) {
    logError('db.connect', error, { operation: 'connectDB' });
    // Banco é plataforma: sem ele o serviço não sobe.
    process.exit(1);
  }
};

export default connectDB;