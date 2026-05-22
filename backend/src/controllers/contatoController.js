import Contato from '../models/Contato.js';

export const criarContato = async (req, res) => {
  try {
    const novoContato = new Contato(req.body);
    await novoContato.save();
    console.log('📝 Novo contato registrado:', req.body.nome);
    res.status(201).json({ success: true, message: 'Contato salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao processar o formulário.' });
  }
};