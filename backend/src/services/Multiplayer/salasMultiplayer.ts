import { randomBytes } from "node:crypto";
import type { Server, Socket } from "socket.io";
import { buscarImagensMultiplayer } from "./multiplayerfuncionamento.js";
import {
    atualizarSalaAguardando,
    atualizarSalaDisponivel,
    atualizarSalaEmAndamento,
    buscarSalaDisponivel,
    codigoSalaExiste,
    resetarStatusSalas,
} from "./salasDb.js";
import type { SalaAtiva, TipoSala } from "./types.js";

const salasAtivas = new Map<number, SalaAtiva>();

resetarStatusSalas();

function gerarCodigo(): string {
    let codigo = "";

    do {
        codigo = randomBytes(4).toString("hex").substring(0, 6).toUpperCase();
    } while (codigoSalaExiste(codigo));

    return codigo;
}

function reservarSala(tipo: TipoSala) {
    const sala = buscarSalaDisponivel(tipo);

    if (!sala) return null;

    const codigo = gerarCodigo();

    atualizarSalaAguardando(sala.id, codigo);

    const novaSala: SalaAtiva = {
        id: sala.id,
        codigo,
        tipo,
        jogadores: [],
        prontos: [],
        finalizados: [],
        pontuacoesFinais: {},
        rodadaAtual: 0,
        imagens: [],
        prontosProximaRodada: [],
    };

    salasAtivas.set(sala.id, novaSala);

    return novaSala;
}

function entrarNaSala(socket: Socket, sala: SalaAtiva) {
    if (sala.jogadores.includes(socket.id)) return;

    if (sala.jogadores.length >= 2) {
        socket.emit("erro-sala", "Esta sala já está cheia.");
        return;
    }

    sala.jogadores.push(socket.id);
    socket.join(`sala-${sala.id}`);

    socket.data.salaId = sala.id;

    if (sala.jogadores.length === 1) {
        socket.emit("aguardando-jogador", {
            codigo: sala.codigo,
            mensagem: "Aguardando outro jogador.",
        });
    } else {
        ioSockets.get(sala.jogadores[0])?.emit("jogadores-reunidos");
        socket.emit("jogadores-reunidos");
    }
}

function liberarSala(salaId: number) {
    const sala = salasAtivas.get(salaId);

    if (!sala) return;

    atualizarSalaDisponivel(salaId);

    sala.jogadores.forEach((jogadorId) => {
        const jogador = ioSockets.get(jogadorId);

        jogador?.leave(`sala-${salaId}`);
        if (jogador) {
            jogador.data.salaId = undefined;
            jogador.emit("sala-finalizada");
        }
    });

    salasAtivas.delete(salaId);
}

let ioSockets: Server["sockets"]["sockets"];

