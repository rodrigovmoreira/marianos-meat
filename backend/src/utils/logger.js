import { env } from '../config/env.js';

// Todo log de erro precisa ser rastreável: serviço de origem, operação e contexto
// multi-tenant (appSlug/tenantId). Ver docs/spec/ai-rules.md §6.
const buildContext = (operation, context = {}) => ({
  service: env.serviceName,
  operation,
  ...(context.appSlug ? { appSlug: context.appSlug } : {}),
  ...(context.tenantId ? { tenantId: context.tenantId } : {}),
  ...(context.subject ? { subject: context.subject } : {}),
  ...(context.email ? { email: context.email } : {}),
});

export const logInfo = (operation, message, context) => {
  console.log(JSON.stringify({ level: 'info', ...buildContext(operation, context), message }));
};

export const logWarn = (operation, message, context) => {
  console.warn(JSON.stringify({ level: 'warn', ...buildContext(operation, context), message }));
};

export const logError = (operation, error, context) => {
  console.error(
    JSON.stringify({
      level: 'error',
      ...buildContext(operation, context),
      message: error?.message ?? String(error),
    })
  );
};
