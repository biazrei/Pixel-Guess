import CardGrid from '../CardGrid/CardGrid'
import './GameContainer.css'

type GameContainerProps = {
  imagem:string
  onCardClick?: (index:number) => void;
  cardsrevelados: number[];
  respostaCorreta: boolean;
  
}
export default function GameContainer(props: GameContainerProps) {
  return (
    <div className="game-container">
        <img 
        className={`game-container__imagem ${ props.respostaCorreta ? "game-container__imagem--revelada":""}`}
        src={props.imagem} 
        alt="Imagem do jogo" />
        <CardGrid  
        onClick={props.onCardClick}
        cardsRevelados={props.cardsrevelados}
        respostaCorreta={props.respostaCorreta}/>
    </div>
  )
}

