import mongoose from 'mongoose';

import Admin from '../models/Admin.js';
import { registrarEvento } from '../services/auditService.js';
import { sendError, sendSuccess } from '../utils/http.js';
import { logInfo } from '../utils/logger.js';

const STATUS_VALIDOS = ['pendente', 'aprovado', 'rejeitado'];

const EVENTO_POR_STATUS = {
  aprovado: 'acesso.aprovado',
  rejeitado: 'acesso.rejeitado',
  pendente: 'acesso.reenviado_para_analise',
};

// GET /api/v1/admins — lista todos os admins do tenant, com filtro opcional por status.
export const listarAdmins = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { tenantId: req.identity.tenantId };

    if (status) {
      if (!STATUS_VALIDOS.includes(status)) {
        return sendError(res, 400, 'STATUS_INVALIDO', `Status deve ser um de: ${STATUS_VALIDOS.join(', ')}.`);
      }
      filter.status = status;
    }

    const admins = await Admin.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 200, { admins });
  } catch (error) {
    return next(error);
  }
};

// GET /api/v1/admins/pendentes — atalho para a fila de aprovação.
export const listarPendentes = async (req, res, next) => {
  try {
    const pendentes = await Admin.find({ tenantId: req.identity.tenantId, status: 'pendente' }).sort({
      createdAt: -1,
    });

    return sendSuccess(res, 200, { pendentes });
  } catch (error) {
    return next(error);
  }
};

// PATCH /api/v1/admins/:id/status — aprova, rejeita ou devolve para análise.
export const atualizarStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, 'ID_INVALIDO', 'Identificador de administrador inválido.');
    }

    if (!STATUS_VALIDOS.includes(status)) {
      return sendError(res, 400, 'STATUS_INVALIDO', `Status deve ser um de: ${STATUS_VALIDOS.join(', ')}.`);
    }

    // Evita que o único super admin se tranque fora do painel.
    if (String(req.admin._id) === String(id) && status !== 'aprovado') {
      return sendError(res, 400, 'OPERACAO_INVALIDA', 'Você não pode revogar o próprio acesso.');
    }

    const admin = await Admin.findOneAndUpdate(
      { _id: id, tenantId: req.identity.tenantId },
      { status },
      { returnDocument: 'after' }
    );

    if (!admin) {
      return sendError(res, 404, 'ADMIN_NAO_ENCONTRADO', 'Administrador não encontrado neste tenant.');
    }

    await registrarEvento(req, {
      event: EVENTO_POR_STATUS[status],
      admin,
      metadata: { statusAnterior: req.body?.statusAnterior ?? null, statusNovo: status },
    });

    logInfo('admin.atualizarStatus', `Acesso ${status}.`, {
      appSlug: req.identity.appSlug,
      tenantId: req.identity.tenantId,
      email: admin.email,
    });

    return sendSuccess(res, 200, { message: `Acesso ${status} com sucesso.`, admin });
  } catch (error) {
    return next(error);
  }
};
