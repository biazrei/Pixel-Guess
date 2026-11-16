
import "./Puzzle.css";
import { useState } from "react";

type PuzzleProps = {
  imagem: string;
  bloqueado: boolean;
};

export default function Puzzle(props: PuzzleProps) {
  const [ordemPecas, setOrdemPecas] = useState(() => {
    const pecas = Array.from({ length: 16 }, (_, index) => index);
    pecas.sort(() => Math.random() - 0.5);
    return pecas;
  });

  const [pecaSelecionada, setPecaSelecionada] = useState<number | null>(null);

  function selecionarPeca(index: number) {
    if(props.bloqueado) return;
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
    <div className="pecas-grid">
      {ordemPecas.map((peca, index) => {
        const coluna = peca % 4;
        const linha = Math.floor(peca / 4);

        return (
          <div
            className={
              pecaSelecionada === index
                ? "pecas peca--selecionada"
                : "pecas"
            }
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
}
