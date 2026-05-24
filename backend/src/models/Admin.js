import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  nome: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'aprovado', 'rejeitado'], 
    default: 'pendente' 
  },
  role: { 
    type: String, 
    enum: ['super_admin', 'editor'], 
    default: 'editor' 
  },
  dataSolicitacao: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;