import Contato from '../models/Contato.js';
import { sendSuccess } from '../utils/http.js';
import { logInfo } from '../utils/logger.js';

export const criarContato = async (req, res, next) => {
  try {
    const novoContato = new Contato(req.body);
    await novoContato.save();

    logInfo('contato.criar', 'Novo contato registrado.', {
      appSlug: req.identity?.appSlug,
      tenantId: req.identity?.tenantId,
    });

    return sendSuccess(res, 201, { message: 'Contato salvo com sucesso!' });
  } catch (error) {
    return next(error);
  }
};