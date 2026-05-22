import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  resumo: { type: String, required: true },
  conteudo: { type: String, required: true },
  imagemUrl: { type: String, default: '' },
  dataCriacao: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
export default Post;