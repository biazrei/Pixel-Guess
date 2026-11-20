import db from "../database/database.js";

export function cadastroImgMultiplayer() {
  db.prepare(`
    INSERT OR IGNORE INTO imagens_multiplayer (nome, caminho)
    VALUES
    ('pica pau', 'imagens/imgmultiplayer/img_00.png'),
    ('clarinete', 'imagens/imgmultiplayer/img_01.png'),
    ('correr', 'imagens/imgmultiplayer/img_02.png'),
    ('peteca', 'imagens/imgmultiplayer/img_03.png'),
    ('golfe', 'imagens/imgmultiplayer/img_04.png'),
    ('marionete', 'imagens/imgmultiplayer/img_05.png'),
    ('piano', 'imagens/imgmultiplayer/img_06.png'),
    ('esgrima', 'imagens/imgmultiplayer/img_07.png'),
    ('pipa', 'imagens/imgmultiplayer/img_08.png'),
    ('costurar', 'imagens/imgmultiplayer/img_09.png'),
    ('basquete', 'imagens/imgmultiplayer/img_10.png')
  `).run();
}