import { useEffect, useRef } from "react";
import { iniciarEfeitoVitoria } from "./EfeitoVitoria";
import { iniciarEfeitoDerrota } from "./EfeitoDerrota";

interface PixelConfettiProps {
  active: boolean;
  type: "vitoria" | "derrota";
}

export function PixelConfetti({ active, type }: PixelConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.scale(ratio, ratio);
    ctx.imageSmoothingEnabled = false;

    const iniciarAnimacao =
      type === "vitoria" ? iniciarEfeitoVitoria : iniciarEfeitoDerrota;

    return iniciarAnimacao(ctx, width, height);
  }, [active, type]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}