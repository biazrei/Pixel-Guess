import Title from "../../components/Title/Title";
import Text from "../../components/Text/Text";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router";
import "./Home.css"
import '../../styles/global.css'



export default function Home() {
    const navigate = useNavigate();


    return ( 
    <main className="home">
    <div className="home__text">
    <Title> PIXEL GUESS </Title>
    <Text> Adivinhe a imagem oculta </Text>
     </div>
    <div className="home__buttons">
    <Button background="pink" onClick={() => navigate("/ImagemDoDia")}>IMAGEM DO DIA </Button>
    <Button background="green" onClick={() => navigate("/sequencia")}>SEQUÊNCIA</Button>
    <Button background="purple" onClick={() => navigate("/escolha-modo")}>MULTIPLAYER</Button>
    </div>
    </main>
 )
}
