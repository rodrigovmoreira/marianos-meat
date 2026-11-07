import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// Carrega o .env da raiz do repositório independente do cwd (backend/ ou raiz).
dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

// Chaves de plataforma exigidas no boot. Ver constitution.md (Err Fast).
const REQUIRED_KEYS = ['MONGO_URI', 'JWT_SECRET_LOGIN'];

const missingKeys = REQUIRED_KEYS.filter((key) => !process.env[key]?.trim());

if (missingKeys.length > 0) {
  // Fail Fast: nunca subir em estado zumbi nem cair para valor default.
  console.error(
    `[marianos-meat] Boot abortado. Variáveis obrigatórias ausentes no ambiente: ${missingKeys.join(', ')}`
  );
  process.exit(1);
}

export const env = {
  serviceName: 'marianos-meat',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGO_URI,
  // Segredo compartilhado com o Squamata-Login (emissor único de identidade).
  jwtSecretLogin: process.env.JWT_SECRET_LOGIN,
  // Escopo multi-tenant desta aplicação.
  appSlug: process.env.APP_SLUG ?? 'marianos-meat',
  defaultTenantId: process.env.DEFAULT_TENANT_ID ?? 'default',
};
