import express from 'express';

import { atualizarStatus, listarAdmins, listarPendentes } from '../controllers/adminController.js';
import { exigirSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toda a gestão de acesso é exclusiva do super admin do tenant.
router.use(exigirSuperAdmin);

router.get('/pendentes', listarPendentes);
router.get('/', listarAdmins);
router.patch('/:id/status', atualizarStatus);

export default router;
