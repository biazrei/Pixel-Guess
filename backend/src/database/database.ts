import Database from "better-sqlite3";

const db = new Database("./src/data/pixelguess.db");

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
