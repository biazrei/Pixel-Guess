import { useState, useEffect } from "react";
import GameContainer from "../../components/GameContainer/Game.Container";

type Imagem = {
  id: number;
  caminho: string;
};

type JogoDiaProps = {
  onPontosChange: (pontos: number) => void;
  estadoJogo: "jogando" | "vitoria" | "derrota";
  onUltimoCardRevelado: () => void;
};

export default function JogoDia({onPontosChange, estadoJogo,onUltimoCardRevelado,}: JogoDiaProps) {
  
  const [pontos, setPontos] = useState<number>(1500);
  const [cardsRevelados, setCardsRevelados] = useState<number[]>([]);
  const [imagens, setImagens] = useState<Imagem[]>([]);

useEffect(() => {
  async function buscarImagens() {
    const resposta = await fetch("http://localhost:3000/api/imagens");
    const dados = await resposta.json();
    setImagens(dados);}
    buscarImagens();
}, []);
  

    const imagemAtual = imagens.find((imagem) => imagem.id === 2);

  function ClicarCard(index: number) {
    if (cardsRevelados.includes(index)) {
        return;}
    const ultimoCard = cardsRevelados.length === 15;
    if (ultimoCard) {
      onUltimoCardRevelado();
    }
    if (cardsRevelados.length > 0 && !ultimoCard) {
      const novosPontos = pontos - 100;
      setPontos(novosPontos);
      onPontosChange(novosPontos);
    }

    setCardsRevelados([...cardsRevelados, index]);
  }

  return (
    <>
    {imagemAtual && (
      <GameContainer
        imagem={`http://localhost:3000/${imagemAtual.caminho}`}
        onCardClick={ClicarCard}
        cardsrevelados={cardsRevelados}
        estadoJogo={estadoJogo}/>
    )}
  </>
  );
}
