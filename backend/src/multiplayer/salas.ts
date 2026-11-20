import db from "../database/database.js";

type Jogador = {
  id: string;
  nome: string;
};

type Sala = {
  id: number;
  nome: string;
  status: "livre" | "aguardando" | "em_andamento";
  tipo: "privada" | "publica";
  max_jogadores: number;
  jogadores: Jogador[];
};

export type ReservaExpirada = {
  salaId: number;
  nomeSala: string;
  jogadoresIds: string[];
};

const TEMPO_RESERVA = 10 * 60 * 1000;

function buscarSala(salaId: number): Sala | undefined {
  const sala = db.prepare(`
    SELECT * FROM salas WHERE id = ?
  `).get(salaId) as Omit<Sala, "jogadores"> | undefined;

  if (!sala) return undefined;

  const jogadores = db.prepare(`
    SELECT jogador_id AS id, nome
    FROM sala_jogadores
    WHERE sala_id = ?
  `).all(salaId) as Jogador[];

  return { ...sala, jogadores };
}

export function buscarSalaDoJogador(jogadorId: string) {
  const registro = db.prepare(`
    SELECT sala_id
    FROM sala_jogadores
    WHERE jogador_id = ?
  `).get(jogadorId) as { sala_id: number } | undefined;

  if (!registro) return undefined;

  return buscarSala(registro.sala_id);
}

export function limparReservasExpiradas(): ReservaExpirada[] {
  const agora = Date.now();

  const expiradas = db.prepare(`
    SELECT
      s.id AS salaId,
      s.nome AS nomeSala,
      sj.jogador_id AS jogadorId
    FROM salas s
    LEFT JOIN sala_jogadores sj ON sj.sala_id = s.id
    WHERE s.status = 'aguardando'
      AND s.tipo = 'privada'
      AND s.reserva_expira_em IS NOT NULL
      AND s.reserva_expira_em <= ?
  `).all(agora) as {
    salaId: number;
    nomeSala: string;
    jogadorId: string | null;
  }[];

  if (expiradas.length === 0) return [];

  const reservas: ReservaExpirada[] = [];

  for (const item of expiradas) {
    let reserva = reservas.find(
      (r) => r.salaId === item.salaId
    );

    if (!reserva) {
      reserva = {
        salaId: item.salaId,
        nomeSala: item.nomeSala,
        jogadoresIds: [],
      };

      reservas.push(reserva);
    }

    if (item.jogadorId) {
      reserva.jogadoresIds.push(item.jogadorId);
    }
  }

  const limpar = db.transaction(() => {
    for (const reserva of reservas) {
      db.prepare(`
        DELETE FROM sala_jogadores
        WHERE sala_id = ?
      `).run(reserva.salaId);

      db.prepare(`
        UPDATE salas
        SET status = 'livre',
            reserva_expira_em = NULL
        WHERE id = ?
      `).run(reserva.salaId);
    }
  });

  limpar();

  return reservas;
}

function adicionarJogador(salaId: number, jogador: Jogador) {
  db.prepare(`
    INSERT INTO sala_jogadores (sala_id, jogador_id, nome)
    VALUES (?, ?, ?)
  `).run(salaId, jogador.id, jogador.nome);
}

function atualizarStatus(salaId: number) {
  const quantidade = db.prepare(`
    SELECT COUNT(*) AS total
    FROM sala_jogadores
    WHERE sala_id = ?
  `).get(salaId) as { total: number };

  const sala = buscarSala(salaId);
  if (!sala) return;

  const status =
    quantidade.total >= sala.max_jogadores
      ? "em_andamento"
      : quantidade.total > 0
        ? "aguardando"
        : "livre";

  db.prepare(`
    UPDATE salas
    SET status = ?,
        reserva_expira_em = NULL
    WHERE id = ?
  `).run(status, salaId);
}

