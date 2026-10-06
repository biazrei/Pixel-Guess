import Button from './components/Button/Button'
import Title from './components/Title/Title'
import "./styles/global.css"
import "./styles/variables.css"



export default function App(){
  return (
    <div>
    <Title>Pixel Guess</Title>
    <p>Adivinhe a imagem oculta</p>
    <Button cor="pink">IMAGEM DO DIA </Button>
    <Button cor="cyan">SEQUÊNCIA</Button>
    <Button cor="purple">MULTIPLAYER</Button>
    <Button cor="green">PERFIL</Button>
    </div>

  )
}
