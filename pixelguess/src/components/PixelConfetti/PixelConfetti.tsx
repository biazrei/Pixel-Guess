
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
  type: "vitoria" | "derrota";
}

const COLORS = [
  "#FF004D",
  "#00E436",
  "#29ADFF",
  "#FFEC27",
  "#FFA300",
  "#FFF1E8",
];

export function PixelConfetti({ active, type }: PixelConfettiProps) {
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
    ctx.imageSmoothingEnabled = false;

    let animationId = 0;
    let frame = 0;

    const particles: Particle[] = [];

    // EFEITO DE VITÓRIA
    function criarExplosao() {
      const centroX = width / 2;
      const centroY = height / 2;

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

    // EFEITO GAME OVER PIXELIZADO
    function desenharGameOver() {
      const progresso = Math.min(frame / 18, 1);
      const centroX = width / 2;
      const centroY = height / 2;

      // Fundo escuro
      ctx!.fillStyle = `rgba(5, 5, 20, ${0.82 * progresso})`;
      ctx!.fillRect(0, 0, width, height);

      // Pequena entrada do texto
      const escala = 0.85 + Math.min(frame / 15, 1) * 0.15;

      ctx!.save();
      ctx!.translate(centroX, centroY);
      ctx!.scale(escala, escala);

      const tamanhoFonte = Math.min(88, width * 0.15);
      const texto = "GAME OVER";

      ctx!.font = `bold ${tamanhoFonte}px monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      // Glitch ciano
      if (frame % 8 < 4) {
        ctx!.fillStyle = "#29ADFF";
        ctx!.fillText(texto, -5, 0);
      }

      // Glitch rosa
      if (frame % 10 < 5) {
        ctx!.fillStyle = "#FF004D";
        ctx!.fillText(texto, 5, 0);
      }

      // Texto principal
      ctx!.fillStyle = "#FFF1E8";
      ctx!.shadowColor = "#FF004D";
      ctx!.shadowBlur = 18;
      ctx!.fillText(texto, 0, 0);

      ctx!.shadowBlur = 0;

      // Faixas de glitch atravessando o texto
      if (frame % 7 < 3) {
        const faixaY = Math.sin(frame * 2) * tamanhoFonte * 0.35;

        ctx!.save();
        ctx!.beginPath();
        ctx!.rect(
          -width,
          faixaY,
          width * 2,
          tamanhoFonte * 0.12
        );
        ctx!.clip();

        ctx!.fillStyle = "#29ADFF";
        ctx!.fillText(texto, -12, 0);

        ctx!.restore();
      }

      // Subtítulo
      ctx!.font = `bold ${Math.max(12, tamanhoFonte * 0.2)}px monospace`;
      ctx!.fillStyle = "#FFEC27";
      ctx!.fillText("FIM DE JOGO", 0, tamanhoFonte * 0.95);

      ctx!.restore();

      // Pequenos blocos pixelizados
      for (let i = 0; i < 18; i++) {
        if ((frame + i * 3) % 12 < 5) {
          const lado = i % 2 === 0 ? -1 : 1;

          const x =
            centroX + lado * (width * 0.25 + Math.random() * width * 0.2);

          const y =
            centroY - tamanhoFonte + Math.random() * tamanhoFonte * 2;

          const tamanho = 4 + Math.random() * 13;

          ctx!.fillStyle =
            i % 3 === 0
              ? "#FF004D"
              : i % 3 === 1
              ? "#29ADFF"
              : "#FFEC27";

          ctx!.fillRect(x, y, tamanho, tamanho);
        }
      }

      // Linhas horizontais discretas
      ctx!.fillStyle = "rgba(255, 255, 255, 0.07)";

      for (let y = 0; y < height; y += 5) {
        ctx!.fillRect(0, y, width, 1);
      }
    }

    let explosoesPendentes = type === "vitoria" ? 3 : 0;

    const timers =
      type === "vitoria"
        ? [0, 100, 200].map((delay) =>
            window.setTimeout(() => {
              criarExplosao();
              explosoesPendentes--;
            }, delay)
          )
        : [];

    function render() {
      ctx!.clearRect(0, 0, width, height);

      if (type === "derrota") {
        desenharGameOver();

        frame++;

        if (frame < 120) {
          animationId = requestAnimationFrame(render);
        } else {
          ctx!.clearRect(0, 0, width, height);
        }

        return;
      }

      // Partículas da vitória
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

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
