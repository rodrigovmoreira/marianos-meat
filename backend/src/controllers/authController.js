import Admin from '../models/Admin.js';
import { registrarEvento } from '../services/auditService.js';
import { buildAdminLookup } from '../utils/identity.js';
import { sendSuccess } from '../utils/http.js';

/**
 * POST /api/v1/auth/solicitar
 * A identidade vem **do token** (nunca do body): o usuário só pode pedir acesso para si.
 */
export const solicitarAcesso = async (req, res, next) => {
  try {
    const { identity } = req;
    const existente = await Admin.findOne(buildAdminLookup(identity, identity.tenantId));

    // Idempotente: repetir a chamada devolve o estado atual, sem duplicar registro.
    if (existente) {
      return sendSuccess(res, 200, {
        message: 'Solicitação já registrada.',
        access: { status: existente.status, isActive: existente.isActive },
      });
    }

    const admin = await Admin.create({
      tenantId: identity.tenantId,
      loginSubject: identity.subject,
      email: identity.email,
      nome: identity.name,
      status: 'pendente',
      role: 'editor',
    });

    await registrarEvento(req, { event: 'acesso.solicitado', admin });

    return sendSuccess(res, 201, {
      message: 'Solicitação de acesso enviada com sucesso! Aguarde aprovação.',
      access: { status: admin.status, isActive: admin.isActive },
    });
  } catch (error) {
    // Corrida entre duas requisições simultâneas do mesmo usuário: o índice único garante
    // que só um registro exista; devolvemos o estado como sucesso idempotente.
    if (error?.code === 11000) {
      return sendSuccess(res, 200, {
        message: 'Solicitação já registrada.',
        access: { status: 'pendente', isActive: true },
      });
    }

    return next(error);
  }
};

/**
 * GET /api/v1/auth/me
 * Responde 200 para qualquer token válido deste app — inclusive de quem ainda não
 * é cadastrado ou está pendente. É o que permite ao frontend escolher a tela certa.
 */
export const verificarAcessoAtual = (req, res) => {
  const { identity, admin } = req;
  const isActive = admin ? admin.isActive !== false : null;
  const status = admin?.status ?? 'nao_cadastrado';

  return sendSuccess(res, 200, {
    user: {
      email: admin?.email ?? identity.email,
      name: admin?.nome ?? identity.name,
    },
    access: {
      registered: Boolean(admin),
      status,
      role: admin?.role ?? null,
      isActive,
      canAccessPanel: Boolean(isActive && status === 'aprovado'),
    },
  });
};