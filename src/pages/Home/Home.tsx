import Title from "../../components/Title/Title";
import Text from "../../components/Text/Text";
import Button from "../../components/Button/Button";
import "./Home.css"

export default function Home() {
    return ( 
        <main className="home">
        <Title> Pixel Guess </Title>
    <Text> Adivinhe a imagem oculta </Text>
    <div> className="home__button
    <Button cor="pink">IMAGEM DO DIA </Button>
    <Button cor="cyan">SEQUÊNCIA</Button>
    <Button cor="purple">MULTIPLAYER</Button>
    <Button cor="green">ENTRAR</Button>
    </div>
    </main>
 )
}
