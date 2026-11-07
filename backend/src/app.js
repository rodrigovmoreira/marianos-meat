import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { apiErrorHandler, apiNotFound } from './middleware/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contatoRoutes from './routes/contatoRoutes.js';
import postRoutes from './routes/postRoutes.js';

/**
 * Fábrica da aplicação Express, sem `listen` e sem banco.
 * Permite validar rotas e middlewares sem subir servidor/DB.
 */
export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Healthcheck padrão do ecossistema. Ver ADR 002.
  app.get('/api/v1/health', (req, res) =>
    res.json({ status: 'UP', service: env.serviceName, timestamp: new Date().toISOString() })
  );

  // Caminho canônico único: /api/v1/<recurso>. Sem alias legado.
  app.use('/api/v1', contatoRoutes);
  app.use('/api/v1', postRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/admins', adminRoutes);

  app.use(apiNotFound);
  app.use(apiErrorHandler);

  return app;
};
