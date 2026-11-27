import { useRef, useImperativeHandle, forwardRef } from "react";
import Puzzle, { type PuzzleRef } from "../../../components/Puzzle/Puzzle";

type EstadoEtapa = "jogando" | "encerrada";

type JogoSeqProps = {
  imagem_1: string;
  imagem_2: string;
  imagem_3: string;
  etapa: number;
  estadoEtapa: EstadoEtapa;
  ordemPecasIniciais?: number[];
  onOrdemPecasChange?: (ordem: number[]) => void;
};

export type JogoSeqRef = {
  calcularPontos: () => number;
};

const JogoSequencia = forwardRef<JogoSeqRef, JogoSeqProps>((props, ref) => {
  const puzzleRef = useRef<PuzzleRef>(null);

  const imagemAtual =
    props.etapa === 1
      ? props.imagem_1
      : props.etapa === 2
      ? props.imagem_2
      : props.imagem_3;

  useImperativeHandle(ref, () => ({
    calcularPontos: () => {
      if (puzzleRef.current) {
        return puzzleRef.current.calcularPontos();
      }
      return 0;
    },
  }));

  return (
    <div>
      <Puzzle
        ref={puzzleRef}
        key={props.etapa}
        imagem={imagemAtual}
        estadoEtapa={props.estadoEtapa}
        ordemPecasIniciais={props.ordemPecasIniciais}
        onOrdemPecasChange={props.onOrdemPecasChange}
      />
    </div>
  );
});

export default JogoSequencia;