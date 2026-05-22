import express from 'express';
import { listarPosts, buscarPostPorSlug, criarPost } from '../controllers/postController.js';

const router = express.Router();

router.get('/posts', listarPosts);
router.get('/posts/:slug', buscarPostPorSlug);
router.post('/posts', criarPost);

export default router;