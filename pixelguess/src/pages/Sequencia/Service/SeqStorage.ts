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

export function lerProgressoSequencia(): ProgressoSequencia | null {
  try {
    const salvo = localStorage.getItem(CHAVE_SEQ);
    if (!salvo) return null;
    return JSON.parse(salvo) as ProgressoSequencia;
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