import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db";
import orcamentosRoutes from "./routes/orcamentos";

// Conectar ao Banco de Dados
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/orcamentos", orcamentosRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("API Gestor Iceberg (TypeScript) está funcionando!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor TS rodando na porta ${PORT}`));
