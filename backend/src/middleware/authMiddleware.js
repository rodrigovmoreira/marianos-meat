import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import Admin from '../models/Admin.js';
import { buildAdminLookup, getIdentity } from '../utils/identity.js';
import { sendError } from '../utils/http.js';
import { logError } from '../utils/logger.js';

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;

  const token = header.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
};

/**
 * 1ª camada — só prova quem é o usuário (JWT válido + escopo correto).
 * Não exige cadastro nem aprovação: é o que permite ao usuário pendente
 * consultar o próprio status e pedir acesso.
 */
export const verificarIdentidade = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return sendError(res, 401, 'TOKEN_AUSENTE', 'Acesso negado. Token não fornecido.');
  }

  let payload;

  try {
    // Validação local e stateless com o segredo compartilhado do Squamata-Login.
    payload = jwt.verify(token, env.jwtSecretLogin);
  } catch (error) {
    logError('auth.verificarIdentidade', error, { operation: 'verificarToken' });
    return sendError(res, 401, 'TOKEN_INVALIDO', 'Token inválido ou expirado.');
  }

  const identity = getIdentity(payload);

  if (!identity.subject) {
    return sendError(res, 401, 'TOKEN_INVALIDO', 'Token sem identificador de usuário (sub).');
  }

  if (identity.appSlug !== env.appSlug) {
    return sendError(res, 403, 'APP_NAO_AUTORIZADO', 'Token emitido para outra aplicação.');
  }

  if (!identity.tenantId) {
    return sendError(res, 403, 'TENANT_AUSENTE', 'Token sem contexto de tenant.');
  }

  try {
    req.identity = identity;
    req.admin = await Admin.findOne(buildAdminLookup(identity, identity.tenantId));
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * 2ª camada — exige Admin cadastrado, ativo e aprovado.
 * Roda sempre depois de `verificarIdentidade` (acoplado nas cadeias abaixo).
 */
export const checarAprovacao = (req, res, next) => {
  if (!req.admin) {
    return sendError(res, 403, 'NAO_CADASTRADO', 'Usuário não cadastrado neste sistema.');
  }

  // Kill-switch: desativar o Admin bloqueia o acesso imediatamente.
  if (req.admin.isActive === false) {
    return sendError(res, 403, 'CONTA_INATIVA', 'Sua conta está desativada. Procure o administrador.');
  }

  if (req.admin.status === 'pendente') {
    return sendError(res, 403, 'PENDENTE', 'Seu acesso está em análise pelo administrador.');
  }

  if (req.admin.status === 'rejeitado') {
    return sendError(res, 403, 'REJEITADO', 'Sua solicitação de acesso foi rejeitada.');
  }

  return next();
};

const checarSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'super_admin') {
    return sendError(res, 403, 'SEM_PERMISSAO', 'Acesso negado. Apenas super administradores.');
  }

  return next();
};

export const exigirAprovacao = [verificarIdentidade, checarAprovacao];
export const exigirSuperAdmin = [verificarIdentidade, checarAprovacao, checarSuperAdmin];