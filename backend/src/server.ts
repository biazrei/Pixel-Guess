import express from "express";
import db from "./database/database.js";
import { cadastrarImagens } from "./seeds/imagens.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoImagens = path.join(__dirname, "../imagens");

const PORT = 3000;
const app = express();

app.use(cors());

cadastrarImagens();

app.use("/imagens", express.static(caminhoImagens));

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});

app.get("/api/imagens", (req, res) => {
  const resultado = db.prepare("SELECT id, caminho FROM imagem_do_dia").all();

  res.json(resultado);
});
