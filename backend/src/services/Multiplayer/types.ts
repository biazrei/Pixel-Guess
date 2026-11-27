import type { buscarImagensMultiplayer } from "./multiplayerfuncionamento.js";

export type TipoSala = "publica" | "privada";

export type SalaAtiva = {
    id: number;
    codigo: string;
    tipo: TipoSala;
    jogadores: string[];
    prontos: string[];
    finalizados: string[];
    pontuacoesFinais: Record<string, number>;
    rodadaAtual: number;
    imagens: ReturnType<typeof buscarImagensMultiplayer>;
    prontosProximaRodada: string[];
};