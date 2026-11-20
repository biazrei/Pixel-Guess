import { Server, Socket } from "socket.io";
import { reservarSalaPrivada, entrarNaSala, entrarEmPartidaRapida, sairDaSala, limparReservasExpiradas, buscarSalaDoJogador, } from "./salas.js";
import { criarPartida, revelarPeca, verificarResposta, avancarRodada, type EstadoPartida, } from "./partida.js";
import { buscarImagensMultiplayer } from "../services/multiplayerFuncionamento.js";

type DadosSala = {
  id: number;
  nome: string;
  status: "livre" | "aguardando" | "em_andamento";
  jogadores: { id: string; nome: string }[];
};

const partidasAtivas = new Map<number, EstadoPartida>();

const confirmacoesProximaRodada = new Map<number, Set<string>>();

function emitirEstadoPartida(
  io: Server,
  partida: EstadoPartida,
  jogadoresSala: { id: string; nome: string }[]
) {
  const rodada = partida.rodadas[partida.rodadaAtual - 1];

  if (!rodada) return;

  for (const jogador of rodada.jogadores) {
    const minhasPecas = jogador.pecasReveladas;

    const jogadores = rodada.jogadores.map((outro) => {
      const dadosSala = jogadoresSala.find(
        (item) => item.id === outro.jogadorId
      );

      return {
        id: outro.jogadorId,
        nome: dadosSala?.nome ?? "Jogador",
        pontosRodada: outro.pontos,
        pontuacaoTotal: partida.pontuacaoTotal[outro.jogadorId],
        quantidadePecasReveladas: outro.pecasReveladas.length,
        acertou: outro.acertou,
      };
    });

    io.to(jogador.jogadorId).emit("estado-partida", {
      salaId: partida.salaId,
      rodadaAtual: partida.rodadaAtual,
      totalRodadas: 5,
      imagemId: rodada.imagemId,
      caminhoImagem: rodada.caminhoImagem,
      minhasPecasReveladas: [...minhasPecas],
      meusPontos: jogador.pontos,
      jogadores,
      finalizada: partida.finalizada,
    });
  }
}

function iniciarPartida(
  io: Server,
  sala: DadosSala
) {
  if (partidasAtivas.has(sala.id)) return;

  const imagens = buscarImagensMultiplayer(5);

  if (!imagens || imagens.length !== 5) {
    io.to(`sala-${sala.id}`).emit("erro-partida", {
      mensagem:
        "Ainda não existem cinco imagens cadastradas para iniciar uma partida.",
    });

    sairDaSala(sala.id, sala.jogadores[0].id);

    for (const jogador of sala.jogadores) {
      const jogadorSocket = io.sockets.sockets.get(jogador.id);

      if (jogadorSocket) {
        jogadorSocket.data.salaId = null;
        jogadorSocket.leave(`sala-${sala.id}`);
      }
    }

    return;
  }

  const partida = criarPartida(
    sala.id,
    sala.jogadores.map((jogador) => jogador.id),
    imagens
  );

  partidasAtivas.set(sala.id, partida);

  confirmacoesProximaRodada.set(sala.id, new Set());

  emitirEstadoPartida(io, partida, sala.jogadores);
}

function finalizarPartida(
  io: Server,
  partida: EstadoPartida,
  jogadoresSala: { id: string; nome: string }[]
) {
  const pontuacoes = Object.entries(partida.pontuacaoTotal);

  const maiorPontuacao = Math.max(
    ...pontuacoes.map(([, pontos]) => pontos)
  );

  const vencedores = pontuacoes
    .filter(([, pontos]) => pontos === maiorPontuacao)
    .map(([jogadorId]) => {
      return jogadoresSala.find(
        (jogador) => jogador.id === jogadorId
      );
    })
    .filter((jogador) => jogador !== undefined);

  const nomeCanal = `sala-${partida.salaId}`;

  io.to(nomeCanal).emit("partida-finalizada", {
    vencedores,
    empate: vencedores.length > 1,
    pontuacaoTotal: partida.pontuacaoTotal,
  });

  sairDaSala(
    partida.salaId,
    jogadoresSala[0].id
  );

  for (const jogador of jogadoresSala) {
    const jogadorSocket = io.sockets.sockets.get(jogador.id);

    if (jogadorSocket) {
      jogadorSocket.data.salaId = null;
      jogadorSocket.leave(nomeCanal);
    }
  }

  partidasAtivas.delete(partida.salaId);
  confirmacoesProximaRodada.delete(partida.salaId);
}

