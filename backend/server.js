import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import contatoRoutes from './src/routes/contatoRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import authRoutes from './src/routes/authRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Inicializa Conexão Isolada do Banco
connectDB();

// 2. Middlewares Globais de requisição
app.use(cors());
app.use(express.json());

// 3. Injeção das Rotas Modulares do App
// Caminho canônico único: /api/v1/<recurso>. Ver ADR 002 em Calango-docs/docs/ADRs.
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'UP', service: 'marianos-meat', timestamp: new Date().toISOString() });
});

app.use('/api/v1', contatoRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1/auth', authRoutes);

// 4. Ativação do Servidor Express
app.listen(PORT, () => {
  console.log(`🚀 API Arquitetada do Mariano's Meat rodando na porta ${PORT}`);
});