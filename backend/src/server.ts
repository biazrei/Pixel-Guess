import express from "express";
import db from "./database/database.js";
import { cadastroImgDia } from "./seeds/imgdia.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { buscarImagem } from "./services/imgDiafuncionamento.js";
import router from "./routes/imgdiaroutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoImagens = path.join(__dirname, "../imagens/imgdia");

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

cadastroImgDia();

app.use("/imagens/imgdia", express.static(caminhoImagens));

app.get("/api/imagens", (req, res) => {
  const resultado = db
    .prepare("SELECT id, caminho FROM imagem_do_dia ORDER BY id ASC")
    .all();

  res.json(resultado);
});

app.get("/api/imagem-do-dia", (req, res) => {
  const imagem = buscarImagem();
  if (!imagem) {
    return res.status(404).json({ mensagem: "Nenhuma imagem encontrada" });
  }

  return res.json({
    id: imagem.id,
    caminho: imagem.caminho,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});