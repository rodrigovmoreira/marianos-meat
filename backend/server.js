import { env } from './src/config/env.js';
import { createApp } from './src/app.js';
import connectDB from './src/config/db.js';
import { logInfo } from './src/utils/logger.js';

const start = async () => {
  // Banco é plataforma: sobe antes de abrir a porta.
  await connectDB();

  const app = createApp();

  app.listen(env.port, () => {
    logInfo('server.listen', `API do Mariano's Meat rodando na porta ${env.port}`);
  });
};

start();