import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI não definida no .env");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB Conectado com Sucesso");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Erro ao conectar ao MongoDB:", err.message);
    } else {
      console.error("Erro desconhecido ao conectar ao MongoDB:", err);
    }
    process.exit(1);
  }
};

export default connectDB;
