/**
 * Contrato do token emitido pelo Squamata-Login.
 *
 * - `sub` é a identidade canônica do usuário (assumido como e-mail no ecossistema;
 *   registrado em MEMORY.md como premissa a confirmar no emissor).
 * - `email`/`name` são claims opcionais usados só para exibição e cadastro.
 * - `appSlug`/`tenantId` são obrigatórios para o isolamento multi-tenant.
 */
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const looksLikeEmail = (value) => isNonEmptyString(value) && value.includes('@');

export const getIdentity = (payload = {}) => {
  const subject = isNonEmptyString(payload.sub) ? payload.sub.trim() : null;
  const emailClaim = [payload.email, payload.user?.email].find(looksLikeEmail) ?? null;

  return {
    subject,
    // Se o e-mail não vier em claim própria, `sub` é o único caminho disponível.
    email: emailClaim ?? (looksLikeEmail(subject) ? subject : null),
    name: [payload.name, payload.nome, payload.user?.name].find(isNonEmptyString) ?? null,
    appSlug: isNonEmptyString(payload.appSlug) ? payload.appSlug : null,
    tenantId: isNonEmptyString(payload.tenantId) ? payload.tenantId : null,
  };
};

/**
 * Monta o filtro de busca do Admin sem depender de um único claim:
 * primeiro pelo vínculo de identidade (`loginSubject`) e, se houver, pelo e-mail.
 */
export const buildAdminLookup = (identity, tenantId) => {
  const candidates = [{ loginSubject: identity.subject }];
  if (identity.email) candidates.push({ email: identity.email });

  return { tenantId, $or: candidates };
};
