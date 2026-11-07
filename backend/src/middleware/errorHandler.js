import { sendError } from '../utils/http.js';
import { logError } from '../utils/logger.js';

export const apiNotFound = (req, res) =>
  sendError(res, 404, 'ROTA_NAO_ENCONTRADA', `Rota não encontrada: ${req.method} ${req.originalUrl}`);

// Handler global: nenhum controller precisa traduzir erro em HTTP sozinho.
// eslint-disable-next-line no-unused-vars -- assinatura de 4 argumentos é exigida pelo Express
export const apiErrorHandler = (error, req, res, next) => {
  const status = Number(error?.status) || 500;

  logError('api.handlerGlobal', error, {
    appSlug: req.identity?.appSlug,
    tenantId: req.identity?.tenantId,
    subject: req.identity?.subject,
  });
  // O detalhe interno fica no log; o cliente recebe apenas o código estável.
  return sendError(
    res,
    status,
    error?.code ?? 'ERRO_INTERNO',
    status >= 500 ? 'Erro interno ao processar a requisição.' : error.message
  );
};
