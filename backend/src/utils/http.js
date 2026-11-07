/**
 * Formato único de erro da API:
 * { success: false, error: { code, message, details? } }
 * O `code` é estável e permite ao frontend decidir a tela sem depender do texto.
 */
export const sendError = (res, status, code, message, details) =>
  res.status(status).json({
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  });

export const sendSuccess = (res, status, payload = {}) =>
  res.status(status).json({ success: true, ...payload });
