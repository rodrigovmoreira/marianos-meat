/**
 * Cria o primeiro super admin do tenant padrão.
 *
 * Existe porque o fluxo de aprovação é "super admin aprova os outros" — sem uma
 * semente inicial ninguém consegue aprovar ninguém.
 *
 * Uso: npm run seed:super-admin
 * Requer no ambiente: MONGO_URI, JWT_SECRET_LOGIN e SUPER_ADMIN_EMAIL.
 */
import mongoose from 'mongoose';

import { env } from '../src/config/env.js';
import Admin from '../src/models/Admin.js';
import { logInfo } from '../src/utils/logger.js';

const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const nome = process.env.SUPER_ADMIN_NAME?.trim() || 'Super Admin';

if (!email) {
  console.error('[seed-super-admin] Defina SUPER_ADMIN_EMAIL no ambiente (ex.: bruno@marianosmeat.com.br).');
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(env.mongoUri);

  const tenantId = env.defaultTenantId;
  // Premissa registrada em MEMORY.md: o claim `sub` do Squamata-Login carrega o e-mail.
  const existente = await Admin.findOne({ tenantId, email });

  if (existente) {
    existente.role = 'super_admin';
    existente.status = 'aprovado';
    existente.isActive = true;
    existente.loginSubject ??= email;
    await existente.save();
    logInfo('seed.superAdmin', 'Super admin atualizado.', { tenantId, email });
  } else {
    await Admin.create({
      tenantId,
      email,
      loginSubject: email,
      nome,
      role: 'super_admin',
      status: 'aprovado',
      isActive: true,
    });
    logInfo('seed.superAdmin', 'Super admin criado.', { tenantId, email });
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error('[seed-super-admin] Falhou:', error.message);
  process.exit(1);
});
