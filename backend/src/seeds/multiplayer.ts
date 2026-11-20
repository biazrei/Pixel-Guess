import db from "../database/database.js";

export function cadastroImgMultiplayer() {
  db.prepare(`
    INSERT OR IGNORE INTO imagens_multiplayer (nome, caminho)
    VALUES
      ('passáro', 'imagens/imgmultiplayer/img_54.png')
  `).run();
}