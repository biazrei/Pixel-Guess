export type ImagemMultiplayer = {
  id: number;
  nome: string;
  caminho: string;
};

export type EstadoJogador = {
  jogadorId: string;
  pontos: number;
  pecasReveladas: number[];
  acertou: boolean;
};

export type EstadoRodada = {
  numero: number;
  imagemId: number;
  caminhoImagem: string;
  resposta: string;
  jogadores: EstadoJogador[];
  finalizada: boolean;
};

export type EstadoPartida = {
  salaId: number;
  rodadaAtual: number;
  pontuacaoTotal: Record<string, number>;
  rodadas: EstadoRodada[];
  finalizada: boolean;
};

export function criarPartida(
  salaId: number,
  jogadoresIds: string[],
  imagens: ImagemMultiplayer[]
): EstadoPartida {
  if (jogadoresIds.length !== 2) {
    throw new Error("Uma partida precisa de exatamente dois jogadores.");
  }

  if (imagens.length !== 5) {
    throw new Error("São necessárias cinco imagens para iniciar a partida.");
  }

  const imagensUnicas = new Set(imagens.map((imagem) => imagem.id));

  if (imagensUnicas.size !== 5) {
    throw new Error("As cinco rodadas precisam de imagens diferentes.");
  }

  const pontuacaoTotal: Record<string, number> = {};

  jogadoresIds.forEach((jogadorId) => {
    pontuacaoTotal[jogadorId] = 0;
  });

  const rodadas: EstadoRodada[] = imagens.map((imagem, index) => ({
    numero: index + 1,
    imagemId: imagem.id,
    caminhoImagem: imagem.caminho,
    resposta: imagem.nome,
    jogadores: jogadoresIds.map((jogadorId) => ({
      jogadorId,
      pontos: 1500,
      pecasReveladas: [],
      acertou: false,
    })),
    finalizada: false,
  }));

  return {
    salaId,
    rodadaAtual: 1,
    pontuacaoTotal,
    rodadas,
    finalizada: false,
  };
}

export function revelarPeca(
  partida: EstadoPartida,
  jogadorId: string,
  pecaId: number
) {
  const rodada = partida.rodadas[partida.rodadaAtual - 1];

  if (!rodada || rodada.finalizada || partida.finalizada) {
    return {
      sucesso: false,
      mensagem: "Essa rodada já foi finalizada.",
    };
  }

  if (!Number.isInteger(pecaId) || pecaId < 0 || pecaId > 15) {
    return {
      sucesso: false,
      mensagem: "Peça inválida.",
    };
  }

  const jogador = rodada.jogadores.find(
    (item) => item.jogadorId === jogadorId
  );

  if (!jogador) {
    return {
      sucesso: false,
      mensagem: "Jogador não encontrado nessa partida.",
    };
  }

  if (jogador.acertou) {
    return {
      sucesso: false,
      mensagem: "Você já acertou essa rodada.",
    };
  }

  if (jogador.pecasReveladas.includes(pecaId)) {
    return {
      sucesso: false,
      mensagem: "Essa peça já foi revelada.",
    };
  }

  const quantidadeRevelada = jogador.pecasReveladas.length;

  const pecaGratuita =
    quantidadeRevelada === 0 || quantidadeRevelada === 15;

  if (!pecaGratuita) {
    jogador.pontos -= 100;
  }

  jogador.pecasReveladas.push(pecaId);

  return {
    sucesso: true,
    mensagem: pecaGratuita
      ? "Peça revelada gratuitamente!"
      : "Peça revelada. Foram descontados 100 pontos.",
    pontos: jogador.pontos,
    pecasReveladas: [...jogador.pecasReveladas],
  };
}

function normalizarResposta(resposta: string) {
  return resposta
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function verificarResposta(
  partida: EstadoPartida,
  jogadorId: string,
  resposta: string
) {
  const rodada = partida.rodadas[partida.rodadaAtual - 1];

  if (!rodada || rodada.finalizada || partida.finalizada) {
    return {
      sucesso: false,
      acertou: false,
      mensagem: "Essa rodada já foi finalizada.",
    };
  }

  const jogador = rodada.jogadores.find(
    (item) => item.jogadorId === jogadorId
  );

  if (!jogador) {
    return {
      sucesso: false,
      acertou: false,
      mensagem: "Jogador não encontrado nessa partida.",
    };
  }

  if (!resposta.trim()) {
    return {
      sucesso: false,
      acertou: false,
      mensagem: "Digite uma resposta.",
    };
  }

  if (
    normalizarResposta(resposta) !==
    normalizarResposta(rodada.resposta)
  ) {
    return {
      sucesso: true,
      acertou: false,
      mensagem: "Resposta incorreta. Tente novamente!",
    };
  }

  jogador.acertou = true;
  rodada.finalizada = true;

  rodada.jogadores.forEach((item) => {
    partida.pontuacaoTotal[item.jogadorId] += item.pontos;
  });

  return {
    sucesso: true,
    acertou: true,
    mensagem: "Resposta correta! Rodada finalizada.",
    vencedor: jogadorId,
    pontuacaoTotal: { ...partida.pontuacaoTotal },
  };
}

export function avancarRodada(partida: EstadoPartida) {
  const rodada = partida.rodadas[partida.rodadaAtual - 1];

  if (!rodada?.finalizada) {
    return {
      sucesso: false,
      partidaFinalizada: false,
      mensagem: "A rodada atual ainda não terminou.",
    };
  }

  if (partida.rodadaAtual === 5) {
    partida.finalizada = true;

    return {
      sucesso: true,
      partidaFinalizada: true,
      mensagem: "As cinco rodadas foram concluídas!",
    };
  }

  partida.rodadaAtual++;

  return {
    sucesso: true,
    partidaFinalizada: false,
    mensagem: "Próxima rodada iniciada!",
  };
}
