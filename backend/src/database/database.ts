import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


export default db;