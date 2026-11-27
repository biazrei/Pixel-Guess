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
  isEmoji: boolean;
}

const COLORS = ["#FF004D", "#00E436", "#29ADFF", "#FFEC27", "#FFA300", "#FFF1E8"];

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export function iniciarEfeitoVitoria(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  let animationId = 0;
  let explosoesRestantes = 3;
  const particles: Particle[] = [];

  function criarExplosao() {
    const centroX = width / 2;
    const centroY = height / 2;

    // Confetes (100) + Emojis (12)
    for (let i = 0; i < 112; i++) {
      const isEmoji = i >= 100;
      const angle = random(0, Math.PI * 2);
      const velocity = isEmoji ? random(8, 16) : random(7, 16);

      particles.push({
        x: centroX,
        y: centroY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: isEmoji ? random(28, 40) : random(4, 11),
        color: COLORS[Math.floor(random(0, COLORS.length))],
        rotation: isEmoji ? 0 : random(0, 360),
        rotationSpeed: isEmoji ? 0 : random(-0.1, 0.1),
        life: 100,
        isEmoji,
      });
    }
  }

  // Explosões em sequência
  const timers = [0, 100, 200].map((delay) =>
    window.setTimeout(() => {
      criarExplosao();
      explosoesRestantes--;
    }, delay)
  );

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045; // Gravidade
      p.vx *= 0.985; // Atrito
      p.vy *= 0.985;
      p.rotation += p.rotationSpeed;
      p.life--;

      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / 25);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.isEmoji) {
        ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("😎", 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
      }

      ctx.restore();

      if (p.life <= 0) particles.splice(i, 1);
    }

    if (particles.length > 0 || explosoesRestantes > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  render();

  // Retorna a função de limpeza para o React
  return () => {
    timers.forEach(clearTimeout);
    cancelAnimationFrame(animationId);
  };
}