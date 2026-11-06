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



export default db;
