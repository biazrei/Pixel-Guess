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

    const ultimoCard = cardsRevelados.length === 15;
    if (ultimoCard) {
      onUltimoCardRevelado();
    }

    const novosPontos = Math.max(pontos - 100, 0);
    setPontos(novosPontos);
    onPontosChange(novosPontos);

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
