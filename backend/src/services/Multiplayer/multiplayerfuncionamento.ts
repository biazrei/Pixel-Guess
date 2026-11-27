import db from "../../database/database.js";

export function buscarImagensMultiplayer() {
    const imagens = db.prepare(`
        SELECT id, nome, caminho
        FROM imagens_multiplayer
        ORDER BY id ASC
    `).all();

    return imagens;
}