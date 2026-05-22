import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marianos_meat';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (err) {
    console.error('❌ Erro de conexão com MongoDB:', err);
    process.exit(1); // Fecha a aplicação se não conseguir conectar ao banco crítico
  }
};

export default connectDB;