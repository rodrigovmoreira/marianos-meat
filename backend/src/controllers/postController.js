import Post from '../models/Post.js';
import { sendError, sendSuccess } from '../utils/http.js';

export const listarPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ dataCriacao: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const buscarPostPorSlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return sendError(res, 404, 'POST_NAO_ENCONTRADO', 'Post não encontrado.');
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const criarPost = async (req, res, next) => {
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

    sendSuccess(res, 201, { message: 'Publicação criada com sucesso!', post: novoPost });
  } catch (error) {
    next(error);
  }
};