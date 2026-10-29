import { useState } from "react";
import gato from '../../assets/gato.jpeg'
import GameContainer from "../../components/GameContainer/Game.Container";

type JogoDiaProps = {
  onPontosChange: (pontos: number) => void;
  respostaCorreta:boolean;
  onUltimoCardRevelado: () => void;};
 
  

export default function JogoDia({onPontosChange, respostaCorreta, onUltimoCardRevelado}: JogoDiaProps)

{

   const [pontos, setPontos] = useState<number>(1500);
   const [cardsRevelados, setCardsRevelados]= useState<number[]>([]);

   function ClicarCard(index: number) {
    if (cardsRevelados.includes(index)) {
     return;}

    const ultimoCard=cardsRevelados.length ===15;
    if (ultimoCard) { onUltimoCardRevelado();}
    if (cardsRevelados.length > 0 && !ultimoCard) {
     const novosPontos = pontos - 100;
     setPontos(novosPontos);
     onPontosChange(novosPontos); }

    setCardsRevelados([...cardsRevelados, index]);
}
   
   return(
    <GameContainer
     imagem={gato}
     onCardClick={ClicarCard}
     cardsrevelados={cardsRevelados}
     respostaCorreta={respostaCorreta}
    />)
}