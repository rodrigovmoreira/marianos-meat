import dotenv from 'dotenv';
// Configura o dotenv para ambiente de desenvolvimento local (no Docker, ele apenas ignora se o arquivo não estiver lá)
dotenv.config({ path: '../.env' });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marianos_meat';

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Conexão com o Banco de Dados
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch(err => console.error('❌ Erro de conexão com MongoDB:', err));

// 2. Definindo os Schemas (Contato e Blog)
const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: false },
  mensagem: { type: String, required: false },
  dataEnvio: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  resumo: { type: String, required: true },
  conteudo: { type: String, required: true },
  imagemUrl: { type: String, default: '' },
  dataCriacao: { type: Date, default: Date.now }
});

const Contato = mongoose.model('Contato', contatoSchema);
const Post = mongoose.model('Post', postSchema);

// 3. Rotas de Contato
app.post('/api/contato', async (req, res) => {
  try {
    const novoContato = new Contato(req.body);
    await novoContato.save();
    console.log('📝 Novo contato registrado:', req.body.nome);
    res.status(201).json({ success: true, message: 'Contato salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    res.status(500).json({ success: false, error: 'Erro interno ao processar o formulário.' });
  }
});

// 4. Rotas do Blog
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ dataCriacao: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar publicações.' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado.' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar o post.' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const slug = req.body.titulo
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const novoPost = new Post({ ...req.body, slug });
    await novoPost.save();
    
    res.status(201).json({ success: true, message: 'Publicação criada com sucesso!', post: novoPost });
  } catch (error) {
    console.error('Erro ao salvar publicação:', error);
    res.status(500).json({ success: false, error: 'Erro ao salvar publicação.' });
  }
});

// 5. Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`🚀 API ESM do Mariano's Meat rodando na porta ${PORT}`);
});