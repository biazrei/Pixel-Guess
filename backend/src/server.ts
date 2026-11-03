import express from "express";
import db from "./database/database.js";
import { cadastrarImagens } from "./seeds/imagens.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { buscarImagem } from "./services/imagemDoDia.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoImagens = path.join(__dirname, "../imagens");

const PORT = 3000;
const app = express();

app.use(cors());

cadastrarImagens();

app.use("/imagens", express.static(caminhoImagens));


app.get("/api/imagens", (req, res) => {
  const resultado = db.prepare("SELECT id, caminho FROM imagem_do_dia ORDER BY id ASC").all();

  res.json(resultado);
});

app.get("/api/imagem-do-dia", (req, res)=> {
const imagem = buscarImagem();
if (!imagem) {return res.status(404).json({mensagem: "Nenhuma imagem encontrada" });}

return res.json(imagem);

});

app.listen(PORT, () => {
console.log(`Servidor funcionando na porta ${PORT}`);
});
