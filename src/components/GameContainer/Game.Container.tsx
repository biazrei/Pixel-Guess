import CardGrid from '../CardGrid/CardGrid'
import './GameContainer.css'

type GameContainerProps = {
  imagem:string
  onCardClick?: (index:number) => void;
  cardsrevelados: number[];
}
export default function GameContainer(props: GameContainerProps) {
  return (
    <div className="game-container">
        <img src={props.imagem} alt="Imagem do jogo" />
        <CardGrid  
        onClick={props.onCardClick}
        cardsRevelados={props.cardsrevelados}/>
    </div>
  )
}

