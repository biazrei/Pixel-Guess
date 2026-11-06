import db from "../../database/database.js";

export function cadastrarImagens() {
  db.prepare(`
    INSERT OR IGNORE INTO imagem_do_dia (nome, caminho)
    VALUES
    ('gato', 'imagens/imgdia/img_001.jpeg'),
    ('cobra', 'imagens/imgdia/img_002.jpeg'),
    ('cacto', 'imagens/imgdia/img_003.jpeg')
    `,
  ).run();
}
