import Title from "../../components/Title/Title";
import Text from "../../components/Text/Text";
import Button from "../../components/Button/Button";
import "./Home.css"
import { useNavigate } from "react-router";


export default function Home() {
    return ( 
    <main className="home">
    <div className="home__text">
    <Title> Pixel Guess </Title>
    <Text> Adivinhe a imagem oculta </Text>
     </div>
    <div className="home__buttons">
    <Button cor="pink">IMAGEM DO DIA </Button>
    <Button cor="cyan">SEQUÊNCIA</Button>
    <Button cor="purple">MULTIPLAYER</Button>
    <Button cor="green" onClick={}>ENTRAR</Button>
    </div>
    </main>
 )
}
