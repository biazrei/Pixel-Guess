import { useState, useEffect } from "react";
import GameContainer from "../../components/GameContainer/Game.Container";
import Text from "../../components/Text/Text";

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
  const [imagemAtual, setImagemAtual] = useState<Imagem | null>(null);
  const [erro, setErro] = useState<string | null>(null);

useEffect(() => {
  async function buscarImagens() {
    try{
       const resposta = await fetch("http://localhost:3000/api/imagem-do-dia");

      if (!resposta.ok) {
        throw new Error("Não foi possível buscar a imagem do dia.");
      }

      const dados = await resposta.json();
      setImagemAtual(dados);

    } catch (erro) {
      setErro("Erro ao carregar a imagem do dia.");
      console.error(erro);
    }
  }
    buscarImagens();
}, []);
  

  

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
         {erro ? ( <Text>{erro}</Text>) : imagemAtual ? (
          
          <GameContainer
          imagem={`http://localhost:3000/${imagemAtual.caminho}`}
          onCardClick={ClicarCard}
          cardsrevelados={cardsRevelados}
          estadoJogo={estadoJogo}  />) : ( <Text>Carregando imagem...</Text> )}
  </>
  );
}
