export type StatusImgDia = "jogando" | "vitoria" | "derrota";

export interface ProgressoImgDia {
  estadoJogo: StatusImgDia;
  pontos: number;
  cardsRevelados: number[];
  nomeResposta: string;
  ultimaTentativa: boolean;
}

function chaveImgDia(imagemId: number): string {
  return `pixel_guess_img_dia_${imagemId}`;
}

export function lerProgressoImgDia(imagemId: number): ProgressoImgDia | null {
  try {
    const salvo = localStorage.getItem(chaveImgDia(imagemId));
    if (!salvo) return null;
    return JSON.parse(salvo) as ProgressoImgDia;
  } catch {
    return null;
  }
}

export function salvarProgressoImgDia(
  imagemId: number,
  dados: ProgressoImgDia
): void {
  localStorage.setItem(chaveImgDia(imagemId), JSON.stringify(dados));
}

export function limparProgressoImgDia(imagemId: number): void {
  localStorage.removeItem(chaveImgDia(imagemId));
}