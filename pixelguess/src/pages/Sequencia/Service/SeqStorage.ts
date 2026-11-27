export type EstadoSequencia = "inicio" | "jogando" | "encerrada";
export type EstadoEtapaSeq = "jogando" | "encerrada";
export type PecasPorEtapa = Record<number, number[]>;

export interface ProgressoSequencia {
  estadoSequencia: EstadoSequencia;
  etapa: number;
  estadoEtapa: EstadoEtapaSeq;
  pontosTotal: number;
  placarEtapa: number;
  pontosEtapa: number[];
  tempo: number;
  pecasPorEtapa: PecasPorEtapa;
}

const CHAVE_SEQ = "pixel_guess_sequencia";

function validarOrdemPecas(ordem: unknown): number[] | null {
  if (!Array.isArray(ordem) || ordem.length !== 16) return null;
  if (!ordem.every((item): item is number => typeof item === "number" && Number.isFinite(item))) {
    return null;
  }
  return ordem;
}

function validarPecasPorEtapa(raw: unknown): PecasPorEtapa {
  const resultado: PecasPorEtapa = {};
  if (!raw || typeof raw !== "object") return resultado;

  for (const etapaNum of [1, 2, 3]) {
    const entrada = (raw as Record<string, unknown>)[String(etapaNum)];
    const validada = validarOrdemPecas(entrada);
    if (validada) {
      resultado[etapaNum] = validada;
    }
  }

  return resultado;
}

export function lerProgressoSequencia(): ProgressoSequencia | null {
  const salvo = localStorage.getItem(CHAVE_SEQ);
  if (!salvo) return null;

  try {
    const parsed = JSON.parse(salvo) as Partial<ProgressoSequencia>;

    const estadoSequencia: EstadoSequencia =
      parsed.estadoSequencia === "inicio" ||
      parsed.estadoSequencia === "jogando" ||
      parsed.estadoSequencia === "encerrada"
        ? parsed.estadoSequencia
        : "inicio";

    const etapa =
      typeof parsed.etapa === "number" && parsed.etapa >= 1 && parsed.etapa <= 3
        ? parsed.etapa
        : 1;

    const estadoEtapa: EstadoEtapaSeq =
      parsed.estadoEtapa === "jogando" || parsed.estadoEtapa === "encerrada"
        ? parsed.estadoEtapa
        : "jogando";

    const pontosTotal =
      typeof parsed.pontosTotal === "number" && Number.isFinite(parsed.pontosTotal)
        ? parsed.pontosTotal
        : 0;

    const placarEtapa =
      typeof parsed.placarEtapa === "number" && Number.isFinite(parsed.placarEtapa)
        ? parsed.placarEtapa
        : 0;

    const pontosEtapa =
      Array.isArray(parsed.pontosEtapa) && parsed.pontosEtapa.length === 3
        ? parsed.pontosEtapa.map((n) => (typeof n === "number" && Number.isFinite(n) ? n : 0))
        : [0, 0, 0];

    const tempo =
      typeof parsed.tempo === "number" && Number.isFinite(parsed.tempo) && parsed.tempo >= 0
        ? parsed.tempo
        : 40;

    const pecasPorEtapa = validarPecasPorEtapa(parsed.pecasPorEtapa);

    return {
      estadoSequencia,
      etapa,
      estadoEtapa,
      pontosTotal,
      placarEtapa,
      pontosEtapa,
      tempo,
      pecasPorEtapa,
    };
  } catch {
    return null;
  }
}

export function salvarProgressoSequencia(dados: ProgressoSequencia): void {
  localStorage.setItem(CHAVE_SEQ, JSON.stringify(dados));
}

export function limparProgressoSequencia(): void {
  localStorage.removeItem(CHAVE_SEQ);
}