export function reservarSalaPrivada(jogador: Jogador) {
  const reservar = db.transaction(() => {
    const sala = db.prepare(`
      SELECT id FROM salas
      WHERE status = 'livre'
        AND tipo = 'privada'
      ORDER BY id ASC
      LIMIT 1
    `).get() as { id: number } | undefined;

    if (!sala) return undefined;

    adicionarJogador(sala.id, jogador);

    db.prepare(`
      UPDATE salas
      SET status = 'aguardando',
          reserva_expira_em = ?
      WHERE id = ?
    `).run(Date.now() + TEMPO_RESERVA, sala.id);

    return sala.id;
  });

  const salaId = reservar();

  if (!salaId) {
    return {
      sucesso: false,
      mensagem: "Não há salas privadas disponíveis.",
    };
  }

  return {
    sucesso: true,
    mensagem: "Sala reservada! Compartilhe o código com seu amigo.",
    sala: buscarSala(salaId),
  };
}

export function entrarNaSala(nomeSala: string, jogador: Jogador) {
  const sala = db.prepare(`
    SELECT * FROM salas WHERE nome = ?
  `).get(nomeSala.trim().toUpperCase()) as
    Omit<Sala, "jogadores"> | undefined;

  if (!sala) {
    return { sucesso: false, mensagem: "Sala não encontrada." };
  }

  if (sala.tipo !== "privada") {
    return {
      sucesso: false,
      mensagem: "Esse código não corresponde a uma sala privada.",
    };
  }

  if (sala.status !== "aguardando") {
    return {
      sucesso: false,
      mensagem: "Essa sala não está disponível para entrada.",
    };
  }

  const quantidade = db.prepare(`
    SELECT COUNT(*) AS total
    FROM sala_jogadores WHERE sala_id = ?
  `).get(sala.id) as { total: number };

  if (quantidade.total >= sala.max_jogadores) {
    return { sucesso: false, mensagem: "Essa sala está cheia." };
  }

  if (quantidade.total === 0) {
    return { sucesso: false, mensagem: "Essa reserva expirou." };
  }

  try {
    adicionarJogador(sala.id, jogador);
  } catch {
    return {
      sucesso: false,
      mensagem: "Esse jogador já está em uma sala.",
    };
  }

  atualizarStatus(sala.id);

  return {
    sucesso: true,
    mensagem: "Os dois jogadores entraram. A partida pode começar!",
    sala: buscarSala(sala.id),
  };
}

export function entrarEmPartidaRapida(jogador: Jogador) {
  const entrar = db.transaction(() => {
    const salaPublica = db.prepare(`
      SELECT s.id
      FROM salas s
      WHERE s.tipo = 'publica'
        AND s.status = 'aguardando'
        AND (
          SELECT COUNT(*) FROM sala_jogadores sj
          WHERE sj.sala_id = s.id
        ) < s.max_jogadores
      ORDER BY s.id ASC
      LIMIT 1
    `).get() as { id: number } | undefined;

    if (salaPublica) {
      adicionarJogador(salaPublica.id, jogador);
      atualizarStatus(salaPublica.id);
      return salaPublica.id;
    }

    const novaSala = db.prepare(`
      SELECT id FROM salas
      WHERE status = 'livre'
        AND tipo = 'publica'
      ORDER BY id ASC
      LIMIT 1
    `).get() as { id: number } | undefined;

    if (!novaSala) return undefined;

    adicionarJogador(novaSala.id, jogador);
    atualizarStatus(novaSala.id);

    return novaSala.id;
  });

  let salaId: number | undefined;

  try {
    salaId = entrar();
  } catch {
    return {
      sucesso: false,
      mensagem: "Você já está em uma sala.",
    };
  }

  if (!salaId) {
    return {
      sucesso: false,
      mensagem: "Não há salas públicas disponíveis.",
    };
  }

  return {
    sucesso: true,
    mensagem: "Você entrou na fila. Aguardando outro jogador.",
    sala: buscarSala(salaId),
  };
}

export function sairDaSala(salaId: number, jogadorId: string) {
  const sala = buscarSala(salaId);

  if (!sala || !sala.jogadores.some((j) => j.id === jogadorId)) {
    return {
      sucesso: false,
      mensagem: "Jogador não encontrado nessa sala.",
    };
  }

  const remover = db.transaction(() => {
    db.prepare(`
      DELETE FROM sala_jogadores
      WHERE sala_id = ?
    `).run(salaId);

    db.prepare(`
      UPDATE salas
      SET status = 'livre',
          reserva_expira_em = NULL
      WHERE id = ?
    `).run(salaId);
  });

  remover();

  return {
    sucesso: true,
    mensagem: "Sala liberada.",
    sala: buscarSala(salaId),
  };
}