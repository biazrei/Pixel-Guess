import gato from '../../assets/gato.jpeg'
import CardGrid from '../CardGrid/CardGrid'
import './GameContainer.css'

export default function GameContainer() {
  return (
    <div className="game-container">
        <img src={gato} alt="Imagem do jogo" />
        <CardGrid/>
    </div>
  )
}