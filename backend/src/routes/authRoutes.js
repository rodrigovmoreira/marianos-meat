import express from 'express';
import { 
  solicitarAcesso, 
  verificarAcessoAtual, 
  listarPendentes, 
  gerenciarAcessoUsuario 
} from '../controllers/authController.js';
import { verificarAcesso } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// ROTAS PÚBLICAS (Não exigem aprovação prévia)
// ==========================================

// Rota para o usuário pedir acesso após logar no Squamata pela primeira vez
router.post('/solicitar', solicitarAcesso);

// ==========================================
// ROTAS PROTEGIDAS (Exigem o Token do Squamata validado)
// ==========================================

// Rota para o React saber qual o nível de acesso do usuário logado
router.get('/me', verificarAcesso, verificarAcessoAtual);

// Rotas exclusivas para o Super Admin (O Bruno Mariano) gerenciar a equipe
router.get('/pendentes', verificarAcesso, listarPendentes);
router.put('/aprovar/:id', verificarAcesso, gerenciarAcessoUsuario);

export default router;