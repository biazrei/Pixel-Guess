import db from "../database/database.js";

export type ImagemMultiplayer = {
  id: number;
  nome: string;
  caminho: string;
};

export function buscarImagensMultiplayer(
  quantidade: number = 5
): ImagemMultiplayer[] | null {
  if (!Number.isInteger(quantidade) || quantidade < 1) {
    return null;
  }

  const sortear = db.transaction(() => {
    const totalImagens = db.prepare(`
      SELECT COUNT(*) AS total
      FROM imagens_multiplayer
    `).get() as { total: number };

    if (totalImagens.total < quantidade) {
      return null;
    }

    const imagensEscolhidas: ImagemMultiplayer[] = [];

    while (imagensEscolhidas.length < quantidade) {
      const idsEscolhidos = imagensEscolhidas.map(
        (imagem) => imagem.id
      );

      const imagensDisponiveis = db.prepare(`
        SELECT id, nome, caminho
        FROM imagens_multiplayer
        WHERE id NOT IN (
          SELECT imagem_id
          FROM historico_imagens_multiplayer
        )
        ${
          idsEscolhidos.length > 0
            ? `AND id NOT IN (${idsEscolhidos.map(() => "?").join(",")})`
            : ""
        }
        ORDER BY RANDOM()
      `).all(...idsEscolhidos) as ImagemMultiplayer[];

      if (imagensDisponiveis.length === 0) {
        db.prepare(`
          DELETE FROM historico_imagens_multiplayer
        `).run();

        continue;
      }

      const vagas = quantidade - imagensEscolhidas.length;

      const selecionadas = imagensDisponiveis.slice(0, vagas);

      for (const imagem of selecionadas) {
        db.prepare(`
          INSERT INTO historico_imagens_multiplayer (
            imagem_id,
            utilizada_em
          )
          VALUES (?, ?)
        `).run(imagem.id, Date.now());

        imagensEscolhidas.push(imagem);
      }
    }

    return imagensEscolhidas;
  });

  return sortear();
}