export function configurarSalas(io: Server) {
    ioSockets = io.sockets.sockets;

    io.on("connection", (socket) => {
        socket.on("entrar-aleatorio", () => {
            const salaAtualId = socket.data.salaId as number | undefined;

            if (salaAtualId !== undefined && salasAtivas.has(salaAtualId)) {
                return;
            }

            const salaAguardando = Array.from(salasAtivas.values()).find(
                (sala) =>
                    sala.tipo === "publica" &&
                    sala.jogadores.length === 1
            );

            const sala = salaAguardando ?? reservarSala("publica");

            if (!sala) {
                socket.emit("erro-sala", "Não há salas públicas disponíveis.");
                return;
            }

            entrarNaSala(socket, sala);
        });

        socket.on("criar-sala-privada", () => {
            const sala = reservarSala("privada");

            if (!sala) {
                socket.emit("erro-sala", "Não há salas privadas disponíveis.");
                return;
            }

            entrarNaSala(socket, sala);

            socket.emit("sala-criada", {
                codigo: sala.codigo,
            });
        });

        socket.on("jogador-pronto", () => {
            const salaId = socket.data.salaId as number | undefined;

            if (salaId === undefined) {
                return;
            }

            const sala = salasAtivas.get(salaId);

            if (!sala || !sala.jogadores.includes(socket.id)) return;

            if (!sala.prontos.includes(socket.id)) {
                sala.prontos.push(socket.id);
            }

            io.to(`sala-${salaId}`).emit("atualizar-prontos", {
                quantidade: sala.prontos.length,
            });

            if (sala.prontos.length === 2) {
                const todasImagens = buscarImagensMultiplayer();

                if (todasImagens.length < 5) {
                    io.to(`sala-${salaId}`).emit(
                        "erro-sala",
                        "Não há imagens suficientes para iniciar a partida."
                    );
                    return;
                }

                sala.imagens = [...todasImagens]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5);

                sala.rodadaAtual = 1;

                atualizarSalaEmAndamento(salaId);

                io.to(`sala-${salaId}`).emit("partida-iniciada", {
                    rodada: sala.rodadaAtual,
                    imagem: sala.imagens[0],
                });
            }
        });

        socket.on("jogador-proxima-rodada", () => {
            const salaId = socket.data.salaId as number | undefined;

            if (salaId === undefined) return;

            const sala = salasAtivas.get(salaId);

            if (!sala || sala.rodadaAtual >= 5) return;

            if (!sala.prontosProximaRodada.includes(socket.id)) {
                sala.prontosProximaRodada.push(socket.id);
            }

            if (sala.prontosProximaRodada.length === sala.jogadores.length) {
                sala.rodadaAtual++;

                sala.prontosProximaRodada = [];

                io.to(`sala-${salaId}`).emit("proxima-rodada", {
                    rodada: sala.rodadaAtual,
                    imagem: sala.imagens[sala.rodadaAtual - 1],
                });
            }
        });

        socket.on("entrar-sala-privada", (codigo: string) => {
            const sala = Array.from(salasAtivas.values()).find(
                (item) =>
                    item.tipo === "privada" &&
                    item.codigo === codigo?.trim().toUpperCase() &&
                    item.jogadores.length === 1
            );

            if (!sala) {
                socket.emit("erro-sala", "Código inválido ou sala indisponível.");
                return;
            }

            entrarNaSala(socket, sala);
        });

        socket.on("finalizar-partida", () => {
            const salaId = socket.data.salaId as number | undefined;

            if (salaId !== undefined) {
                socket.to(`sala-${salaId}`).emit("jogador-desconectou");
                liberarSala(salaId);
            }
        });

        socket.on("jogador-finalizou", (pontuacaoFinal: number) => {
            const salaId = socket.data.salaId as number | undefined;

            if (salaId === undefined) return;

            const sala = salasAtivas.get(salaId);

            if (!sala || !sala.jogadores.includes(socket.id)) return;

            if (
                typeof pontuacaoFinal !== "number" ||
                !Number.isFinite(pontuacaoFinal) ||
                pontuacaoFinal < 0
            ) {
                return;
            }

            sala.pontuacoesFinais[socket.id] = pontuacaoFinal;

            if (!sala.finalizados.includes(socket.id)) {
                sala.finalizados.push(socket.id);
            }

            if (sala.finalizados.length === 2) {
                sala.jogadores.forEach((jogadorId) => {
                    const oponenteId = sala.jogadores.find(
                        (id) => id !== jogadorId
                    );

                    const jogador = io.sockets.sockets.get(jogadorId);

                    jogador?.emit("resultado-final", {
                        meusPontos: sala.pontuacoesFinais[jogadorId] ?? 0,
                        pontosOponente: oponenteId
                            ? sala.pontuacoesFinais[oponenteId] ?? 0
                            : 0,
                    });
                });

                liberarSala(salaId);
            }
        });

        socket.on("disconnect", () => {
            const salaId = socket.data.salaId as number | undefined;

            if (salaId !== undefined) {
                const sala = salasAtivas.get(salaId);

                if (sala) {
                    socket.to(`sala-${salaId}`).emit("jogador-desconectou");
                    liberarSala(salaId);
                }
            }
        });
    });
}