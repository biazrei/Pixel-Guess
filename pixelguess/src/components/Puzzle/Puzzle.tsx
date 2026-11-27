import "./Puzzle.css";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

type PuzzleProps = {
  imagem: string;
  estadoEtapa: "jogando" | "encerrada";
  pastaImagem?: string;
  onPontosChange?: (pontos: number) => void;
  ordemPecasIniciais?: number[];
  onOrdemPecasChange?: (ordem: number[]) => void;
};

export type PuzzleRef = {
  calcularPontos: () => number;
};

function embaralharPecas(): number[] {
  const pecas = Array.from({ length: 16 }, (_, index) => index);

  do {
    for (let i = pecas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pecas[i], pecas[j]] = [pecas[j], pecas[i]];
    }
  } while (pecas.some((peca, index) => peca === index));

  return pecas;
}

const Puzzle = forwardRef<PuzzleRef, PuzzleProps>((props, ref) => {
  const [ordemPecas, setOrdemPecas] = useState<number[]>(() => {
    const iniciais = props.ordemPecasIniciais;
    if (
      Array.isArray(iniciais) &&
      iniciais.length === 16 &&
      iniciais.every((item) => typeof item === "number")
    ) {
      return iniciais;
    }
    return embaralharPecas();
  });

  const [pecaSelecionada, setPecaSelecionada] = useState<number | null>(null);
  const onPontosChangeRef = useRef(props.onPontosChange);
  const onOrdemPecasChangeRef = useRef(props.onOrdemPecasChange);

  useEffect(() => {
    onPontosChangeRef.current = props.onPontosChange;
    onOrdemPecasChangeRef.current = props.onOrdemPecasChange;
  }, [props.onPontosChange, props.onOrdemPecasChange]);

  function calcularPontos(pecasAtual: number[] = ordemPecas) {
    let pecasCorretas = 0;

    pecasAtual.forEach((peca, index) => {
      if (peca === index) {
        pecasCorretas++;
      }
    });

    return pecasCorretas * 50;
  }

  useImperativeHandle(ref, () => ({
    calcularPontos: () => calcularPontos(ordemPecas),
  }));

  useEffect(() => {
    onOrdemPecasChangeRef.current?.(ordemPecas);
    onPontosChangeRef.current?.(calcularPontos(ordemPecas));
  }, [ordemPecas]);

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
              ${mostrarAcerto ? "peca--correta" : ""}
              ${blur ? "peca--blur" : ""}
            `}
            key={index}
            onClick={() => selecionarPeca(index)}
            style={{
              backgroundImage: `url(http://localhost:3000/imagens/${props.pastaImagem ?? "imgseq"}/${props.imagem})`,
              backgroundPosition: `${(coluna / 3) * 100}% ${(linha / 3) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
});

export default Puzzle;