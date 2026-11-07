import AuditLog from '../models/AuditLog.js';

const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null;

/**
 * Grava um evento de auditoria. Falha aqui **propaga** o erro de propósito:
 * a constituição proíbe "permitir falhas de auditoria" em mudança sensível de estado.
 */
export const registrarEvento = async (req, { event, admin = null, adminId = null, metadata = {} }) =>
  AuditLog.create({
    event,
    appSlug: req.identity.appSlug,
    tenantId: req.identity.tenantId,
    subject: admin?.loginSubject ?? req.identity.subject,
    email: admin?.email ?? req.identity.email,
    adminId: adminId ?? admin?._id ?? null,
    actorSubject: req.identity.subject,
    ip: getClientIp(req),
    metadata,
  });
