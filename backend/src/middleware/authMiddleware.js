import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const verificarAcesso = async (req, res, next) => {
  try {
    // 1. Verifica se o Frontend enviou o Token no cabeçalho
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Abre o Token usando a chave secreta (a mesma do Squamata)
    const SECRET = process.env.JWT_SECRET;
    const decodificado = jwt.verify(token, SECRET);
    
    // O Squamata deve salvar o email no payload do token
    const userEmail = decodificado.email; 

    // 3. Verifica no NOSSO banco se esse email existe e está liberado
    const adminConfig = await Admin.findOne({ email: userEmail });

    if (!adminConfig) {
      return res.status(403).json({ error: 'Usuário não cadastrado neste sistema.' });
    }

    if (adminConfig.status !== 'aprovado') {
      return res.status(403).json({ error: 'Acesso pendente de aprovação pelo Super Admin.' });
    }

    // 4. Se passou em tudo, salva as informações na requisição e deixa passar
    req.admin = adminConfig;
    next();

  } catch (error) {
    console.error('Erro na validação do token:', error.message);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};