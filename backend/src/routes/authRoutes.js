import express from 'express';
import { 
  solicitarAcesso, 
  verificarAcessoAtual 
} from '../controllers/authController.js';
import { verificarIdentidade } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ambas exigem apenas identidade válida do Squamata-Login (o usuário pode estar pendente).
router.post('/solicitar', verificarIdentidade, solicitarAcesso);
router.get('/me', verificarIdentidade, verificarAcessoAtual);

export default router;