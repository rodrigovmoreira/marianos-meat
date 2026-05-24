import Admin from '../models/Admin.js';

// ==========================================
// AÇÕES DO USUÁRIO (Qualquer um com token)
// ==========================================

// 1. Solicitar Acesso (Quando o usuário loga no Squamata pela primeira vez)
export const solicitarAcesso = async (req, res) => {
  try {
    // O authMiddleware básico não é usado aqui, pois o usuário ainda não está aprovado.
    // Vamos receber os dados do usuário que acabaram de vir do Squamata
    const { email, nome } = req.body;

    if (!email || !nome) {
      return res.status(400).json({ success: false, error: 'E-mail e Nome são obrigatórios.' });
    }

    // Verifica se o usuário já existe na base do Mariano's Meat
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(200).json({ 
        success: true, 
        message: 'Usuário já cadastrado.', 
        status: admin.status 
      });
    }

    // Se não existe, cria como "pendente"
    admin = new Admin({ email, nome, status: 'pendente', role: 'editor' });
    await admin.save();

    res.status(201).json({ 
      success: true, 
      message: 'Solicitação de acesso enviada com sucesso! Aguarde aprovação.',
      status: 'pendente' 
    });

  } catch (error) {
    console.error('Erro ao solicitar acesso:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao processar solicitação.' });
  }
};

// 2. Verificar Status Atual (Para o Frontend saber qual tela mostrar)
export const verificarAcessoAtual = async (req, res) => {
  try {
    // O req.admin é injetado pelo nosso authMiddleware!
    res.status(200).json({
      success: true,
      admin: {
        nome: req.admin.nome,
        email: req.admin.email,
        status: req.admin.status,
        role: req.admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao verificar acesso.' });
  }
};

// ==========================================
// AÇÕES DO SUPER ADMIN (Apenas o Bruno Mariano)
// ==========================================

// 3. Listar Usuários Pendentes
export const listarPendentes = async (req, res) => {
  try {
    // Trava de segurança extra no Controller
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ success: false, error: 'Acesso negado. Apenas super administradores.' });
    }

    const pendentes = await Admin.find({ status: 'pendente' }).sort({ dataSolicitacao: -1 });
    res.status(200).json({ success: true, pendentes });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar pendentes.' });
  }
};

// 4. Aprovar ou Rejeitar Usuário
export const gerenciarAcessoUsuario = async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ success: false, error: 'Acesso negado.' });
    }

    const { id } = req.params;
    const { acao } = req.body; // 'aprovar' ou 'rejeitar'

    if (!['aprovar', 'rejeitar'].includes(acao)) {
      return res.status(400).json({ success: false, error: 'Ação inválida.' });
    }

    const novoStatus = acao === 'aprovar' ? 'aprovado' : 'rejeitado';

    const usuarioAtualizado = await Admin.findByIdAndUpdate(
      id, 
      { status: novoStatus }, 
      { new: true } // Retorna o documento atualizado
    );

    if (!usuarioAtualizado) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ 
      success: true, 
      message: `Usuário ${novoStatus} com sucesso!`,
      usuario: usuarioAtualizado
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao gerenciar acesso do usuário.' });
  }
};