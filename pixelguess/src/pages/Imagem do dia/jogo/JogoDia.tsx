import { useState } from "react";
import GameContainer from "../../../components/GameContainer/Game.Container";
import Text from "../../../components/Text/Text";

type Imagem = {
  id: number;
  caminho: string;
};

type JogoDiaProps = {
  imagem: Imagem | null;
  onPontosChange: (pontos: number) => void;
  estadoJogo: "jogando" | "vitoria" | "derrota";
  onUltimoCardRevelado: () => void;
};

export default function JogoDia({
  imagem,
  onPontosChange,
  estadoJogo,
  onUltimoCardRevelado,
}: JogoDiaProps) {
  const [cardsRevelados, setCardsRevelados] = useState<number[]>([]);
  const [pontos, setPontos] = useState<number>(1500);
  
  function ClicarCard(index: number) {
    if (cardsRevelados.includes(index) || estadoJogo !== "jogando") {
      return;
    }
    const UltimoCard = cardsRevelados.length === 15;
  
    if (cardsRevelados.length > 0 && !UltimoCard) {
      const novosPontos = Math.max(pontos - 100, 0);
      setPontos(novosPontos);
      onPontosChange(novosPontos);
    }

    if (UltimoCard) {
      onUltimoCardRevelado();
    }

    setCardsRevelados([...cardsRevelados, index]);
  }

  return (
    <>
      {imagem ? (
        <GameContainer
          imagem={`http://localhost:3000/${imagem.caminho}`}
          onCardClick={ClicarCard}
          cardsrevelados={cardsRevelados}
          estadoJogo={estadoJogo}
        />
      ) : (
        <Text>Carregando imagem...</Text>
      )}
    </>
  );
}