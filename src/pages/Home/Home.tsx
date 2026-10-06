import Title from "../../components/Title/Title";
import Text from "../../components/Text/Text";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router";
import "./Home.css"



export default function Home() {
    const navigate = useNavigate();


    return ( 
    <main className="home">
    <div className="home__text">
    <Title> Pixel Guess </Title>
    <Text> Adivinhe a imagem oculta </Text>
     </div>
    <div className="home__buttons">
    <Button cor="pink" onClick={() => navigate("/ImagemDoDia")}>IMAGEM DO DIA </Button>
    <Button cor="cyan" onClick={() => navigate("/sequencia")}>SEQUÊNCIA</Button>
    <Button cor="purple" onClick={() => navigate("/multiplayer")}>MULTIPLAYER</Button>
    <Button cor="green" onClick={() => navigate("/login")}>ENTRAR</Button>
    </div>
    </main>
 )
}
