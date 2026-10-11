import { useState } from "react";
import gato from '../../assets/gato.jpeg'
import GameContainer from "../../components/GameContainer/Game.Container";

export default function JogoDia(){
   const [cardsRevelados, setCardsRevelados]= useState<number[]>([]);

   function ClicarCard (index:number){
    if (cardsRevelados.includes(index)) {
        return; }
    setCardsRevelados ([...cardsRevelados, index]);
   }
   
   return(
    <GameContainer
     imagem={gato}
     onCardClick={ClicarCard}
     cardsrevelados={cardsRevelados}
    />)
}