import "./Puzzle.css";
import { useState, forwardRef, useImperativeHandle } from "react";

type PuzzleProps = {
  imagem: string;
  estadoEtapa: "jogando"| "encerrada";
};

export type PuzzleRef = {
  calcularPontos: () => number;
};

const Puzzle = forwardRef<PuzzleRef, PuzzleProps>((props, ref) => {
  const [ordemPecas, setOrdemPecas] = useState(() => {
    const pecas = Array.from({ length: 16 }, (_, index) => index);
     
      do  {for (let i = pecas.length - 1; i > 0; i--){ 
      const j = Math.floor(Math.random() * (i + 1));
      [pecas[i], pecas[j]] = [pecas[j], pecas[i]];
    }

} while (pecas.some((peca, index) => peca === index));

    return pecas;
  });

  const [pecaSelecionada, setPecaSelecionada] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    calcularPontos: () => {
      let pecasCorretas = 0;

      ordemPecas.forEach((peca, index) => {
        if (peca === index) {
          pecasCorretas++;
        }
      });

      return pecasCorretas * 50; 
    }
  }));

  function selecionarPeca(index: number) {
    if (props.estadoEtapa === "encerrada") return;
    if (pecaSelecionada === null) {
      setPecaSelecionada(index);
      return;
    }

    if (pecaSelecionada === index) {
      setPecaSelecionada(null);
      return;
    }

    const novasPecas = [...ordemPecas];

    [novasPecas[pecaSelecionada], novasPecas[index]] = [
      novasPecas[index],
      novasPecas[pecaSelecionada],
    ];

    setOrdemPecas(novasPecas);
    setPecaSelecionada(null);
  }

  return (
    <div className="pecas--grid">
      {ordemPecas.map((peca, index) => {
        const coluna = peca % 4;
        const linha = Math.floor(peca / 4);
        const pecaCorreta = peca === index;
        const mostrarAcerto = props.estadoEtapa === "encerrada" && pecaCorreta;
        const blur = props.estadoEtapa === "jogando" && !pecaCorreta;

        return (
          <div
            className={`pecas 
              ${pecaSelecionada === index ? "peca--selecionada" : ""} 
              ${ mostrarAcerto? "peca--correta" : ""}
              ${ blur? "peca--blur" : ""}
            `}
            key={index}
            onClick={() => selecionarPeca(index)}
            style={{
              backgroundImage: `url(http://localhost:3000/imagens/imgseq/${props.imagem})`,
              backgroundPosition: `${(coluna * 100) / 3}% ${(linha * 100) / 3}%`,
            }}
          />
        );
      })}
    </div>
  );
});

export default Puzzle;