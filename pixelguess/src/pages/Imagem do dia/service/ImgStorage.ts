export type StatusImgDia = "jogando" | "vitoria" | "derrota";

export function lerStatusImgDia(id: number): StatusImgDia | null {
  const status = localStorage.getItem(`pixel_guess_status_${id}`);
  if (status === "vitoria" || status === "derrota" || status === "jogando") {
    return status;
  }
  return null;
}

export function salvarStatusImgDia(id: number, status: StatusImgDia): void {
  localStorage.setItem(`pixel_guess_status_${id}`, status);
}

export function lerPontosImgDia(id: number): number | null {
  const pontos = localStorage.getItem(`pixel_guess_pontos_${id}`);
  if (pontos === null) return null;
  const numero = Number(pontos);
  return Number.isFinite(numero) ? numero : null;
}

export function salvarPontosImgDia(id: number, pontos: number): void {
  localStorage.setItem(`pixel_guess_pontos_${id}`, String(pontos));
}

export function lerNomeImgDia(id: number): string {
  return localStorage.getItem(`pixel_guess_nome_${id}`) || "";
}

export function salvarNomeImgDia(id: number, nome: string): void {
  localStorage.setItem(`pixel_guess_nome_${id}`, nome);
}

export function lerCardsImgDia(id: number): number[] {
  const salvo = localStorage.getItem(`pixel_guess_cards_${id}`);
  if (!salvo) return [];
  try {
    const parsed = JSON.parse(salvo);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is number => typeof item === "number")
      : [];
  } catch {
    return [];
  }
}

export function salvarCardsImgDia(id: number, cards: number[]): void {
  localStorage.setItem(`pixel_guess_cards_${id}`, JSON.stringify(cards));
}