function configurarEntrada(
  io: Server,
  socket: Socket,
  resultado: ReturnType<typeof entrarNaSala>
) {
  if (!resultado.sucesso || !resultado.sala) {
    socket.emit("erro-sala", {
      mensagem: resultado.mensagem,
    });
    return;
  }

  const sala = resultado.sala;
  const nomeCanal = `sala-${sala.id}`;

  socket.data.salaId = sala.id;
  socket.join(nomeCanal);

  io.to(nomeCanal).emit("atualizacao-sala", {
    sala,
    mensagem: resultado.mensagem,
  });

  if (sala.status === "em_andamento") {
    iniciarPartida(io, sala);

    io.to(nomeCanal).emit("partida-iniciada", {
      salaId: sala.id,
      nomeSala: sala.nome,
      jogadores: sala.jogadores,
    });
  }
}

export function configurarEventos(io: Server) {
  setInterval(() => {
    const reservasExpiradas = limparReservasExpiradas();

    for (const reserva of reservasExpiradas) {
      const nomeCanal = `sala-${reserva.salaId}`;

      for (const jogadorId of reserva.jogadoresIds) {
        const jogadorSocket = io.sockets.sockets.get(jogadorId);

        if (jogadorSocket) {
          jogadorSocket.emit("reserva-expirada", {
            mensagem: "Sua reserva expirou. A sala foi liberada.",
          });

          jogadorSocket.leave(nomeCanal);
          jogadorSocket.data.salaId = null;
        }
      }

      console.log(`Reserva da ${reserva.nomeSala} expirou.`);
    }
  }, 5000);

  io.on("connection", (socket) => {
    console.log("Jogador conectado:", socket.id);

    socket.data.salaId = null;

    socket.on("consultar-partida", () => {
      const sala = buscarSalaDoJogador(socket.id);

      if (!sala || sala.status !== "em_andamento") {
        socket.emit("erro-partida", {
          mensagem: "Você não está em uma partida ativa.",
        });
        return;
      }

      const partida = partidasAtivas.get(sala.id);

      if (!partida) {
        socket.emit("erro-partida", {
          mensagem: "Não foi possível recuperar essa partida.",
        });
        return;
      }

      socket.data.salaId = sala.id;
      socket.join(`sala-${sala.id}`);

      emitirEstadoPartida(io, partida, sala.jogadores);
    });

    socket.on("reservar-sala", (dados: { nome?: unknown }) => {
      if (socket.data.salaId !== null) {
        socket.emit("erro-sala", {
          mensagem: "Você já está em uma sala.",
        });
        return;
      }

      if (
        typeof dados?.nome !== "string" ||
        !dados.nome.trim()
      ) {
        socket.emit("erro-sala", {
          mensagem: "Informe um nome válido.",
        });
        return;
      }

      const jogador = {
        id: socket.id,
        nome: dados.nome.trim().slice(0, 20),
      };

      const resultado = reservarSalaPrivada(jogador);

      if (!resultado.sucesso || !resultado.sala) {
        socket.emit("erro-sala", {
          mensagem: resultado.mensagem,
        });
        return;
      }

      const sala = resultado.sala;

      socket.data.salaId = sala.id;
      socket.join(`sala-${sala.id}`);

      socket.emit("sala-reservada", {
        salaId: sala.id,
        nomeSala: sala.nome,
        mensagem: resultado.mensagem,
      });
    });

    socket.on(
      "entrar-sala",
      (dados: { nomeSala?: unknown; nome?: unknown }) => {
        if (socket.data.salaId !== null) {
          socket.emit("erro-sala", {
            mensagem: "Você já está em uma sala.",
          });
          return;
        }

        if (
          typeof dados?.nomeSala !== "string" ||
          !dados.nomeSala.trim() ||
          typeof dados.nome !== "string" ||
          !dados.nome.trim()
        ) {
          socket.emit("erro-sala", {
            mensagem: "Informe o código da sala e seu nome.",
          });
          return;
        }

        const jogador = {
          id: socket.id,
          nome: dados.nome.trim().slice(0, 20),
        };

        const resultado = entrarNaSala(
          dados.nomeSala,
          jogador
        );

        configurarEntrada(io, socket, resultado);
      }
    );

    socket.on("partida-rapida", (dados: { nome?: unknown }) => {
      if (socket.data.salaId !== null) {
        socket.emit("erro-sala", {
          mensagem: "Você já está em uma sala.",
        });
        return;
      }

      if (
        typeof dados?.nome !== "string" ||
        !dados.nome.trim()
      ) {
        socket.emit("erro-sala", {
          mensagem: "Informe um nome válido.",
        });
        return;
      }

      const jogador = {
        id: socket.id,
        nome: dados.nome.trim().slice(0, 20),
      };

      const resultado = entrarEmPartidaRapida(jogador);

      configurarEntrada(io, socket, resultado);
    });

    socket.on(
      "revelar-peca",
      (dados: { pecaId?: unknown }) => {
        const salaId = socket.data.salaId as number | null;

        if (salaId === null) return;

        const partida = partidasAtivas.get(salaId);

        if (!partida) return;

        if (typeof dados?.pecaId !== "number") {
          socket.emit("erro-partida", {
            mensagem: "Peça inválida.",
          });
          return;
        }

        const resultado = revelarPeca(
          partida,
          socket.id,
          dados.pecaId
        );

        socket.emit("peca-revelada", resultado);

        if (resultado.sucesso) {
          const sala = buscarSalaDoJogador(socket.id);

          if (sala) {
            emitirEstadoPartida(io, partida, sala.jogadores);
          }
        }
      }
    );

    socket.on(
      "verificar-resposta",
      (dados: { resposta?: unknown }) => {
        const salaId = socket.data.salaId as number | null;

        if (salaId === null) return;

        const partida = partidasAtivas.get(salaId);

        if (!partida) return;

        if (typeof dados?.resposta !== "string") {
          socket.emit("resultado-resposta", {
            sucesso: false,
            acertou: false,
            mensagem: "Digite uma resposta válida.",
          });
          return;
        }

        const resultado = verificarResposta(
          partida,
          socket.id,
          dados.resposta
        );

        if (resultado.acertou) {
          const sala = buscarSalaDoJogador(socket.id);

          io.to(`sala-${salaId}`).emit("rodada-finalizada", {
            numeroRodada: partida.rodadaAtual,
            vencedor: socket.id,
            mensagem: resultado.mensagem,
            pontuacaoTotal: partida.pontuacaoTotal,
          });

          if (sala) {
            emitirEstadoPartida(io, partida, sala.jogadores);
          }
        } else {
          socket.emit("resultado-resposta", resultado);
        }
      }
    );

    socket.on("confirmar-proxima-rodada", () => {
      const salaId = socket.data.salaId as number | null;

      if (salaId === null) return;

      const partida = partidasAtivas.get(salaId);

      if (!partida) return;

      const sala = buscarSalaDoJogador(socket.id);

      if (!sala) return;

      const rodada = partida.rodadas[partida.rodadaAtual - 1];

      if (!rodada?.finalizada) {
        socket.emit("erro-partida", {
          mensagem: "A rodada ainda não terminou.",
        });
        return;
      }

      const confirmacoes =
        confirmacoesProximaRodada.get(salaId);

      if (!confirmacoes) return;

      confirmacoes.add(socket.id);

      io.to(`sala-${salaId}`).emit(
        "aguardando-proxima-rodada",
        {
          quantidadeProntos: confirmacoes.size,
          totalJogadores: 2,
        }
      );

      if (confirmacoes.size < 2) return;

      const resultado = avancarRodada(partida);

      if (!resultado.sucesso) return;

      confirmacoes.clear();

      if (resultado.partidaFinalizada) {
        finalizarPartida(io, partida, sala.jogadores);
        return;
      }

      io.to(`sala-${salaId}`).emit("proxima-rodada-iniciada", {
        rodadaAtual: partida.rodadaAtual,
        mensagem: resultado.mensagem,
      });

      emitirEstadoPartida(io, partida, sala.jogadores);
    });

    function removerJogador(desconectou = false) {
      const salaId = socket.data.salaId as number | null;

      if (salaId === null) return;

      const nomeCanal = `sala-${salaId}`;

      const resultado = sairDaSala(salaId, socket.id);

      if (!resultado.sucesso) {
        socket.data.salaId = null;
        return;
      }

      const outrosSockets = [
        ...(io.sockets.adapter.rooms.get(nomeCanal) ?? []),
      ].filter((id) => id !== socket.id);

      if (outrosSockets.length > 0) {
        io.to(nomeCanal).emit("partida-encerrada", {
          mensagem: desconectou
            ? "O outro jogador desconectou."
            : "O outro jogador saiu da sala.",
        });

        for (const id of outrosSockets) {
          const outroSocket = io.sockets.sockets.get(id);

          if (outroSocket) {
            outroSocket.leave(nomeCanal);
            outroSocket.data.salaId = null;
          }
        }
      }

      partidasAtivas.delete(salaId);
      confirmacoesProximaRodada.delete(salaId);

      socket.data.salaId = null;
      socket.leave(nomeCanal);

      io.to(nomeCanal).emit("atualizacao-sala", {
        mensagem: "A sala foi liberada.",
      });
    }

    socket.on("sair-sala", () => {
      removerJogador();
    });

    socket.on("disconnect", () => {
      console.log("Jogador desconectado:", socket.id);
      removerJogador(true);
    });
  });
}
