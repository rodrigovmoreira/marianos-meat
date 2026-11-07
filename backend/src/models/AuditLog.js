import mongoose from 'mongoose';

// Trilha de auditoria exigida pela constituição: quem fez, de onde veio (appSlug/tenantId)
// e o que mudou. Nunca substitui log de aplicação — é registro persistente.
const auditLogSchema = new mongoose.Schema(
  {
    // Eventos: acesso.solicitado | acesso.aprovado | acesso.rejeitado | acesso.reenviado_para_analise
    event: { type: String, required: true, index: true },
    appSlug: { type: String, required: true },
    tenantId: { type: String, required: true, index: true },
    // Identidade do alvo do evento (quem pediu o acesso).
    subject: { type: String, default: null },
    email: { type: String, default: null },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    // Quem executou a ação (no auto-serviço, é o próprio usuário).
    actorSubject: { type: String, default: null },
    ip: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
