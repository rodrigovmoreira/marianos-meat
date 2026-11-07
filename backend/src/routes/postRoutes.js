import express from 'express';

import { buscarPostPorSlug, criarPost, listarPosts } from '../controllers/postController.js';
import { exigirAprovacao } from '../middleware/authMiddleware.js';

const router = express.Router();

// Leitura pública.
router.get('/posts', listarPosts);
router.get('/posts/:slug', buscarPostPorSlug);

// Escrita exige admin cadastrado, ativo e aprovado.
router.post('/posts', exigirAprovacao, criarPost);

export default router;