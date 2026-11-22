import express from "express";
import db from "./database/database.js";
import { cadastroImgDia } from "./seeds/imgdia.js";
import { cadastroImgSequencia } from "./seeds/sequencia.js";
import { cadastroSequenciaDiaria } from "./seeds/sequencia.js";
import { cadastroImgMultiplayer } from "./seeds/multiplayer.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import { buscarImagem } from "./services/imgDiafuncionamento.js";
import imgdiarouter from "./routes/imgdiaroutes.js";
import seqrouter from "./routes/seqroutes.js"
import { buscarImgSeq } from "./services/seqfuncionamento.js";
import multiplayerrouter from "./routes/multiplayerroutes.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import "./seeds/salasMultiplayerSeed.js";
import { configurarSalas } from "./services/salasMultiplayer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoImagensDia = path.join(__dirname, "../imagens/imgdia");
const caminhoImgsSeq = path.join (__dirname, "../imagens/imgseq")
const caminhoImgsMultiplayer = path.join(__dirname, "../imagens/imgmultiplayer");

const PORT = 3000;
const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
    console.log("Jogador conectado:", socket.id);
});

configurarSalas(io);

app.use(cors());
app.use(express.json());

app.use(imgdiarouter);
app.use(seqrouter);
app.use(multiplayerrouter);

cadastroImgDia();
cadastroImgSequencia();
cadastroSequenciaDiaria();
cadastroImgMultiplayer();

app.use("/imagens/imgdia", express.static(caminhoImagensDia));
app.use("/imagens/imgseq", express.static(caminhoImgsSeq))
app.use("/imagens/imgmultiplayer", express.static(caminhoImgsMultiplayer));

//testes
app.get("/imgsequencia", (req, res) => {
  const sequencia = db
    .prepare("SELECT id, nome, caminho FROM imagens_sequencia ORDER BY id ASC")
    .all();
  console.log(sequencia);

  res.json(sequencia);
});

app.get ("/imgseqdiaria" , (req, res) => {
  const seqdiaria = db.prepare("SELECT id, imagem_1, imagem_2, imagem_3 FROM sequencia_diaria ORDER BY id ASC").all();
  console.log(seqdiaria);
  res.json(seqdiaria);
});

app.get("/imagens", (req, res) => {
  const resultado = db
    .prepare("SELECT id, caminho FROM imagem_do_dia ORDER BY id ASC")
    .all();

  res.json(resultado);
});
//fim teste


httpServer.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});
