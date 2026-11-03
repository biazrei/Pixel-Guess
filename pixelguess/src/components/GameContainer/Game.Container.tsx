import CardGrid from '../CardGrid/CardGrid'
import './GameContainer.css'

type GameContainerProps = {
  imagem:string
  onCardClick?: (index:number) => void;
  cardsrevelados: number[];
  estadoJogo:"jogando"|"vitoria"|"derrota";
  
}
export default function GameContainer(props: GameContainerProps) {
  return (
    <div className="game-container">
        <img 
        className={`game-container__imagem ${ props.estadoJogo !== "jogando" &&"game-container__imagem--revelada"}`}
        src={props.imagem} 
        alt="Imagem do jogo" />
        <CardGrid  
        onClick={props.onCardClick}
        cardsRevelados={props.cardsrevelados}
        estadoJogo={props.estadoJogo}/>
    </div>
  )
}

