const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000; // A porta interna do container

// Middlewares
app.use(cors()); // Permite que o frontend faça requisições para cá
app.use(express.json()); // Permite ler o corpo da requisição (JSON)

// 1. Conexão com o Banco de Dados
// Usamos uma variável de ambiente para o Docker, ou localhost como fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marianos_meat';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('❌ Erro de conexão com MongoDB:', err));

// 2. Definindo o Formato (Schema) dos Dados
const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: false },
  mensagem: { type: String, required: false },
  dataEnvio: { type: Date, default: Date.now }
});

const Contato = mongoose.model('Contato', contatoSchema);

// 3. Rota para receber os dados do Frontend
app.post('/api/contato', async (req, res) => {
  try {
    const novoContato = new Contato(req.body);
    await novoContato.save(); // Salva no MongoDB
    
    console.log('📝 Novo contato registrado:', req.body.nome);
    res.status(201).json({ success: true, message: 'Contato salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao processar o formulário.' });
  }
});

// 4. Iniciando o Servidor
app.listen(PORT, () => {
  console.log(`🚀 API do Mariano's Meat rodando na porta ${PORT}`);
});