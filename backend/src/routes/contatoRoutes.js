import express from 'express';
import { criarContato } from '../controllers/contatoController.js';

const router = express.Router();

router.post('/contato', criarContato);

export default router;