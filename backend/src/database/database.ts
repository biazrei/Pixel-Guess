import Database from "better-sqlite3";
import path from "path";
import fs from "node:fs"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, "../data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(__dirname, "../data/pixelguess.db")
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS imagem_do_dia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    caminho TEXT NOT NULL);
`);
db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_imagem_nome
  ON imagem_do_dia (nome);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS imagens_multiplayer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    caminho TEXT NOT NULL
  );
`);

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_imagens_multiplayer
  ON imagens_multiplayer (nome);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS historico_imagens_multiplayer (
    imagem_id INTEGER PRIMARY KEY,
    utilizada_em INTEGER NOT NULL,

    FOREIGN KEY (imagem_id)
      REFERENCES imagens_multiplayer (id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS imagens_sequencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    caminho TEXT NOT NULL);
  `);
db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_imagens_sequencia
  ON imagens_sequencia (nome);
  `);

db.exec(`
  CREATE TABLE IF NOT EXISTS sequencia_diaria (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    imagem_1 INTEGER NOT NULL,
    imagem_2 INTEGER NOT NULL,
    imagem_3 INTEGER NOT NULL,
    
  FOREIGN KEY (imagem_1) REFERENCES imagens_sequencia (id),
  FOREIGN KEY (imagem_2) REFERENCES imagens_sequencia (id),
  FOREIGN KEY (imagem_3) REFERENCES imagens_sequencia (id)
    );
`);

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_sequencia_diaria ON sequencia_diaria (imagem_1, imagem_2, imagem_3)
  
  `)

  db.exec(`
  CREATE TABLE IF NOT EXISTS salas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'livre'
      CHECK (status IN ('livre', 'aguardando', 'em_andamento')),
    tipo TEXT NOT NULL DEFAULT 'privada'
      CHECK (tipo IN ('privada', 'publica')),
    max_jogadores INTEGER NOT NULL DEFAULT 2,
    reserva_expira_em INTEGER
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sala_jogadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sala_id INTEGER NOT NULL,
    jogador_id TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,

    FOREIGN KEY (sala_id)
      REFERENCES salas(id)
      ON DELETE CASCADE
  );
`);

const cadastrarSala = db.prepare(`
  INSERT OR IGNORE INTO salas (nome)
  VALUES (?)
`);

for (let i = 1; i <= 20; i++) {
  cadastrarSala.run(`SALA-${String(i).padStart(2, "0")}`);
}

db.exec(`
  UPDATE salas
  SET tipo = CASE
    WHEN id BETWEEN 1 AND 10 THEN 'privada'
    WHEN id BETWEEN 11 AND 20 THEN 'publica'
  END;
`);

export default db;