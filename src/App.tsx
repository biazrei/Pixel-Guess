import Button from './components/Button/Button'
import Title from './components/Title/Title'
import "./styles/global.css"
import "./styles/variables.css"
import Subtitle from './components/Subtitle/Subtitle'
import Text from './components/Text/Text'


export default function App(){
  return (
    <div>
    <Title>Pixel Guess</Title>
    <Subtitle>Adivinhe a imagem oculta</Subtitle>
    <Text>Adivinhe a imagem oculta!</Text>
    <Button cor="pink">IMAGEM DO DIA </Button>
    <Button cor="cyan">SEQUÊNCIA</Button>
    <Button cor="purple">MULTIPLAYER</Button>
    <Button cor="green">PERFIL</Button>
    
    </div>

  )
}
