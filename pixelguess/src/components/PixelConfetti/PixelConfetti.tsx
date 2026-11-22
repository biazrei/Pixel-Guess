
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  type: "emoji" | "confetti";
}

interface PixelConfettiProps {
  active: boolean;
}

const COLORS = [
  "#FF004D",
  "#00E436",
  "#29ADFF",
  "#FFEC27",
  "#FFA300",
  "#FFF1E8",
];

export function PixelConfetti({ active }: PixelConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    ctx.scale(ratio, ratio);

    const particles: Particle[] = [];

    function criarExplosao() {
      const centroX = width / 2;
      const centroY = height / 2;

      // Confetes coloridos
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 9 + 7;

        particles.push({
          x: centroX,
          y: centroY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * 7 + 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          life: 100,
          type: "confetti",
        });
      }

      // Emoji de comemoração
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 8 + 8;

        particles.push({
          x: centroX,
          y: centroY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: 28 + Math.random() * 12,
          color: "#FFFFFF",
          rotation: 0,
          rotationSpeed: 0,
          life: 100,
          type: "emoji",
        });
      }
    }

    let explosoesPendentes = 3;

    const timers = [0, 100, 200].map((delay) =>
      window.setTimeout(() => {
        criarExplosao();
        explosoesPendentes--;
      }, delay)
    );

    let animationId = 0;

    function render() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Movimento e gravidade
        p.vy += 0.045;
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.rotation += p.rotationSpeed;
        p.life--;

        ctx!.save();

        ctx!.globalAlpha = Math.min(1, p.life / 25);
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);

        if (p.type === "emoji") {
          ctx!.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
          ctx!.textAlign = "center";
          ctx!.textBaseline = "middle";
          ctx!.fillText("😎", 0, 0);
        } else {
          ctx!.fillStyle = p.color;
          ctx!.fillRect(
            -p.size / 2,
            -p.size / 3,
            p.size,
            p.size * 0.65
          );
        }

        ctx!.restore();

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0 || explosoesPendentes > 0) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx!.clearRect(0, 0, width, height);
      }
    }

    render();

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(animationId);
    };
  }, [active]);

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
