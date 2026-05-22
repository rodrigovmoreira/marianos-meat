import Post from '../models/Post.js';

export const listarPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ dataCriacao: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar publicações.' });
  }
};

export const buscarPostPorSlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ success: false, message: 'Post não encontrado.' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar o post.' });
  }
};

export const criarPost = async (req, res) => {
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
};