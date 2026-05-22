import mongoose from 'mongoose';

const contatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: false },
  mensagem: { type: String, required: false },
  dataEnvio: { type: Date, default: Date.now }
});

const Contato = mongoose.model('Contato', contatoSchema);
export default Contato;