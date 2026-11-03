import db from "../database/database.js"; 

export function cadastrarImagens() {
db.prepare(`
    INSERT OR IGNORE INTO imagem_do_dia (nome, caminho)
    VALUES
    ('gato', 'imagems/img_001.jpeg'),
    ('cobra', 'imagems/img_002.jpeg'),
    ('cacto', 'imagems/img_003.jpeg')
    `).run(); 
    }