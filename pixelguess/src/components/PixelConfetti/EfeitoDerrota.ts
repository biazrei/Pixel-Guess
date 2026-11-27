const GLITCH_COLORS = ["#FF004D", "#29ADFF", "#FFEC27"];

export function iniciarEfeitoDerrota(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  let animationId = 0;
  let frame = 0;

  function desenharFrame() {
    ctx.clearRect(0, 0, width, height);

    const progresso = Math.min(frame / 18, 1);
    const centroX = width / 2;
    const centroY = height / 2;

    // 1. Fundo escuro gradual
    ctx.fillStyle = `rgba(5, 5, 20, ${0.82 * progresso})`;
    ctx.fillRect(0, 0, width, height);

    // 2. Texto central com zoom e glitch
    const escala = 0.85 + Math.min(frame / 15, 1) * 0.15;
    const tamanhoFonte = Math.min(88, width * 0.15);

    ctx.save();
    ctx.translate(centroX, centroY);
    ctx.scale(escala, escala);
    ctx.font = `bold ${tamanhoFonte}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Sombras coloridas (Glitch)
    if (frame % 8 < 4) {
      ctx.fillStyle = "#29ADFF";
      ctx.fillText("GAME OVER", -5, 0);
    }
    if (frame % 10 < 5) {
      ctx.fillStyle = "#FF004D";
      ctx.fillText("GAME OVER", 5, 0);
    }

    // Texto principal
    ctx.fillStyle = "#FFF1E8";
    ctx.shadowColor = "#FF004D";
    ctx.shadowBlur = 18;
    ctx.fillText("GAME OVER", 0, 0);
    ctx.shadowBlur = 0;

    // Faixa de corte horizontal
    if (frame % 7 < 3) {
      const faixaY = Math.sin(frame * 2) * tamanhoFonte * 0.35;
      ctx.save();
      ctx.beginPath();
      ctx.rect(-width, faixaY, width * 2, tamanhoFonte * 0.12);
      ctx.clip();
      ctx.fillStyle = "#29ADFF";
      ctx.fillText("GAME OVER", -12, 0);
      ctx.restore();
    }

    // Subtítulo
    ctx.font = `bold ${Math.max(12, tamanhoFonte * 0.2)}px monospace`;
    ctx.fillStyle = "#FFEC27";
    ctx.fillText("FIM DE JOGO", 0, tamanhoFonte * 0.95);
    ctx.restore();

    // 3. Blocos pixelizados aleatórios
    for (let i = 0; i < 18; i++) {
      if ((frame + i * 3) % 12 < 5) {
        const lado = i % 2 === 0 ? -1 : 1;
        const x = centroX + lado * (width * 0.25 + Math.random() * width * 0.2);
        const y = centroY - tamanhoFonte + Math.random() * tamanhoFonte * 2;
        const tamanho = 4 + Math.random() * 13;

        ctx.fillStyle = GLITCH_COLORS[i % 3];
        ctx.fillRect(x, y, tamanho, tamanho);
      }
    }

    // 4. Linhas de TV antiga (Scanlines)
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    for (let y = 0; y < height; y += 5) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  function render() {
    desenharFrame();
    frame++;

    if (frame < 120) {
      animationId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  render();

  return () => cancelAnimationFrame(animationId);
}